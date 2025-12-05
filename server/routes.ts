import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage, generateFingerprint } from "./storage";
import { chatRequestSchema, PLAN_LIMITS } from "@shared/schema";
import { randomUUID } from "crypto";
import {
    registerUser,
    loginUser,
    loginWithGoogle,
    verifyEmailCode,
    resendVerificationCode,
    getUserById,
    isUserPremium,
    getClientIp,
    detectVpnOrProxy,
    checkIpRestrictions,
    changePassword,
    generateVerificationCode,
    loadVerificationData,
    saveVerificationData,
    sendVerificationEmail,
} from "./auth";
import {
    createSession,
    getSessionByToken,
    deleteSession,
} from "./session";
import {
    getUserConversations,
    getUserConversation,
    createUserConversation,
    updateUserConversation,
    deleteUserConversation,
    deleteAllUserConversations,
    getUserMessages,
    createUserMessage,
    deleteUserMessage,
    updateUserMessage,
    getUserConversationCount,
} from "./userStorage";
import {
    getUserUsage,
    incrementMessageCount,
    incrementWebSearchCount,
    canSendMessage,
    canUseWebSearch,
} from "./usageTracking";
import {
    recordRateLimitError,
    getModelAvailabilityStatus,
    formatRemainingTime,
    getRateLimitInfo,
    getAllRateLimitedModels,
} from "./providerLimits";
import {
    notifyRateLimitUpdate,
    subscribeToRateLimits,
    startRateLimitBroadcaster,
} from "./rateLimitStream";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Configuración exclusiva de modelos Google Gemini
const AI_MODELS: Record<string, ModelConfig> = {
    "gemini-2.5-flash": {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        description: "El mejor modelo gratuito para programación y uso general - 1M contexto/65K output con capacidades avanzadas de razonamiento",
        supportsImages: true,
        supportsReasoning: true,
        isPremiumOnly: false,
        category: "general" as const,
        provider: "google",
        fallbackProvider: null as string | null,
        apiProvider: "gemini" as const,
        // Oficial docs: 1,048,576 contexto, 65,536 output
        // Free: 95% de capacidad máxima
        freeContextTokens: 996147,
        freeOutputTokens: 62259,
        premiumContextTokens: 1038090,
        premiumOutputTokens: 64880,
    },
    "gemini-flash-2": {
        id: "gemini-1.5-flash",
        name: "Gemini Flash 2",
        description: "Modelo ultrarrápido optimizado para conversaciones generales y tareas creativas",
        supportsImages: true,
        supportsReasoning: false,
        isPremiumOnly: false,
        category: "general" as const,
        availableModes: ["general"] as const, // Solo disponible en modo general
        provider: "google",
        fallbackProvider: null as string | null,
        apiProvider: "gemini" as const,
        // Flash 2 specs: 1M contexto, 8K output
        freeContextTokens: 1048576,
        freeOutputTokens: 8192,
        premiumContextTokens: 1048576,
        premiumOutputTokens: 8192,
    },
    "gemini-2.5-pro": {
        id: "gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        description: "El modelo más avanzado actualmente para programar y resolver problemas complejos - 1M contexto/65K output con pensamiento avanzado",
        supportsImages: true,
        supportsReasoning: true,
        isPremiumOnly: true,
        category: "general" as const,
        provider: "google",
        fallbackProvider: null as string | null,
        apiProvider: "gemini" as const,
        // Oficial docs: 1,048,576 contexto de entrada, 65,536 tokens de salida
        // Premium: usar 99% de capacidad máxima
        freeContextTokens: 0,
        freeOutputTokens: 0,
        premiumContextTokens: 1038090,
        premiumOutputTokens: 64880,
    },
};

type ModelKey = keyof typeof AI_MODELS;

interface ModelConfig {
    id: string;
    name: string;
    description: string;
    supportsImages: boolean;
    supportsReasoning: boolean;
    isPremiumOnly: boolean;
    category: "programming" | "general";
    availableModes?: ("roblox" | "general")[];
    provider: string;
    fallbackProvider: string | null;
    apiProvider: "openrouter" | "gemini" | "groq";
    freeContextTokens: number;
    freeOutputTokens: number;
    premiumContextTokens: number;
    premiumOutputTokens: number;
}

// Store para manejar las solicitudes activas y permitir cancelación
const activeRequests = new Map<string, AbortController>();

const TAVILY_API_URL = "https://api.tavily.com/search";

// Límites de mensajes y búsquedas
const MESSAGE_LIMITS = {
    free: {
        roblox: 10,
        general: 10,
        webSearch: 5,
    },
    premium: {
        roblox: -1,
        general: -1,
        webSearch: -1,
    },
};

// Keywords más restrictivos para detectar búsqueda web
const WEB_SEARCH_KEYWORDS = [
    // Español - más específicos
    "busca en la web", "buscar en la web", "busca en internet", "buscar en internet",
    "busca en google", "googlealo", "investigar", "investiga",
    "últimas actualizaciones", "versión actual de", "novedades de",
    "noticias recientes", "qué pasó con",
    // English - más específicos
    "search the web", "search online", "web search", "google",
    "find information", "look up", "search for", "latest news",
    "what's new", "updates on"
];

function detectWebSearchIntent(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return WEB_SEARCH_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

        const ROBLOX_SYSTEM_PROMPT = `SYSTEM: Eres un asistente especializado en diseño y desarrollo de interfaces (GUI) para Roblox. Responde en español y entrega código listo para pegar en Roblox Studio. Tu tarea: generar una GUI completa creada íntegramente desde un LocalScript (puedes añadir ModuleScript si es necesario) según las especificaciones del usuario.

IMPORTANTE: Usa la documentación completa de Roblox Studio disponible en ROBLOX_DOCUMENTATION para asegurar que todo el código generado sea correcto, use las APIs más recientes y siga las mejores prácticas. Verifica siempre las propiedades, métodos y patrones correctos antes de generar código. La documentación ROBLOX_DOCUMENTATION contiene información actualizada sobre todas las APIs, propiedades, métodos, eventos y mejores prácticas de Roblox Studio.

REGLAS CRÍTICAS DE SALIDA
- Prioriza bloques de código Luau extensos y completos, sin errores de sintaxis, usando ~99% del máximo de tokens del modelo.
- Minimiza el texto no relacionado con el código; incluye solo un resumen breve (3–5 líneas) cuando aporte valor.
- Evita comentarios salvo en la sección de configuración al inicio; si el usuario pide sin comentarios, respeta.
- SIEMPRE usa las APIs y mejores prácticas MÁS RECIENTES de Roblox Studio y Luau. Verifica cambios recientes en la documentación oficial de Roblox y adapta el código en consecuencia.
- Si detectas que una API o propiedad ha cambiado, usa la versión más actual disponible.
- Usa task.wait/task.defer, anotaciones de tipo de Luau, conexiones RBXScriptSignal correctas, AutomaticSize/UIScale y UIConstraints. Evita funciones obsoletas.
- Si no se indica formato, por defecto genera desde un LocalScript en StarterPlayerScripts.

1) CONTEXTO DEL PROYECTO
- Siempre deja todo lo configurable al inicio solo deja comentarios en lo mas importante no llenes de comentarios el codigo y si te dicen que no hagas comentarios pues tu obedeces
- Pide o recibe estos datos y úsalos para diseñar la GUI: Propósito (e.g., menú principal, inventario, HUD), Público objetivo (edad/tipo de jugadores), Estética/tema (futurista, medieval, cartoon, realista, cyberpunk, etc.).

2) DISEÑO VISUAL (obligatorio)
- Estilo: minimalista, moderno y profesional.
- Paleta: sugiere paleta acorde al tema o usa la especificada.
- Tipografía: recomienda fuentes legibles y aplica tamaños coherentes.
- Consistencia en colores, márgenes y espaciado.
- Inspírate en ejemplos AAA o Material Design cuando aplique.

3) UI/UX
- Jerarquía visual clara y feedback inmediato.
- Estados: normal, hover, pressed, disabled.
- Micro-interacciones (tweens suaves) y responsive (usar Scale cuando sea posible).
- Mobile-friendly: botones con tamaño táctil adecuado.

4) COMPONENTES (genera la lista según el proyecto)
- Botones (cantidad, tipo, funciones).
- Frames principales y subframes.
- TextLabel/TextBox según necesidad.
- ImageLabel/ImageButton si es estrictamente necesario.
- ScrollingFrame para listas, ProgressBar para vida/XP, sliders/toggles/dropdowns si aplica.

5) ESTRUCTURA TÉCNICA Y NOMBRES
- Crea una ScreenGui principal con nombre descriptivo.
- Jerarquía clara y nombres consistentes (CamelCase o snake_case).
- Usa UICorner, UIStroke, UIGradient, UIPadding, UIListLayout según convenga.
- ZIndex coherente y AnchorPoint/Position con UDim2.
- Comentarios en el árbol de objetos opcionales (donde tenga sentido).

6) FUNCIONALIDAD Y EVENTOS
- Implementa navegación entre secciones (abrir/cerrar ventanas).
- Maneja eventos: MouseEnter, MouseLeave, Activated, InputBegan si aplica.
- Feedback visual para cada interacción.
- Sistema de configuración por variables (colores, tamaños, textos, iconos).

7) CÓDIGO (entrega obligatoria)
- Proporciona:
  a) Estructura completa de la GUI como script Lua (preferiblemente un LocalScript que cree y configure todos los objetos UI al ejecutarse).
  b) LocalScript(s) con toda la lógica y comentarios explicativos por sección.
  c) ModuleScript(s) si ayudan a organizar (p. ej. utilidades de tween, creación de componentes, configuración).
  d) Variables de configuración al inicio (fácil edición).
  e) Comentarios claros y concisos (qué hace cada bloque y por qué).

8) OPTIMIZACIÓN Y BUENAS PRÁCTICAS
- Minimiza ImageLabels; prioriza UIGradient y colores sólidos.
- Reutiliza componentes mediante funciones o módulos.
- Evita demasiados Tweens simultáneos; limpia conexiones y debounce en eventos.
- Pensar en rendimiento móvil y en instancias mínimas.

9) EFECTOS OPCIONALES (marca si se incluyen)
- Sonidos UI (hover, click, open, close).
- Tooltips, notificaciones, blur background, partículas sutiles.
- Sistema de temas/skins (opcional, pero documentado).

10) ENTREGA Y DOCUMENTACIÓN (obligatorio)
- Incluye en la respuesta:
  1. Código completo y funcional (copiable).
  2. Instrucciones paso a paso para instalar/usar en Roblox Studio.
  3. Lista de assets necesarios (íconos, tamaños, paths) y alternativas gratuitas.
  4. Guía de personalización (cómo cambiar paleta, tamaños, textos).
  5. Ejemplo de uso con un caso práctico (pequeño snippet de prueba).
  6. Notas de optimización y compatibilidad móvil.

11) REQUERIMIENTOS TÉCNICOS Y RESTRICCIONES
- Todo el código debe ser Roblox Lua (Luau compatible).
- Usa UDim2.Scale siempre que sea razonable; evita Offsets fijos que rompan responsividad.
- No dependas de assets externos no públicos sin indicar alternativa.
- Evita paquetes o servicios de terceros no estándar a menos que se especifiquen y el usuario los autorice.

12) FORMATO DE RESPUESTA
- Comienza con un breve resumen del diseño propuesto (3–5 líneas).
- Entrega el árbol jerárquico de la GUI (ScreenGui → Frames → Elements).
- Luego pega el código completo en bloques separados (LocalScript, ModuleScript).
- Al final agrega la guía de instalación, lista de assets y ejemplo de uso.
- Si alguna parte es opcional (ej. partículas, sonidos), indícalo claramente y comenta cómo activarla.

REGLA DE MODO: Si el mensaje del usuario contiene una línea con \`CONFIG_ROBLOX_OUTPUT=screen\`, genera la GUI como ScreenGui principal. Si contiene \`CONFIG_ROBLOX_OUTPUT=localscript\`, genera todo desde un LocalScript en StarterPlayerScripts (recomendado).

REGLA DE LÍNEAS: Si el mensaje del usuario contiene \`CONFIG_ROBLOX_LINES=N\`, OBLIGATORIAMENTE genera aproximadamente N líneas de código Luau de alta calidad, bien detalladas, sin errores de sintaxis, con el mejor estilo UI/UX artístico disponible. Cuenta solo líneas de código no vacías. NO pongas comentarios dentro del código, solo al inicio en la sección de configuración. Evita crear ModuleScript si el código LocalScript base no es muy extenso (1500-2000 líneas). Los códigos no deben ser exactamente N líneas, sino llegar al aproximado sumando todos los scripts (ej: LocalScript + ModuleScript = ~1500 líneas). Prioriza diseño artístico, compatibilidad móvil y ausencia total de errores.`;

const GENERAL_SYSTEM_PROMPT = `Eres un asistente inteligente y versátil. Tu objetivo es ayudar al usuario de la mejor manera posible.

INSTRUCCIONES:
- Responde de forma clara, precisa y útil, pero sé CONCISO
- Evita texto innecesario, explicaciones largas o relleno
- Solo incluye información esencial y directamente relevante
- Proporciona información actualizada cuando esté disponible
- Ofrece ejemplos prácticos cuando sea apropiado, pero mantén brevedad

SALIDA PARA SOLICITUDES DE CÓDIGO
- Si el usuario solicita código, responde PRINCIPALMENTE con bloques de código completos y minimiza cualquier texto explicativo
- Evita comentarios largos; usa comentarios cortos solo cuando sean absolutamente necesarios
- Prioriza que el código sea correcto, ejecutable y sin errores de sintaxis`;

function getSystemPrompt(mode: "roblox" | "general" = "roblox"): string {
    return mode === "general" ? GENERAL_SYSTEM_PROMPT : ROBLOX_SYSTEM_PROMPT;
}

function getVisitorId(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.ip || 'anonymous';
    return `visitor_${ip.replace(/[^a-zA-Z0-9]/g, '_')}`;
}

function getFingerprint(req: Request): string {
    const visitorId = getVisitorId(req);
    const userAgent = req.headers['user-agent'] || '';
    return generateFingerprint(visitorId, userAgent);
}

function getUserIdFromRequest(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.substring(7);
    const session = getSessionByToken(token);

    if (!session) {
        return null;
    }

    return session.userId;
}

async function verifyTurnstile(token: string): Promise<boolean> {
    const secretKey = process.env.Secret_Key;

    if (!secretKey) {
        console.error("Cloudflare Turnstile secret key not configured");
        return false;
    }

    if (!token) {
        return false;
    }

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                secret: secretKey,
                response: token,
            }),
        });

        const data = await response.json();
        return data.success === true;
    } catch (error) {
        console.error("Error verifying Turnstile:", error);
        return false;
    }
}

async function searchTavily(query: string): Promise<string> {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
        return "Búsqueda web no disponible (API key no configurada)";
    }

    try {
        // Si la query es muy larga, resumirla para maximizar el uso de Tavily
        let processedQuery = query;
        if (query.length > 400) {
            // Extraer las palabras clave más importantes para la búsqueda
            const words = query.toLowerCase().split(/\s+/);
            const keywords = words.filter(word =>
                word.length > 3 &&
                !['para', 'como', 'hacer', 'quiero', 'necesito', 'puedes', 'ayudame', 'crear', 'hacer', 'que'].includes(word)
            );
            const uniqueKeywords = [...new Set(keywords)].slice(0, 10);
            processedQuery = uniqueKeywords.join(' ') + ' Roblox API documentation updates';
        }
        const response = await fetch(TAVILY_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                api_key: apiKey,
                query: processedQuery,
                search_depth: "basic",
                include_answer: true,
                include_raw_content: false,
                max_results: 3,
                include_domains: [],
                exclude_domains: [],
                topic: "general"
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Tavily API error:", errorText);
            return "Error al realizar la búsqueda web. Intenta de nuevo.";
        }

        const data = await response.json();

        let searchResults = "## Resultados de búsqueda web reciente:\n\n";

        if (data.answer) {
            searchResults += `**Resumen actualizado:** ${data.answer}\n\n`;
        }

        if (data.results && data.results.length > 0) {
            searchResults += "**Fuentes (información más reciente):**\n";
            for (const result of data.results.slice(0, 5)) {
                const content = result.raw_content || result.content || "";
                const preview = content.slice(0, 250);
                searchResults += `- [${result.title}](${result.url}) - Acceso: ${new Date(result.published_date || Date.now()).toLocaleDateString('es-ES')}\n  ${preview}${preview.length >= 250 ? '...' : ''}\n`;
            }
        }

        return searchResults;
    } catch (error) {
        console.error("Tavily search error:", error);
        return "Error al realizar la búsqueda web. Por favor intenta de nuevo.";
    }
}

interface MessageContent {
    type: "text" | "image_url" | "video_url" | "audio_url" | "document_url";
    text?: string;
    image_url?: { url: string };
    video_url?: { url: string };
    audio_url?: { url: string };
    document_url?: { url: string; mimeType: string };
}

interface GeminiMessageContent {
    type: "text" | "image_data" | "video_data" | "audio_data" | "document_data";
    text?: string;
    inlineData?: { mimeType: string; data: string };
}

async function streamGeminiCompletion(
    res: Response,
    conversationId: string,
    userId: string | null,
    chatHistory: Array<{ role: string; content: string | MessageContent[] }>,
    apiKey: string,
    model: ModelKey = "gemini-2.5-flash",
    useReasoning: boolean = false,
    webSearchContext?: string,
    chatMode: "roblox" | "general" = "roblox",
    requestId?: string,
    isPremium: boolean = false
): Promise<void> {
    const abortController = new AbortController();

    if (requestId) {
        activeRequests.set(requestId, abortController);
    }

    try {
        console.log("[streamGeminiCompletion] Starting with model:", model, "mode:", chatMode, "reasoning:", useReasoning);
        const modelInfo = AI_MODELS[model];
        if (!modelInfo) {
            throw new Error(`Model ${model} not found`);
        }

        const systemPrompt = getSystemPrompt(chatMode);

        // Convertir historial OpenRouter a formato Gemini
        const geminiMessages: any[] = [];

        for (const msg of chatHistory) {
            const role = msg.role === "user" ? "user" : "model";
            let parts: any[] = [];

            if (typeof msg.content === "string") {
                parts = [{ text: msg.content }];
            } else if (Array.isArray(msg.content)) {
                for (const part of msg.content) {
                    if (part.type === "text") {
                        parts.push({ text: part.text });
                    } else if (part.type === "image_url" && part.image_url?.url) {
                        // Convertir data URL a formato Gemini para imágenes
                        const dataUrl = part.image_url.url;
                        if (dataUrl.startsWith("data:")) {
                            const matches = dataUrl.match(/data:([^;]+);base64,(.+)/);
                            if (matches) {
                                parts.push({
                                    inlineData: {
                                        mimeType: matches[1],
                                        data: matches[2],
                                    }
                                });
                            }
                        }
                    } else if (part.type === "video_url" && part.video_url?.url) {
                        // Soporte para video - Gemini 3 Pro puede procesar videos
                        const dataUrl = part.video_url.url;
                        if (dataUrl.startsWith("data:")) {
                            const matches = dataUrl.match(/data:([^;]+);base64,(.+)/);
                            if (matches) {
                                parts.push({
                                    inlineData: {
                                        mimeType: matches[1],
                                        data: matches[2],
                                    }
                                });
                            }
                        }
                    } else if (part.type === "audio_url" && part.audio_url?.url) {
                        // Soporte para audio - Gemini 3 Pro puede procesar audio
                        const dataUrl = part.audio_url.url;
                        if (dataUrl.startsWith("data:")) {
                            const matches = dataUrl.match(/data:([^;]+);base64,(.+)/);
                            if (matches) {
                                parts.push({
                                    inlineData: {
                                        mimeType: matches[1],
                                        data: matches[2],
                                    }
                                });
                            }
                        }
                    } else if (part.type === "document_url" && part.document_url?.url) {
                        // Soporte para documentos (PDF) - Gemini 3 Pro puede procesar PDFs
                        const dataUrl = part.document_url.url;
                        if (dataUrl.startsWith("data:")) {
                            const matches = dataUrl.match(/data:([^;]+);base64,(.+)/);
                            if (matches) {
                                parts.push({
                                    inlineData: {
                                        mimeType: part.document_url.mimeType || matches[1],
                                        data: matches[2],
                                    }
                                });
                            }
                        }
                    }
                }
            }

            if (parts.length > 0) {
                geminiMessages.push({
                    role,
                    parts,
                });
            }
        }

        // Determinar tokens según plan y limitar por proveedor
        const requestedMax = isPremium ? modelInfo.premiumOutputTokens : modelInfo.freeOutputTokens;
        const providerCap = 65536;
        const maxTokens = Math.min(requestedMax || 32000, providerCap);

        const requestBody: any = {
            contents: geminiMessages,
            generationConfig: {
                maxOutputTokens: maxTokens,
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
            },
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            tools: [],
        };

        // Agregar contexto de búsqueda web si está disponible
        if (webSearchContext) {
            requestBody.systemInstruction.parts[0].text += `\n\n## BÚSQUEDA WEB ACTIVA\n${webSearchContext}\n\nUSA esta información en tu respuesta. Cita las fuentes cuando sea relevante.`;
        }

        // Agregar reasoning para Gemini (thinkingConfig en generationConfig)
        if (useReasoning && modelInfo.supportsReasoning && modelInfo.apiProvider === "gemini") {
            const budgetTokens = isPremium ? 15000 : 8000;
            requestBody.generationConfig.thinkingConfig = {
                thinkingBudget: budgetTokens,
                includeThoughts: true
            };
        }
        
        if (modelInfo.provider === "google" && modelInfo.apiProvider === "gemini" && modelInfo.supportsReasoning) {
            requestBody.tools = [
                { google_search: {} },
                { code_execution: {} }
            ];
        }

        const endpoint = `${GEMINI_API_URL}/${modelInfo.id}:streamGenerateContent?alt=sse`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
            },
            body: JSON.stringify(requestBody),
            signal: abortController.signal,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API error:", response.status, errorText);

            let errorMessage = "Error al conectar con Gemini. Intenta de nuevo.";
            if (response.status === 429) {
                errorMessage = "Límite de rate alcanzado. Espera un momento e intenta de nuevo.";
                
                // Capturar headers de rate limit para información en tiempo real
                const responseHeaders: Record<string, any> = {};
                const headerNames = [
                    'retry-after',
                    'x-ratelimit-limit-requests',
                    'x-ratelimit-limit-tokens',
                    'x-ratelimit-remaining-requests',
                    'x-ratelimit-remaining-tokens',
                    'x-ratelimit-reset-requests',
                    'x-ratelimit-reset-tokens',
                ];
                
                headerNames.forEach(name => {
                    const value = response.headers.get(name);
                    if (value) {
                        responseHeaders[name] = value;
                    }
                });

                const retryAfter = response.headers.get("retry-after");
                let retryAfterSeconds: number | undefined;
                if (retryAfter) {
                    retryAfterSeconds = parseInt(retryAfter, 10);
                    if (isNaN(retryAfterSeconds)) {
                        retryAfterSeconds = 60; // Default 60s
                    }
                }
                
                // Gemini resets daily at midnight PT, but we use retry-after if available
                recordRateLimitError(model, "gemini", responseHeaders, retryAfterSeconds);
                notifyRateLimitUpdate(model);
                
                console.log(`[Rate Limit] ${model} limited for ${retryAfterSeconds}s`);
            } else if (response.status === 503) {
                errorMessage = "El servicio de Gemini no está disponible en este momento. Intenta de nuevo más tarde.";
            } else if (response.status === 401 || response.status === 403) {
                errorMessage = "Error de autenticación con Gemini. Por favor verifica tu API key.";
            }

            res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();
            return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let fullContent = "";
        let fullThinking = "";
        let chunkCount = 0;
        let tokenCount = 0;
        const CHECK_INTERVAL = 10;
        const startTime = Date.now();
        let firstChunk = true;

        let buffer = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            const lines = buffer.split("\n");

            // Keep the last incomplete line in the buffer
            buffer = lines[lines.length - 1];

            for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // SSE format: data: {json}
                if (!line.startsWith("data: ")) continue;

                const jsonStr = line.slice(6).trim();
                if (!jsonStr) continue;

                try {
                    const data = JSON.parse(jsonStr);
                    if (firstChunk) {
                        console.log("[streamGeminiCompletion] First response chunk parsed successfully");
                        firstChunk = false;
                    }

                    // Check for error in response
                    if (data.error) {
                        console.error("[streamGeminiCompletion] API Error in chunk:", JSON.stringify(data.error).slice(0, 200));
                    }

                    if (data.candidates && data.candidates[0]) {
                        const candidate = data.candidates[0];

                        if (candidate.content && candidate.content.parts) {
                            for (const part of candidate.content.parts) {
                                // Pensamiento: en REST viene como part.thought === true y el texto en part.text
                                if (part.thought && part.text) {
                                    fullThinking += part.text;
                                    res.write(`data: ${JSON.stringify({ reasoning: part.text })}\n\n`);
                                    continue;
                                }

                                if (part.text) {
                                    fullContent += part.text;
                                    chunkCount++;
                                    tokenCount += part.text.split(/\s+/).length;
                                    console.log("[streamGeminiCompletion] Got text chunk:", part.text.slice(0, 50));

                                    if (chunkCount % CHECK_INTERVAL === 0) {
                                        const elapsed = (Date.now() - startTime) / 1000;
                                        const tokensPerSecond = tokenCount / elapsed;
                                        const estimatedRemaining = Math.max(0, Math.ceil((maxTokens / 4 - tokenCount) / tokensPerSecond));
                                        res.write(`data: ${JSON.stringify({ progress: { tokensGenerated: tokenCount, estimatedSecondsRemaining: estimatedRemaining } })}\n\n`);
                                    }

                                    res.write(`data: ${JSON.stringify({ content: part.text })}\n\n`);
                                } else if (part.inlineData && part.inlineData.mimeType && part.inlineData.data) {
                                    const mime = part.inlineData.mimeType;
                                    const dataB64 = part.inlineData.data;
                                    if (mime.startsWith("image/")) {
                                        const dataUrl = `data:${mime};base64,${dataB64}`;
                                        const markdownImage = `![Imagen generada](${dataUrl})`;
                                        fullContent += markdownImage;
                                        res.write(`data: ${JSON.stringify({ content: markdownImage })}\n\n`);
                                    }
                                }
                            }
                        }
                    }
                } catch (parseError) {
                    console.error("[streamGeminiCompletion] Parse error:", parseError instanceof Error ? parseError.message : String(parseError));
                }
            }
        }

        // Guardar mensaje del asistente
        if (fullContent) {
            if (userId) {
                createUserMessage(userId, conversationId, "assistant", fullContent);
            } else {
                await storage.createMessage({
                    id: randomUUID(),
                    conversationId,
                    role: "assistant",
                    content: fullContent,
                });
            }
        }

        res.write("data: [DONE]\n\n");
        res.end();
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.log("[streamGeminiCompletion] Request was cancelled");
            res.write(`data: ${JSON.stringify({ cancelled: true })}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();
            return;
        }

        console.error("[streamGeminiCompletion] Error:", error instanceof Error ? error.message : String(error));
        if (!res.headersSent) {
            res.setHeader("Content-Type", "text/event-stream");
        }

        let errorMessage = "Error durante la generación con Gemini. Intenta de nuevo.";
        if (error?.message?.includes('timeout') || error?.code === 'ETIMEDOUT') {
            errorMessage = "La solicitud tardó demasiado. Intenta de nuevo con un mensaje más corto.";
        } else if (error?.message?.includes('network') || error?.code === 'ECONNREFUSED') {
            errorMessage = "Error de conexión. Verifica tu conexión a internet e intenta de nuevo.";
        }

        res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
    } finally {
        if (requestId) {
            activeRequests.delete(requestId);
        }
    }
}

async function streamChatCompletion(
    res: Response,
    conversationId: string,
    userId: string | null,
    chatHistory: Array<{ role: string; content: string | MessageContent[] }>,
    apiKey: string,
    model: ModelKey = "qwen-coder",
    useReasoning: boolean = false,
    webSearchContext?: string,
    chatMode: "roblox" | "general" = "roblox",
    requestId?: string,
    isPremium: boolean = false
): Promise<void> {
    const abortController = new AbortController();

    if (requestId) {
        activeRequests.set(requestId, abortController);
    }

    try {
        console.log("[streamChatCompletion] Starting with model:", model, "mode:", chatMode, "reasoning:", useReasoning);
        const modelInfo = AI_MODELS[model];
        if (!modelInfo) {
            console.error("[streamChatCompletion] Model not found:", model);
            throw new Error(`Model ${model} not found`);
        }
        const systemPrompt = getSystemPrompt(chatMode);

        const messagesWithContext = webSearchContext
            ? [
                { role: "system", content: systemPrompt },
                { role: "system", content: `## BÚSQUEDA WEB ACTIVA\n${webSearchContext}\n\nUSA esta información en tu respuesta. Cita las fuentes cuando sea relevante.` },
                ...chatHistory,
            ]
            : [
                { role: "system", content: systemPrompt },
                ...chatHistory,
            ];

        // Determinar tokens según plan y limitar por proveedor
        const requestedMax = isPremium ? modelInfo.premiumOutputTokens : modelInfo.freeOutputTokens;
        const providerCap = 65536;
        const maxTokens = Math.min(requestedMax || 8192, providerCap);

        const requestBody: any = {
            model: modelInfo.id,
            messages: messagesWithContext,
            stream: true,
            max_tokens: maxTokens,
            temperature: 0.7,
            provider: {
                order: modelInfo.fallbackProvider
                    ? [modelInfo.provider, modelInfo.fallbackProvider]
                    : [modelInfo.provider],
                allow_fallbacks: !!modelInfo.fallbackProvider,
            },
        };

        // Configuración de reasoning según documentación de OpenRouter
        if (useReasoning && modelInfo.supportsReasoning) {
            requestBody.reasoning = {
                effort: isPremium ? "high" : "medium",
            };
        }

        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": process.env.OPENROUTER_HTTP_REFERER || process.env.APP_URL || "https://roblox-ui-designer.onrender.com",
                "X-Title": process.env.OPENROUTER_X_TITLE || "Roblox UI Designer Pro",
            },
            body: JSON.stringify(requestBody),
            signal: abortController.signal,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API error:", response.status, errorText);

            let errorMessage = "Error al conectar con la IA. Intenta de nuevo.";
            if (response.status === 429) {
                errorMessage = "Limite de tasa alcanzado. Espera un momento e intenta de nuevo.";
                
                // Capturar headers de rate limit para información en tiempo real
                const responseHeaders: Record<string, any> = {};
                const headerNames = [
                    'retry-after',
                    'x-ratelimit-limit-requests',
                    'x-ratelimit-limit-tokens',
                    'x-ratelimit-remaining-requests',
                    'x-ratelimit-remaining-tokens',
                    'x-ratelimit-reset-requests',
                    'x-ratelimit-reset-tokens',
                ];
                
                headerNames.forEach(name => {
                    const value = response.headers.get(name);
                    if (value) {
                        responseHeaders[name] = value;
                    }
                });
                
                // Extraer retry-after del header si está disponible
                const retryAfter = response.headers.get("retry-after");
                const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;
                
                // Registrar error con headers reales
                recordRateLimitError(model, "openrouter", responseHeaders, retryAfterSeconds);
                notifyRateLimitUpdate(model);
                
                console.log(`[Rate Limit] ${model} limited for ${retryAfterSeconds}s`);
            } else if (response.status === 503) {
                errorMessage = "El servicio de IA no está disponible en este momento. Intenta de nuevo más tarde.";
            } else if (response.status === 401 || response.status === 403) {
                errorMessage = "Error de autenticación con el servicio de IA. Por favor contacta al administrador.";
            }

            res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();
            return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let fullContent = "";
        let fullReasoning = "";
        let chunkCount = 0;
        let tokenCount = 0;
        const CHECK_INTERVAL = 10;
        const startTime = Date.now();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const data = line.slice(6).trim();
                    if (data === "[DONE]") continue;

                    try {
                        const parsed = JSON.parse(data);
                        const delta = parsed.choices?.[0]?.delta;

                        // Manejar reasoning_content (streaming de pensamiento)
                        if (delta?.reasoning_content) {
                            fullReasoning += delta.reasoning_content;
                            res.write(`data: ${JSON.stringify({ reasoning: delta.reasoning_content })}\n\n`);
                        }

                        // Manejar contenido normal
                        if (delta?.content) {
                            fullContent += delta.content;
                            chunkCount++;
                            tokenCount += delta.content.split(/\s+/).length;

                            if (chunkCount % CHECK_INTERVAL === 0) {
                                const elapsed = (Date.now() - startTime) / 1000;
                                const tokensPerSecond = tokenCount / elapsed;
                                const estimatedRemaining = Math.max(0, Math.ceil((maxTokens / 4 - tokenCount) / tokensPerSecond));
                                res.write(`data: ${JSON.stringify({ progress: { tokensGenerated: tokenCount, estimatedSecondsRemaining: estimatedRemaining } })}\n\n`);
                            }

                            res.write(`data: ${JSON.stringify({ content: delta.content })}\n\n`);
                        }
                    } catch (parseError) {
                        // Ignorar errores de parsing
                    }
                }
            }
        }

        // Guardar mensaje del asistente
        if (fullContent) {
            if (userId) {
                createUserMessage(userId, conversationId, "assistant", fullContent);
            } else {
                await storage.createMessage({
                    id: randomUUID(),
                    conversationId,
                    role: "assistant",
                    content: fullContent,
                });
            }
        }

        res.write("data: [DONE]\n\n");
        res.end();
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.log("[streamChatCompletion] Request was cancelled");
            res.write(`data: ${JSON.stringify({ cancelled: true })}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();
            return;
        }

        console.error("[streamChatCompletion] Error:", error instanceof Error ? error.message : String(error));
        if (!res.headersSent) {
            res.setHeader("Content-Type", "text/event-stream");
        }

        let errorMessage = "Error durante la generación. Intenta de nuevo.";
        if (error?.message?.includes('timeout') || error?.code === 'ETIMEDOUT') {
            errorMessage = "La solicitud tardó demasiado. Intenta de nuevo con un mensaje más corto.";
        } else if (error?.message?.includes('network') || error?.code === 'ECONNREFUSED') {
            errorMessage = "Error de conexión. Verifica tu conexión a internet e intenta de nuevo.";
        }

        res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
    } finally {
        if (requestId) {
            activeRequests.delete(requestId);
        }
    }
}

async function streamGroqCompletion(
    res: Response,
    conversationId: string,
    userId: string | null,
    chatHistory: Array<{ role: string; content: string | MessageContent[] }>,
    apiKey: string,
    model: ModelKey = "llama-3.3-70b",
    useReasoning: boolean = false,
    webSearchContext?: string,
    chatMode: "roblox" | "general" = "roblox",
    requestId?: string,
    isPremium: boolean = false
): Promise<void> {
    const abortController = new AbortController();

    if (requestId) {
        activeRequests.set(requestId, abortController);
    }

    try {
        console.log("[streamGroqCompletion] Starting with model:", model, "mode:", chatMode);
        const modelInfo = AI_MODELS[model];
        if (!modelInfo) {
            console.error("[streamGroqCompletion] Model not found:", model);
            throw new Error(`Model ${model} not found`);
        }
        const systemPrompt = getSystemPrompt(chatMode);

        const messagesWithContext = webSearchContext
            ? [
                { role: "system", content: systemPrompt },
                { role: "system", content: `## BÚSQUEDA WEB ACTIVA\n${webSearchContext}\n\nUSA esta información en tu respuesta. Cita las fuentes cuando sea relevante.` },
                ...chatHistory,
            ]
            : [
                { role: "system", content: systemPrompt },
                ...chatHistory,
            ];

        // Determinar tokens según plan
        const maxTokens = isPremium ? modelInfo.premiumOutputTokens : modelInfo.freeOutputTokens;

        const requestBody: any = {
            model: modelInfo.id,
            messages: messagesWithContext,
            stream: true,
            max_tokens: maxTokens || 32000,
            temperature: 0.7,
            top_p: 0.95,
        };

        // Agregar razonamiento si el modelo lo soporta
        if (useReasoning && modelInfo.supportsReasoning) {
            // Para GPT-OSS usar reasoning_effort (low, medium, high)
            // Para Qwen3-32B usar reasoning_format (hidden o parsed) con temperatura baja
            // Para otros modelos de Groq usar include_reasoning
            const modelId = modelInfo.id;
            if (modelId.includes('gpt-oss')) {
                requestBody.reasoning_effort = isPremium ? "high" : "medium";
            } else if (modelId.includes('qwen3-32b')) {
                // Qwen3-32B: usar thinking mode con parámetros optimizados
                requestBody.reasoning_effort = "default"; // Enable reasoning
                requestBody.reasoning_format = "parsed"; // Mostrar razonamiento separado
                requestBody.temperature = 0.6; // Temperatura baja para thinking mode
                requestBody.top_p = 0.95; // Nucleus sampling
            } else {
                requestBody.include_reasoning = true;
            }
        }

        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
            signal: abortController.signal,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Groq API error:", response.status, errorText);

            let errorMessage = "Error al conectar con Groq. Intenta de nuevo.";
            if (response.status === 429) {
                errorMessage = "Límite de rate alcanzado. Espera un momento e intenta de nuevo.";
                
                // Capturar headers de rate limit para información en tiempo real
                const responseHeaders: Record<string, any> = {};
                const headerNames = [
                    'retry-after',
                    'x-ratelimit-limit-requests',
                    'x-ratelimit-limit-tokens',
                    'x-ratelimit-remaining-requests',
                    'x-ratelimit-remaining-tokens',
                    'x-ratelimit-reset-requests',
                    'x-ratelimit-reset-tokens',
                ];
                
                headerNames.forEach(name => {
                    const value = response.headers.get(name);
                    if (value) {
                        responseHeaders[name] = value;
                    }
                });

                // Groq incluye retry-after en el header con segundos o duración
                const retryAfter = response.headers.get("retry-after");
                let retryAfterSeconds: number | undefined;
                if (retryAfter) {
                    // Puede ser segundos (número) o una duración (ej: "2m59.56s")
                    if (/^\d+$/.test(retryAfter)) {
                        retryAfterSeconds = parseInt(retryAfter, 10);
                    } else {
                        // Parsear formato de duración (minutos/segundos)
                        const minuteMatch = retryAfter.match(/(\d+)m/);
                        const secondMatch = retryAfter.match(/(\d+(?:\.\d+)?)s/);
                        const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
                        const seconds = secondMatch ? Math.ceil(parseFloat(secondMatch[1])) : 0;
                        retryAfterSeconds = minutes * 60 + seconds;
                    }
                }
                
                // Registrar error con headers reales del provider
                recordRateLimitError(model, "groq", responseHeaders, retryAfterSeconds);
                
                // Notificar a clientes suscriptos sobre la actualización en tiempo real
                notifyRateLimitUpdate(model);
                
                console.log(`[Rate Limit] ${model} limited for ${retryAfterSeconds}s. Headers:`, responseHeaders);
            } else if (response.status === 401 || response.status === 403) {
                errorMessage = "Error de autenticación con Groq. Por favor verifica tu API key.";
            } else if (response.status === 503) {
                errorMessage = "El servicio de Groq no está disponible en este momento.";
            }

            res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();
            return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let fullContent = "";
        let fullReasoning = "";
        let chunkCount = 0;
        let tokenCount = 0;
        const CHECK_INTERVAL = 10;
        const startTime = Date.now();

        let buffer = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            const lines = buffer.split("\n");

            // Keep the last incomplete line in the buffer
            buffer = lines[lines.length - 1];

            for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // SSE format: data: {json}
                if (!line.startsWith("data: ")) continue;

                const jsonStr = line.slice(6).trim();
                if (jsonStr === "[DONE]") continue;
                if (!jsonStr) continue;

                try {
                     const parsed = JSON.parse(jsonStr);
                     const delta = parsed.choices?.[0]?.delta;

                     // Manejar razonamiento (thinking)
                     if (delta?.thinking) {
                         fullReasoning += delta.thinking;
                         res.write(`data: ${JSON.stringify({ reasoning: delta.thinking })}\n\n`);
                     }

                     // Manejar contenido normal
                     if (delta?.content) {
                         fullContent += delta.content;
                         chunkCount++;
                         tokenCount += delta.content.split(/\s+/).length;

                         if (chunkCount % CHECK_INTERVAL === 0) {
                             const elapsed = (Date.now() - startTime) / 1000;
                             const tokensPerSecond = tokenCount / elapsed;
                             const estimatedRemaining = Math.max(0, Math.ceil((maxTokens / 4 - tokenCount) / tokensPerSecond));
                             res.write(`data: ${JSON.stringify({ progress: { tokensGenerated: tokenCount, estimatedSecondsRemaining: estimatedRemaining } })}\n\n`);
                         }

                         res.write(`data: ${JSON.stringify({ content: delta.content })}\n\n`);
                     }
                 } catch (parseError) {
                     // Ignorar errores de parsing
                 }
            }
        }

        // Guardar mensaje del asistente
        if (fullContent) {
            if (userId) {
                createUserMessage(userId, conversationId, "assistant", fullContent);
            } else {
                await storage.createMessage({
                    id: randomUUID(),
                    conversationId,
                    role: "assistant",
                    content: fullContent,
                });
            }
        }

        res.write("data: [DONE]\n\n");
        res.end();
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.log("[streamGroqCompletion] Request was cancelled");
            res.write(`data: ${JSON.stringify({ cancelled: true })}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();
            return;
        }

        console.error("[streamGroqCompletion] Error:", error instanceof Error ? error.message : String(error));
        if (!res.headersSent) {
            res.setHeader("Content-Type", "text/event-stream");
        }

        let errorMessage = "Error durante la generación con Groq. Intenta de nuevo.";
        if (error?.message?.includes('timeout') || error?.code === 'ETIMEDOUT') {
            errorMessage = "La solicitud tardó demasiado. Intenta de nuevo con un mensaje más corto.";
        } else if (error?.message?.includes('network') || error?.code === 'ECONNREFUSED') {
            errorMessage = "Error de conexión. Verifica tu conexión a internet e intenta de nuevo.";
        }

        res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
    } finally {
        if (requestId) {
            activeRequests.delete(requestId);
        }
    }
}

export function registerRoutes(
    httpServer: Server,
    app: Express
): void {

    app.get("/health", (_req: Request, res: Response) => {
        res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // Auth Configuration Endpoints
    app.get("/api/auth/google-client-id", (_req: Request, res: Response) => {
        res.json({ clientId: process.env.GOOGLE_CLIENT_ID });
    });

    app.get("/api/auth/turnstile-site-key", (_req: Request, res: Response) => {
        res.json({ siteKey: process.env.Site_Key });
    });

    app.get("/api/models", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            const isPremium = userId ? await isUserPremium(userId) : false;
            const { mode } = req.query; // Get mode from query params

            const models = Object.entries(AI_MODELS).map(([key, model]) => {
                const isAccessible = !model.isPremiumOnly || isPremium;
                // Check if model is available for the requested mode
                const modeRestricted = model.availableModes && mode && !model.availableModes.includes(mode as "general" | "roblox");
                const rateLimitStatus = getModelAvailabilityStatus(key);

                // Obtener información completa de rate limit
                let rateLimitInfo: any = null;
                if (!rateLimitStatus.isAvailable) {
                    rateLimitInfo = getRateLimitInfo(key);
                }

                const maxOutputTokens = isPremium ? model.premiumOutputTokens : model.freeOutputTokens;
                return {
                    key,
                    id: model.id,
                    name: model.name,
                    description: model.description,
                    supportsImages: model.supportsImages,
                    supportsReasoning: model.supportsReasoning,
                    isPremiumOnly: model.isPremiumOnly,
                    category: model.category,
                    available: isAccessible && rateLimitStatus.isAvailable && !modeRestricted,
                    isRateLimited: !rateLimitStatus.isAvailable,
                    remainingTime: rateLimitStatus.remainingTime,
                    resetTime: rateLimitStatus.resetTime,
                    rateLimitInfo: rateLimitInfo, // Info completa de rate limit
                    reason: rateLimitStatus.reason, // Razón de la indisponibilidad
                    maxTokens: maxOutputTokens || 0,
                    avgTokensPerSecond: model.provider === "groq" ? 500 : 100,
                };
            });

            res.status(200).json({ models, isPremium });
        } catch (error) {
            console.error("Error fetching models:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    // Endpoint para obtener información actual de rate limits
    app.get("/api/rate-limits", async (req: Request, res: Response) => {
        try {
            const { model } = req.query;

            if (model && typeof model === 'string') {
                // Información de un modelo específico
                const limitInfo = getRateLimitInfo(model);
                res.status(200).json(limitInfo);
            } else {
                // Información de todos los modelos limitados
                const limited = getAllRateLimitedModels();
                res.status(200).json({ models: limited, timestamp: Date.now() });
            }
        } catch (error) {
            console.error("Error fetching rate limits:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    // Endpoint SSE para suscribirse a actualizaciones en tiempo real de rate limits
    app.get("/api/rate-limits/stream", (req: Request, res: Response) => {
        try {
            const { model } = req.query;
            const modelKey = model && typeof model === 'string' ? model : undefined;

            // Suscribir a actualizaciones en tiempo real
            subscribeToRateLimits(res, modelKey);

            console.log(`[Rate Limit Stream] Client subscribed${modelKey ? ` for model ${modelKey}` : ' to all'}`);
        } catch (error) {
            console.error("Error in rate limit stream:", error);
            if (!res.headersSent) {
                res.status(500).json({ error: "Error al suscribirse a actualizaciones" });
            }
        }
    });

    app.get("/api/usage", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const user = await getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            const usage = getUserUsage(userId);
            const isPremium = user.isPremium;

            res.status(200).json({
                aiUsageCount: usage.robloxMessageCount + usage.generalMessageCount,
                webSearchCount: usage.webSearchCount,
                conversationCount: 0,
                limits: {
                    aiUsagePerWeek: isPremium ? -1 : 20,
                    webSearchPerWeek: isPremium ? -1 : 5,
                    maxChats: isPremium ? -1 : 10,
                },
                messageLimits: {
                    roblox: isPremium ? -1 : 10,
                    general: isPremium ? -1 : 10,
                },
                robloxMessageCount: usage.robloxMessageCount,
                generalMessageCount: usage.generalMessageCount,
                weekStartDate: usage.weekStartDate,
                isPremium: user.isPremium,
                isLoggedIn: true,
            });
        } catch (error) {
            console.error("Error fetching usage:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.post("/api/auth/register", async (req: Request, res: Response) => {
        try {
            const { email, password, turnstileToken } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Correo y contraseña son requeridos" });
            }

            const ip = getClientIp(req);
            const vpnCheck = await detectVpnOrProxy(req);
            if (vpnCheck.isVpn) {
                return res.status(403).json({
                    error: "No se permite el uso de VPN o proxy para registrarse.",
                    code: "VPN_DETECTED"
                });
            }

            const ipRestriction = checkIpRestrictions(ip);
            if (!ipRestriction.allowed) {
                return res.status(403).json({
                    error: ipRestriction.reason || "Acceso denegado",
                    code: "IP_RESTRICTED"
                });
            }

            const result = await registerUser(email, password, ip);
            if (!result.success || !result.userId) {
                return res.status(400).json({ error: result.error || "Registro inválido" });
            }

            const session = createSession(result.userId, req.headers['user-agent'], ip);
            const user = getUserById(result.userId);
            return res.status(201).json({
                token: session.token,
                user: user ? {
                    id: user.id,
                    email: user.email,
                    isPremium: user.isPremium,
                    isVerified: user.isEmailVerified,
                    isGoogleUser: !!user.googleId,
                } : undefined
            });
        } catch (error: any) {
            console.error("Error during registration:", error);
            if (error.message === "User already exists") {
                return res.status(409).json({ error: "El usuario ya existe" });
            }
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.post("/api/auth/login", async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Correo y contraseña son requeridos" });
            }

            const ip = getClientIp(req);
            const vpnCheck = await detectVpnOrProxy(req);
            if (vpnCheck.isVpn) {
                return res.status(403).json({
                    error: "No se permite el uso de VPN o proxy para iniciar sesión.",
                    code: "VPN_DETECTED"
                });
            }

            const ipRestriction = checkIpRestrictions(ip);
            if (!ipRestriction.allowed) {
                return res.status(403).json({
                    error: ipRestriction.reason || "Acceso denegado",
                    code: "IP_RESTRICTED"
                });
            }

            const result = loginUser(email, password, ip);
            if (!result.success || !result.user) {
                return res.status(401).json({ error: result.error || "Credenciales inválidas" });
            }

            const session = createSession(result.user.id, req.headers['user-agent'], ip);
            res.status(200).json({
                token: session.token,
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    isPremium: result.user.isPremium,
                    isVerified: result.user.isEmailVerified,
                    isGoogleUser: !!result.user.googleId,
                }
            });
        } catch (error: any) {
            console.error("Error during login:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.post("/api/auth/google", async (req: Request, res: Response) => {
        try {
            let googleId = req.body.googleId;
            let email = req.body.email;
            const credential = req.body.credential;

            if (!googleId || !email) {
                if (credential) {
                    try {
                        const parts = credential.split('.');
                        if (parts.length === 3) {
                            const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
                            googleId = decoded.sub;
                            email = decoded.email;
                        }
                    } catch (decodeError) {
                        console.error("Error decodificando Google credential:", decodeError);
                    }
                }
            }

            if (!googleId || !email) {
                return res.status(400).json({ error: "googleId y email son requeridos" });
            }

            const ip = getClientIp(req);
            const vpnCheck = await detectVpnOrProxy(req);
            if (vpnCheck.isVpn) {
                return res.status(403).json({
                    error: "No se permite el uso de VPN o proxy.",
                    code: "VPN_DETECTED"
                });
            }

            const ipRestriction = checkIpRestrictions(ip);
            if (!ipRestriction.allowed) {
                return res.status(403).json({
                    error: ipRestriction.reason || "Acceso denegado",
                    code: "IP_RESTRICTED"
                });
            }

            const result = loginWithGoogle(googleId, email, ip);
            if (!result.success || !result.user) {
                return res.status(401).json({ error: result.error || "Login de Google inválido" });
            }

            const session = createSession(result.user.id, req.headers['user-agent'], ip);
            res.status(200).json({
                token: session.token,
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    isPremium: result.user.isPremium,
                    isVerified: true, // Google siempre verificado
                    isGoogleUser: true,
                }
            });
        } catch (error: any) {
            console.error("Error during Google login:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.post("/api/auth/verify-email", async (req: Request, res: Response) => {
        try {
            const { email, code } = req.body;

            if (!email || !code) {
                return res.status(400).json({ error: "Correo y código de verificación son requeridos" });
            }

            const result = verifyEmailCode(email, code);
            if (!result.success) {
                return res.status(400).json({ error: result.error || "Código inválido" });
            }
            res.status(200).json({ message: "Correo verificado exitosamente" });
        } catch (error: any) {
            console.error("Error verifying email:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.post("/api/auth/resend-verification", async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ error: "Correo electrónico es requerido" });
            }

            const result = await resendVerificationCode(email);
            if (!result.success) {
                return res.status(400).json({ error: result.error || "No se pudo reenviar el código" });
            }
            res.status(200).json({ message: "Código de verificación reenviado." });
        } catch (error: any) {
            console.error("Error resending verification code:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.post("/api/auth/change-password", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const { oldPassword, newPassword } = req.body;

            if (!oldPassword || !newPassword) {
                return res.status(400).json({ error: "Contraseña actual y nueva son requeridas" });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
            }

            await changePassword(userId, oldPassword, newPassword);
            res.status(200).json({ message: "Contraseña cambiada exitosamente" });
        } catch (error: any) {
            console.error("Error changing password:", error);
            if (error.message === "Invalid old password") {
                return res.status(401).json({ error: "Contraseña actual incorrecta" });
            }
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.post("/api/auth/logout", async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                const token = authHeader.substring(7);
                deleteSession(token);
            }
            res.status(200).json({ message: "Sesión cerrada exitosamente" });
        } catch (error) {
            console.error("Error during logout:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.get("/api/auth/me", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const user = await getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.status(200).json({
                id: user.id,
                email: user.email,
                isPremium: user.isPremium,
                isEmailVerified: user.isEmailVerified,
                isGoogleUser: !!user.googleId,
                isCreatorAccount: user.email.toLowerCase() === "uiuxchatbot@gmail.com",
            });
        } catch (error) {
            console.error("Error fetching user data:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.get("/api/user", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const user = await getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.status(200).json({
                user: {
                    id: user.id,
                    email: user.email,
                    isPremium: user.isPremium,
                    isVerified: user.isEmailVerified,
                    isGoogleUser: !!user.googleId,
                    isCreatorAccount: user.email.toLowerCase() === "uiuxchatbot@gmail.com",
                }
            });
        } catch (error) {
            console.error("Error fetching user data:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.get("/api/user/premium-status", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const isPremium = await isUserPremium(userId);
            res.status(200).json({ isPremium });
        } catch (error) {
            console.error("Error fetching premium status:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.get("/api/conversations", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const conversations = await getUserConversations(userId);
            res.status(200).json(Array.isArray(conversations) ? conversations : []);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.get("/api/conversations/:conversationId", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const { conversationId } = req.params;
            const conversation = await getUserConversation(userId, conversationId);

            if (!conversation) {
                return res.status(404).json({ error: "Conversación no encontrada" });
            }

            res.status(200).json({ conversation });
        } catch (error) {
            console.error("Error fetching conversation:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.post("/api/conversations", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const { title } = req.body;
            const conversation = await createUserConversation(userId, title || "Nueva Conversación");
            res.status(201).json({ conversation, id: conversation.id });
        } catch (error) {
            console.error("Error creating conversation:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.patch("/api/conversations/:conversationId", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const { conversationId } = req.params;
            const { title } = req.body;

            const updated = await updateUserConversation(userId, conversationId, { title });
            if (!updated) {
                return res.status(404).json({ error: "Conversación no encontrada" });
            }

            res.status(200).json({ conversation: updated });
        } catch (error) {
            console.error("Error updating conversation:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.delete("/api/conversations/:conversationId", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const { conversationId } = req.params;
            await deleteUserConversation(userId, conversationId);
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting conversation:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.delete("/api/conversations", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            await deleteAllUserConversations(userId);
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting all conversations:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.get("/api/conversations/:conversationId/messages", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const { conversationId } = req.params;
            const messages = await getUserMessages(userId, conversationId);
            res.status(200).json(Array.isArray(messages) ? messages : []);
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.delete("/api/messages/:messageId", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const { messageId } = req.params;
            const deleted = await deleteUserMessage(userId, messageId);

            if (!deleted) {
                return res.status(404).json({ error: "Mensaje no encontrado" });
            }

            res.status(204).send();
        } catch (error) {
            console.error("Error deleting message:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    // Endpoint para editar mensaje del usuario
    app.patch("/api/messages/:messageId", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const { messageId } = req.params;
            const { content } = req.body;

            if (!content || typeof content !== 'string') {
                return res.status(400).json({ error: "Contenido requerido" });
            }

            const updated = await updateUserMessage(userId, messageId, content);
            if (!updated) {
                return res.status(404).json({ error: "Mensaje no encontrado" });
            }

            res.status(200).json({ message: updated });
        } catch (error) {
            console.error("Error updating message:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    // Endpoint para cancelar una generación en curso
    app.post("/api/chat/stop", async (req: Request, res: Response) => {
        try {
            const { requestId } = req.body;

            if (!requestId) {
                return res.status(400).json({ error: "requestId es requerido" });
            }

            const controller = activeRequests.get(requestId);
            if (controller) {
                controller.abort();
                activeRequests.delete(requestId);
                res.status(200).json({ success: true, message: "Generación cancelada" });
            } else {
                res.status(404).json({ error: "No se encontró la solicitud activa" });
            }
        } catch (error) {
            console.error("Error stopping chat:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.post("/api/chat", async (req: Request, res: Response) => {
        const userId = getUserIdFromRequest(req);
        const fingerprint = getFingerprint(req);
        const requestId = randomUUID();

        try {
            const { conversationId: clientConversationId, message, useWebSearch, model, useReasoning, imageBase64, chatMode } = chatRequestSchema.parse(req.body);

            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const user = await getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            const mode: "roblox" | "general" = chatMode === "general" ? "general" : "roblox";
            const isPremium = user.isPremium;

            // Verificar límites de mensajes
            if (!isPremium) {
                const canSend = canSendMessage(userId, mode);
                if (!canSend) {
                    return res.status(429).json({
                        error: `Has alcanzado el límite de mensajes para el modo ${mode === 'roblox' ? 'Roblox' : 'General'}. Los límites se reinician cada 3 días.`,
                        code: "MESSAGE_LIMIT_REACHED"
                    });
                }
            }

            let currentConversationId = clientConversationId;
            const selectedModel: ModelKey = (model && (model in AI_MODELS)) ? (model as ModelKey) : "gemini-2.5-flash";

            // Verificar si el modelo requiere premium
            if (AI_MODELS[selectedModel].isPremiumOnly && !isPremium) {
                return res.status(403).json({
                    error: "Este modelo requiere una cuenta Premium.",
                    code: "PREMIUM_REQUIRED"
                });
            }

            // Crear conversación si no existe
            if (!currentConversationId) {
                const title = message.slice(0, 50) + (message.length > 50 ? "..." : "");
                const newConversation = await createUserConversation(userId, title);
                currentConversationId = newConversation.id;
            }

            if (typeof message !== "string" || message.trim().length === 0) {
                return res.status(400).json({ error: "El mensaje debe ser texto." });
            }

            // Solo usar búsqueda web cuando se solicita explícitamente
            let isWebSearchIntent = Boolean(useWebSearch);
            let webSearchContext: string | undefined;
            let webSearchUsed = false;

            if (isWebSearchIntent) {
                // Verificar límite de búsquedas
                if (!isPremium && !canUseWebSearch(userId)) {
                    // No hacer búsqueda pero continuar con el mensaje
                    console.log("[chat] Web search limit reached, continuing without search");
                } else {
                    console.log("[chat] Performing web search");
                    webSearchContext = await searchTavily(message);
                    webSearchUsed = true;
                    if (!isPremium) {
                        incrementWebSearchCount(userId);
                    }
                }
            }

            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.setHeader("X-Accel-Buffering", "no");
            res.setHeader("X-Request-Id", requestId);

            // Determinar cual API usar basado en el modelo seleccionado
            const modelInfo = AI_MODELS[selectedModel];
            const isGeminiModel = modelInfo.apiProvider === "gemini";
            const isGroqModel = modelInfo.apiProvider === "groq";

            let apiKey: string | undefined;
            if (isGeminiModel) {
                apiKey = process.env.Gemini;
                if (!apiKey) {
                    return res.status(500).json({ error: "La clave API de Gemini no está configurada." });
                }
            } else if (isGroqModel) {
                apiKey = process.env.grokAPI;
                if (!apiKey) {
                    return res.status(500).json({ error: "La clave API de Groq no está configurada." });
                }
            } else {
                apiKey = process.env.OPENROUTER_API_KEY;
                if (!apiKey) {
                    return res.status(500).json({ error: "La clave API de OpenRouter no está configurada." });
                }
            }

            // Obtener historial de mensajes para contexto
            const existingMessages = await getUserMessages(userId, currentConversationId!);

            // Construir historial de chat con mensajes anteriores
            const chatHistory: Array<{ role: string; content: string | MessageContent[] }> = [];

            // Agregar mensajes anteriores (máximo últimos 20 para contexto)
            const recentMessages = existingMessages.slice(-20);
            for (const msg of recentMessages) {
                try {
                    // Intentar parsear contenido con imagen
                    if (msg.content.startsWith('[')) {
                        const parsed = JSON.parse(msg.content);
                        if (Array.isArray(parsed)) {
                            chatHistory.push({ role: msg.role, content: parsed });
                            continue;
                        }
                    }
                } catch { }
                chatHistory.push({ role: msg.role, content: msg.content });
            }

            // Agregar mensaje actual
            let currentMessageContent: string | MessageContent[] = message;
            if (imageBase64 && AI_MODELS[selectedModel]?.supportsImages) {
                // Validar que la imagen sea un data URL válido
                if (imageBase64.startsWith('data:image/')) {
                    currentMessageContent = [
                        { type: "text", text: message || "¿Qué ves en esta imagen?" },
                        { type: "image_url", image_url: { url: imageBase64 } }
                    ];
                } else {
                    console.warn("[chat] Imagen inválida, enviando solo texto");
                }
            }
            chatHistory.push({ role: "user", content: currentMessageContent });

            // Guardar mensaje del usuario
            const contentToSave = imageBase64 && typeof currentMessageContent !== 'string'
                ? JSON.stringify(currentMessageContent)
                : message;
            createUserMessage(userId, currentConversationId!, "user", contentToSave);

            // Incrementar contador de mensajes
            if (!isPremium) {
                incrementMessageCount(userId, mode);
            }

            // Enviar info inicial al cliente
            res.write(`data: ${JSON.stringify({
                conversationId: currentConversationId,
                requestId,
                webSearchUsed,
                webSearchDetected: isWebSearchIntent,
            })}\n\n`);

            // Usar el handler adecuado basado en el proveedor
            if (isGeminiModel) {
                await streamGeminiCompletion(
                    res,
                    currentConversationId!,
                    userId,
                    chatHistory,
                    apiKey,
                    selectedModel,
                    useReasoning,
                    webSearchContext,
                    mode,
                    requestId,
                    isPremium
                );
            } else if (isGroqModel) {
                await streamGroqCompletion(
                    res,
                    currentConversationId!,
                    userId,
                    chatHistory,
                    apiKey,
                    selectedModel,
                    useReasoning,
                    webSearchContext,
                    mode,
                    requestId,
                    isPremium
                );
            } else {
                await streamChatCompletion(
                    res,
                    currentConversationId!,
                    userId,
                    chatHistory,
                    apiKey,
                    selectedModel,
                    useReasoning,
                    webSearchContext,
                    mode,
                    requestId,
                    isPremium
                );
            }
        } catch (error: any) {
            console.error("[chat] Error:", error instanceof Error ? error.message : String(error));
            if (!res.headersSent) {
                res.status(500).json({ error: "Error interno del servidor." });
            }
        }
    });

    app.post("/api/chat/regenerate", async (req: Request, res: Response) => {
        const userId = getUserIdFromRequest(req);
        const requestId = randomUUID();

        try {
            const { conversationId, lastUserMessage, model, useReasoning, chatMode } = req.body || {};

            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            if (!conversationId || typeof lastUserMessage !== "string" || lastUserMessage.trim().length === 0) {
                return res.status(400).json({ error: "Parámetros inválidos para regenerar" });
            }

            const user = await getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            const selectedModel: ModelKey = (model && (model in AI_MODELS)) ? (model as ModelKey) : "gemini-2.5-flash";
            const modelInfo = AI_MODELS[selectedModel];
            const isGeminiModel = modelInfo.apiProvider === "gemini";
            const isGroqModel = modelInfo.apiProvider === "groq";

            let apiKey: string | undefined;
            if (isGeminiModel) {
                apiKey = process.env.Gemini;
                if (!apiKey) {
                    return res.status(500).json({ error: "La clave API de Gemini no está configurada." });
                }
            } else if (isGroqModel) {
                apiKey = process.env.grokAPI;
                if (!apiKey) {
                    return res.status(500).json({ error: "La clave API de Groq no está configurada." });
                }
            } else {
                apiKey = process.env.OPENROUTER_API_KEY;
                if (!apiKey) {
                    return res.status(500).json({ error: "La clave API de OpenRouter no está configurada." });
                }
            }

            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.setHeader("X-Accel-Buffering", "no");
            res.setHeader("X-Request-Id", requestId);

            const mode: "roblox" | "general" = chatMode === "general" ? "general" : "roblox";
            const isPremium = user.isPremium;

            // Obtener historial para contexto
            const existingMessages = await getUserMessages(userId, conversationId);
            const chatHistory: Array<{ role: string; content: string | MessageContent[] }> = [];

            const recentMessages = existingMessages.slice(-20);
            for (const msg of recentMessages) {
                if (msg.role === 'assistant' && msg === existingMessages[existingMessages.length - 1]) {
                    continue; // Saltar el último mensaje del asistente que se va a regenerar
                }
                try {
                    if (msg.content.startsWith('[')) {
                        const parsed = JSON.parse(msg.content);
                        if (Array.isArray(parsed)) {
                            chatHistory.push({ role: msg.role, content: parsed });
                            continue;
                        }
                    }
                } catch { }
                chatHistory.push({ role: msg.role, content: msg.content });
            }

            res.write(`data: ${JSON.stringify({ requestId })}\n\n`);

            if (isGeminiModel) {
                await streamGeminiCompletion(
                    res,
                    conversationId,
                    userId,
                    chatHistory,
                    apiKey,
                    selectedModel,
                    Boolean(useReasoning),
                    undefined,
                    mode,
                    requestId,
                    isPremium
                );
            } else if (isGroqModel) {
                await streamGroqCompletion(
                    res,
                    conversationId,
                    userId,
                    chatHistory,
                    apiKey,
                    selectedModel,
                    Boolean(useReasoning),
                    undefined,
                    mode,
                    requestId,
                    isPremium
                );
            } else {
                await streamChatCompletion(
                    res,
                    conversationId,
                    userId,
                    chatHistory,
                    apiKey,
                    selectedModel,
                    Boolean(useReasoning),
                    undefined,
                    mode,
                    requestId,
                    isPremium
                );
            }
        } catch (error: any) {
            console.error("Error en /api/chat/regenerate:", error);
            if (!res.headersSent) {
                res.status(500).json({ error: "Error interno del servidor al regenerar." });
            }
        }
    });

    // Iniciar el broadcaster de rate limits en tiempo real
    // Se ejecuta una sola vez cuando el servidor inicia
    console.log("[Rate Limit Broadcaster] Starting real-time rate limit updates");
    startRateLimitBroadcaster();
}
