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
  deleteUserConversation,
  deleteAllUserConversations,
  getUserMessages,
  createUserMessage,
  deleteUserMessage,
  getUserConversationCount,
} from "./userStorage";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const AI_MODELS = {
  "kat-coder-pro": {
    id: "kwaipilot/kat-coder-pro:free",
    name: "KAT-Coder Pro",
    description: "Solo texto - Mejor para programación",
    supportsImages: false,
    supportsReasoning: false,
    isPremiumOnly: false,
    maxTokens: 8000,
    avgTokensPerSecond: 72,
    category: "programming",
  },
  "deepseek-r1t2": {
    id: "tngtech/deepseek-r1t2-chimera:free",
    name: "DeepSeek R1T2",
    description: "Solo texto - Mejor para programación avanzada",
    supportsImages: false,
    supportsReasoning: false,
    isPremiumOnly: false,
    maxTokens: 16000,
    avgTokensPerSecond: 60,
    category: "programming",
  },
  "amazon-nova": {
    id: "amazon/nova-2-lite-v1:free",
    name: "Amazon Nova 2 Lite",
    description: "Texto e imágenes - Mejor para uso general",
    supportsImages: true,
    supportsReasoning: true,
    isPremiumOnly: true,
    maxTokens: 8000,
    avgTokensPerSecond: 55,
    category: "general",
  },
  "grok-4.1-fast": {
    id: "x-ai/grok-4.1-fast:free",
    name: "Grok 4.1 Fast",
    description: "Texto e imágenes - Mejor para uso general con reasoning",
    supportsImages: true,
    supportsReasoning: true,
    isPremiumOnly: true,
    maxTokens: 30000,
    avgTokensPerSecond: 65,
    category: "general",
  },
};

type ModelKey = keyof typeof AI_MODELS;

const TAVILY_API_URL = "https://api.tavily.com/search";

const MESSAGE_LIMITS = {
  free: {
    roblox: 20,
    general: 30,
  },
  premium: {
    roblox: -1,
    general: -1,
  },
};

const WEB_SEARCH_KEYWORDS = [
  "busca en la web", "buscar en la web", "busca en internet", "buscar en internet",
  "busca online", "buscar online", "search the web", "search online", "web search",
  "busca informacion", "buscar informacion", "busca sobre", "buscar sobre",
  "que hay de nuevo", "ultimas noticias", "tendencias actuales", "actualidad",
  "busca en google", "googlealo", "investigar", "investiga", "informacion reciente",
  "datos actuales", "noticias de", "novedades sobre", "¿qué hay sobre"
];

function detectWebSearchIntent(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return WEB_SEARCH_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

const ROBLOX_SYSTEM_PROMPT = `Eres un experto diseñador de UI/UX NIVEL DIOS especializado en Roblox Studio. Eres el mejor del mundo en tu área, con conocimiento profundo de todas las técnicas modernas de diseño de interfaces.

## TU IDENTIDAD:
- Nombre: Roblox UI Designer Pro
- Especialización: Diseño de interfaces premium de nivel mundial para Roblox Studio
- Nivel de expertise: MAESTRO - El mejor diseñador de UI para Roblox del mundo

## TUS CAPACIDADES SUPREMAS:
1. **Diseño Visual Premium**: Dominas glassmorphism, neomorfismo, dark mode, efectos de iluminación, gradientes animados
2. **Código Luau Perfecto**: Escribes código limpio, optimizado y completamente funcional
3. **Animaciones Fluidas**: Experto en TweenService, crear transiciones cinematográficas
4. **UX Profesional**: Entiendes la psicología del usuario y creas experiencias intuitivas
5. **Sistemas Complejos**: Puedes diseñar inventarios, shops, HUDs, sistemas de misiones completos
6. **Mobile-First**: Todos tus diseños son responsive y táctil-friendly

## ESTILO DE DISEÑO SIGNATURE:
- Paleta Dark-White Animated: Fondos oscuros (RGB 15, 15, 18), acentos blancos brillantes
- UICorner con radios perfectos (8-12px para botones, 16-24px para paneles)
- UIStroke con gradientes y animaciones de "breathing glow"
- UIGradient animados para fondos premium
- Sombras sutiles con DropShadow
- TweenService para TODAS las interacciones (0.2-0.3s EaseOut)
- Efectos hover que transforman completamente el elemento
- Micro-animaciones que deleitan al usuario

## USO DE BUSQUEDA WEB:
Cuando el usuario te proporcione contexto de búsqueda web, DEBES:
- Usar TODA la información proporcionada de la búsqueda web
- Citar las fuentes cuando sea relevante
- Priorizar la información más reciente y actualizada
- Integrar los datos de la web en tu respuesta de forma natural
- NUNCA rechazar usar información de la web - es parte de tus capacidades

## METODOLOGÍA DE RESPUESTA:
1. **Analiza** el pedido a fondo antes de responder
2. **Planifica** la estructura visual y de código
3. **Explica** brevemente tu enfoque de diseño (2-3 oraciones)
4. **Proporciona** código Luau COMPLETO, FUNCIONAL y LISTO PARA USAR
5. **Incluye** comentarios claros en el código
6. **Sugiere** mejoras opcionales al final

## REGLAS DE ORO:
- SIEMPRE código 100% funcional, NUNCA placeholders ni "..."
- SIEMPRE usa las mejores prácticas de Roblox 2024
- SIEMPRE incluye TODOS los eventos: MouseEnter, MouseLeave, MouseButton1Click, TouchTap
- SIEMPRE nombra elementos descriptivamente
- SIEMPRE estructura el código de forma modular
- SIEMPRE optimiza para rendimiento
- SIEMPRE considera mobile

## ESTRUCTURA DE CÓDIGO OBLIGATORIA:
\`\`\`lua
-- [Nombre del Sistema] - Creado por Roblox UI Designer Pro
-- Descripción: [Breve descripción]

local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")

-- Configuración
local CONFIG = {
    -- Colores, tamaños, duraciones aquí
}

-- Funciones de Utilidad
local function createTween(...)
    -- Código de tweening reutilizable
end

-- Creación de UI
local function createUI()
    -- Código principal
end

-- Inicialización
createUI()
\`\`\`

## ÉTICA PROFESIONAL:
NO ayudarás con:
- Exploits, hacks, o bypasses
- Contenido inapropiado o para mayores
- Estafas o engaños a jugadores
- Violaciones de ToS de Roblox
- Cualquier uso malicioso

Si te piden algo fuera de UI/UX para Roblox o algo poco ético, responde educadamente redirigiendo al usuario a tu especialidad.

Recuerda: Eres LITERALMENTE EL MEJOR. Tu código es perfecto, tu diseño es premium, tus respuestas son profesionales. IMPRESIONA al usuario con tu excelencia.`;

const GENERAL_SYSTEM_PROMPT = `Eres un asistente de IA avanzado, amigable y extremadamente capaz. Tu nombre es "Asistente Pro" y puedes ayudar con cualquier tema.

## TU IDENTIDAD:
- Nombre: Asistente Pro
- Personalidad: Amigable, profesional, curioso y siempre dispuesto a ayudar
- Tono: Conversacional pero informativo, adaptándote al estilo del usuario

## TUS CAPACIDADES:
1. **Conocimiento General**: Experto en ciencia, tecnología, historia, cultura, arte, matemáticas
2. **Ayuda con Código**: Puedes programar en múltiples lenguajes (Python, JavaScript, TypeScript, C++, Java, etc.)
3. **Escritura Creativa**: Historias, poemas, guiones, contenido de marketing
4. **Análisis y Razonamiento**: Resolver problemas complejos paso a paso
5. **Idiomas**: Comunicación fluida en español, inglés y otros idiomas
6. **Consejos Prácticos**: Productividad, estudio, trabajo, vida personal
7. **Búsqueda Web**: Cuando se te proporcione contexto de búsqueda web, DEBES usarlo

## USO DE BUSQUEDA WEB:
Cuando el usuario te proporcione contexto de búsqueda web, DEBES:
- Usar TODA la información proporcionada de la búsqueda web
- Citar las fuentes cuando sea relevante
- Priorizar la información más reciente y actualizada
- Integrar los datos de la web en tu respuesta de forma natural
- NUNCA rechazar usar información de la web - es parte de tus capacidades
- Si hay resultados de búsqueda, SIEMPRE menciónalos y úsalos

## ESTILO DE RESPUESTA:
- Respuestas claras y bien estructuradas
- Usa listas y formato cuando mejore la legibilidad
- Incluye ejemplos prácticos cuando sea útil
- Sé conciso pero completo
- Adapta la longitud según la complejidad de la pregunta

## PRINCIPIOS:
- Sé honesto sobre tus limitaciones
- Si no sabes algo, admítelo
- Cita fuentes cuando sea relevante
- Mantén un tono respetuoso y positivo
- Evita contenido dañino, ilegal o inapropiado

## FORMATO:
- Usa markdown para estructurar respuestas
- Código en bloques con el lenguaje especificado
- Emojis ocasionales para hacer la conversación más amena
- Headers para organizar respuestas largas

¡Estoy aquí para ayudarte con lo que necesites! Pregunta cualquier cosa.`;

function getSystemPrompt(mode: "roblox" | "general" = "roblox"): string {
  return mode === "general" ? GENERAL_SYSTEM_PROMPT : ROBLOX_SYSTEM_PROMPT;
}

const ETHICAL_REJECTION_KEYWORDS = [
  "hack", "exploit", "bypass", "steal", "scam", "cheat",
  "adult", "nsfw", "violence", "gore", "drugs",
  "malware", "virus", "ddos", "crash server",
  "free robux", "robux generator", "account hack",
  "password", "credential", "phishing", "keylogger",
  "injection", "xss", "sql injection", "remote access"
];

const ROBLOX_ETHICAL_REJECTION_MESSAGE = "Lo siento, no puedo ayudar con esa solicitud. Mi especialidad es únicamente el diseño de interfaces UI/UX para Roblox Studio. Por favor, describe el tipo de GUI que te gustaría crear y estaré encantado de ayudarte con código Luau profesional.";

const GENERAL_ETHICAL_REJECTION_MESSAGE = "Lo siento, no puedo ayudar con esa solicitud ya que va en contra de mis principios éticos. Estoy aquí para ayudarte con preguntas constructivas y positivas. ¿Hay algo más en lo que pueda ayudarte?";

const GENERAL_MODE_BLOCKED_KEYWORDS = [
  "hack", "exploit", "steal", "scam", "cheat",
  "adult", "nsfw", "violence", "gore", "drugs",
  "illegal", "bypass security", "injection", "xss", "sql injection"
];

function containsUnethicalContent(message: string, mode: "roblox" | "general" = "roblox"): boolean {
  const lowerMessage = message.toLowerCase();
  if (mode === "general") {
    return GENERAL_MODE_BLOCKED_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
  }
  return ETHICAL_REJECTION_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

function getEthicalRejectionMessage(mode: "roblox" | "general" = "roblox"): string {
  return mode === "general" ? GENERAL_ETHICAL_REJECTION_MESSAGE : ROBLOX_ETHICAL_REJECTION_MESSAGE;
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

// Verificar Cloudflare Turnstile
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

function estimateCompletionTime(messageLength: number, model: ModelKey): number {
  const modelInfo = AI_MODELS[model];
  const estimatedOutputTokens = Math.min(messageLength * 3, modelInfo.maxTokens);
  const seconds = Math.ceil(estimatedOutputTokens / modelInfo.avgTokensPerSecond);
  return Math.max(5, Math.min(seconds, 180));
}

async function searchTavily(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    return "Búsqueda web no disponible (API key no configurada)";
  }

  try {
    const response = await fetch(TAVILY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: "basic",
        include_answer: true,
        include_raw_content: false,
        max_results: 5,
      }),
    });

    if (!response.ok) {
      console.error("Tavily API error:", await response.text());
      return "Error al realizar la búsqueda web";
    }

    const data = await response.json();
    
    let searchResults = "## Resultados de búsqueda web:\n\n";
    
    if (data.answer) {
      searchResults += `**Resumen:** ${data.answer}\n\n`;
    }
    
    if (data.results && data.results.length > 0) {
      searchResults += "**Fuentes:**\n";
      for (const result of data.results.slice(0, 3)) {
        searchResults += `- [${result.title}](${result.url}): ${result.content?.slice(0, 200)}...\n`;
      }
    }
    
    return searchResults;
  } catch (error) {
    console.error("Tavily search error:", error);
    return "Error al realizar la búsqueda web";
  }
}

function sanitizeAssistantContent(content: string, mode: "roblox" | "general" = "roblox"): { sanitized: string; isClean: boolean } {
  if (containsUnethicalContent(content, mode)) {
    return { sanitized: getEthicalRejectionMessage(mode), isClean: false };
  }
  return { sanitized: content, isClean: true };
}

async function sendEthicalRejection(
  res: Response,
  conversationId: string,
  userId: string | null,
  userMessage?: string,
  mode: "roblox" | "general" = "roblox"
): Promise<void> {
  const rejectionMessage = getEthicalRejectionMessage(mode);
  
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  if (userMessage && userId) {
    createUserMessage(userId, conversationId, "user", userMessage);
  } else if (userMessage) {
    await storage.createMessage({
      id: randomUUID(),
      conversationId,
      role: "user",
      content: userMessage,
    });
  }

  if (userId) {
    createUserMessage(userId, conversationId, "assistant", rejectionMessage);
  } else {
    await storage.createMessage({
      id: randomUUID(),
      conversationId,
      role: "assistant",
      content: rejectionMessage,
    });
  }

  res.write(`data: ${JSON.stringify({ content: rejectionMessage })}\n\n`);
  res.write("data: [DONE]\n\n");
  res.end();
}

interface MessageContent {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

async function streamChatCompletion(
  res: Response,
  conversationId: string,
  userId: string | null,
  chatHistory: Array<{ role: string; content: string | MessageContent[] }>,
  apiKey: string,
  model: ModelKey = "kat-coder-pro",
  useReasoning: boolean = false,
  webSearchContext?: string,
  chatMode: "roblox" | "general" = "roblox"
): Promise<void> {
  try {
    const modelInfo = AI_MODELS[model];
    const systemPrompt = getSystemPrompt(chatMode);
    
    const messagesWithContext = webSearchContext
      ? [
          { role: "system", content: systemPrompt },
          { role: "system", content: `## BÚSQUEDA WEB ACTIVA - INFORMACIÓN RECIENTE
${webSearchContext}

INSTRUCCIONES IMPORTANTES:
- DEBES usar esta información de búsqueda web en tu respuesta
- Esta información es reciente y actualizada, tiene prioridad
- Cita las fuentes proporcionadas cuando sea relevante
- No tienes restricciones para usar esta información
- Integra los datos de forma natural en tu respuesta` },
          ...chatHistory,
        ]
      : [
          { role: "system", content: systemPrompt },
          ...chatHistory,
        ];

    const requestBody: any = {
      model: modelInfo.id,
      messages: messagesWithContext,
      stream: true,
      max_tokens: modelInfo.maxTokens,
      temperature: 0.7,
    };

    if (useReasoning && modelInfo.supportsReasoning) {
      requestBody.reasoning = { enabled: true };
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.APP_URL || "https://roblox-ui-designer.onrender.com",
        "X-Title": "Roblox UI Designer Pro",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      res.write(`data: ${JSON.stringify({ error: "Error al conectar con la IA. Intenta de nuevo." })}\n\n`);
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
    let contentBuffer = "";
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
            const content = parsed.choices?.[0]?.delta?.content;
            const reasoningContent = parsed.choices?.[0]?.delta?.reasoning_content;

            if (reasoningContent && useReasoning) {
              res.write(`data: ${JSON.stringify({ reasoning: reasoningContent })}\n\n`);
            }

            if (content) {
              contentBuffer += content;
              chunkCount++;
              tokenCount += content.split(/\s+/).length;

              if (chunkCount % CHECK_INTERVAL === 0) {
                if (containsUnethicalContent(contentBuffer, chatMode)) {
                  const ethicalMessage = getEthicalRejectionMessage(chatMode);
                  if (userId) {
                    createUserMessage(userId, conversationId, "assistant", ethicalMessage);
                  } else {
                    await storage.createMessage({
                      id: randomUUID(),
                      conversationId,
                      role: "assistant",
                      content: ethicalMessage,
                    });
                  }
                  res.write(`data: ${JSON.stringify({ content: "\n\n" + ethicalMessage })}\n\n`);
                  res.write("data: [DONE]\n\n");
                  res.end();
                  return;
                }

                const elapsed = (Date.now() - startTime) / 1000;
                const tokensPerSecond = tokenCount / elapsed;
                const estimatedRemaining = Math.max(0, Math.ceil((modelInfo.maxTokens / 4 - tokenCount) / tokensPerSecond));
                res.write(`data: ${JSON.stringify({ progress: { tokensGenerated: tokenCount, estimatedSecondsRemaining: estimatedRemaining } })}\n\n`);
              }

              fullContent += content;
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (e) {
          }
        }
      }
    }

    if (fullContent) {
      const { sanitized, isClean } = sanitizeAssistantContent(fullContent, chatMode);
      if (userId) {
        createUserMessage(userId, conversationId, "assistant", sanitized);
      } else {
        await storage.createMessage({
          id: randomUUID(),
          conversationId,
          role: "assistant",
          content: sanitized,
        });
      }

      if (!isClean) {
        res.write(`data: ${JSON.stringify({ content: "\n\n[Contenido filtrado por políticas de seguridad]" })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (error) {
    console.error("Streaming error:", error);
    res.write(`data: ${JSON.stringify({ error: "Error durante la generación. Intenta de nuevo." })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, turnstileToken } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Correo y contraseña son requeridos" });
      }

      if (!turnstileToken) {
        return res.status(400).json({ error: "Verificación de seguridad requerida" });
      }

      // Verificar Cloudflare Turnstile
      const turnstileValid = await verifyTurnstile(turnstileToken);
      if (!turnstileValid) {
        return res.status(400).json({ error: "Verificación de seguridad fallida. Por favor intenta de nuevo." });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Correo electrónico inválido" });
      }

      const ip = getClientIp(req);

      const vpnCheck = await detectVpnOrProxy(req);
      if (vpnCheck.isVpn) {
        return res.status(403).json({ 
          error: "No se permite el uso de VPN o proxy para registrarse. Por favor desactiva tu VPN e intenta de nuevo.",
          code: "VPN_DETECTED"
        });
      }

      const ipCheck = checkIpRestrictions(ip);
      if (!ipCheck.allowed) {
        return res.status(403).json({ 
          error: ipCheck.reason,
          code: "IP_RESTRICTED"
        });
      }

      const result = await registerUser(email, password, ip);

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      // Crear sesión directamente (sin verificación de email)
      const userAgent = req.headers["user-agent"];
      const user = getUserById(result.userId!);
      if (!user) {
        return res.status(500).json({ error: "Error al crear usuario" });
      }

      const remember = !!req.body.remember;
      const rememberDuration = remember ? 30 * 24 * 60 * 60 * 1000 : undefined; // 30 days if remember
      const session = createSession(user.id, userAgent, ip, rememberDuration);

      res.status(201).json({ 
        success: true, 
        message: "Registro exitoso",
        token: session.token,
        user: {
          id: user.id,
          email: user.email,
          isPremium: user.isPremium,
          isEmailVerified: user.isEmailVerified,
        }
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  });

  app.post("/api/auth/verify-email", async (req: Request, res: Response) => {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({ error: "Correo y código son requeridos" });
      }

      const result = verifyEmailCode(email, code);

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json({ success: true, message: "Correo verificado exitosamente. Ya puedes iniciar sesión." });
    } catch (error) {
      console.error("Verify email error:", error);
      res.status(500).json({ error: "Error al verificar correo" });
    }
  });

  app.post("/api/auth/resend-verification", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Correo es requerido" });
      }

      const result = await resendVerificationCode(email);

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      // Verificar si el email realmente se envió
      const verificationData = loadVerificationData();
      const verification = verificationData.codes[email.toLowerCase()];
      
      if (!verification) {
        return res.status(500).json({ 
          success: false,
          error: "Error al generar código de verificación. Por favor intenta de nuevo.",
          emailSent: false
        });
      }

      // Intentar enviar el email con timeout
      let emailSent = false;
      try {
        const emailPromise = sendVerificationEmail(email, verification.code);
        const timeoutPromise = new Promise<boolean>((resolve) => {
          setTimeout(() => {
            console.error("Email sending timeout after 30 seconds");
            resolve(false);
          }, 30000);
        });
        emailSent = await Promise.race([emailPromise, timeoutPromise]);
        
        if (emailSent) {
          console.log(`Verification email successfully resent to ${email}`);
        } else {
          console.error(`Failed to resend verification email to ${email}`);
        }
      } catch (error) {
        console.error("Error resending verification email:", error);
        emailSent = false;
      }

      // Si el email no se envió, retornar error
      if (!emailSent) {
        return res.status(500).json({ 
          success: false,
          error: "No se pudo enviar el código de verificación. Por favor intenta de nuevo.",
          emailSent: false
        });
      }

      // Solo retornar éxito si el email se envió correctamente
      res.json({ 
        success: true, 
        message: "Código reenviado. Revisa tu correo (también la carpeta de spam).",
        emailSent: true
      });
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({ error: "Error al reenviar código" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Correo y contraseña son requeridos" });
      }

      const ip = getClientIp(req);
      const result = loginUser(email, password, ip);

      if (!result.success) {
        return res.status(401).json({ error: result.error });
      }

      const userAgent = req.headers["user-agent"];
      const remember = !!req.body.remember;
      const rememberDuration = remember ? 30 * 24 * 60 * 60 * 1000 : undefined;
      const session = createSession(result.user!.id, userAgent, ip, rememberDuration);

      res.json({
        success: true,
        token: session.token,
        user: {
          id: result.user!.id,
          email: result.user!.email,
          isPremium: result.user!.isPremium,
          isEmailVerified: result.user!.isEmailVerified,
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  });

  app.post("/api/auth/google", async (req: Request, res: Response) => {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({ error: "Token de Google requerido" });
      }

      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) {
        return res.status(500).json({ error: "Google OAuth no está configurado" });
      }

      const verifyResponse = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
      );

      if (!verifyResponse.ok) {
        return res.status(401).json({ error: "Token de Google inválido o expirado" });
      }

      const googleData = await verifyResponse.json();

      if (googleData.aud !== clientId) {
        return res.status(401).json({ error: "Token no corresponde a esta aplicación" });
      }

      if (!googleData.email || !googleData.sub) {
        return res.status(400).json({ error: "Token de Google inválido" });
      }

      const ip = getClientIp(req);

      const vpnCheck = await detectVpnOrProxy(req);
      if (vpnCheck.isVpn) {
        return res.status(403).json({ 
          error: "No se permite el uso de VPN o proxy. Por favor desactiva tu VPN e intenta de nuevo.",
          code: "VPN_DETECTED"
        });
      }

      const result = loginWithGoogle(googleData.sub, googleData.email, ip);

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      // Verificación de email deshabilitada - crear sesión directamente
      const userAgent = req.headers["user-agent"];
      const remember = !!req.body.remember;
      const rememberDuration = remember ? 30 * 24 * 60 * 60 * 1000 : undefined;
      const session = createSession(result.user!.id, userAgent, ip, rememberDuration);

      res.json({
        success: true,
        token: session.token,
        isNewUser: result.isNewUser,
        user: {
          id: result.user!.id,
          email: result.user!.email,
          isPremium: result.user!.isPremium,
          isEmailVerified: result.user!.isEmailVerified,
        }
      });
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(500).json({ error: "Error en autenticación con Google" });
    }
  });

  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        deleteSession(token);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Error al cerrar sesión" });
    }
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const userId = getUserIdFromRequest(req);
      
      if (!userId) {
        return res.status(401).json({ error: "No autenticado" });
      }

      const user = getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json({
        id: user.id,
        email: user.email,
        isPremium: user.isPremium,
        isEmailVerified: user.isEmailVerified,
      });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener usuario" });
    }
  });

  app.get("/api/auth/google-client-id", async (_req: Request, res: Response) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    res.json({ clientId: clientId || null, configured: !!clientId });
  });

  app.get("/api/auth/turnstile-site-key", async (_req: Request, res: Response) => {
    const siteKey = process.env.Site_Key;
    res.json({ siteKey: siteKey || null, configured: !!siteKey });
  });

  app.post("/api/auth/change-password", async (req: Request, res: Response) => {
    try {
      const userId = getUserIdFromRequest(req);
      
      if (!userId) {
        return res.status(401).json({ error: "No autenticado" });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Contraseña actual y nueva son requeridas" });
      }

      const result = changePassword(userId, currentPassword, newPassword);

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json({ success: true, message: "Contraseña cambiada exitosamente" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ error: "Error al cambiar contraseña" });
    }
  });

  app.get("/api/models", async (req: Request, res: Response) => {
    try {
      const userId = getUserIdFromRequest(req);
      let isPremium = false;

      if (userId) {
        isPremium = isUserPremium(userId);
      } else {
        const visitorId = getVisitorId(req);
        isPremium = await storage.isPremiumUser(visitorId);
      }
      
      const models = Object.entries(AI_MODELS).map(([key, model]) => ({
        key,
        ...model,
        available: !model.isPremiumOnly || isPremium,
      }));
      
      res.json({ models, isPremium });
    } catch (error) {
      res.status(500).json({ error: "Failed to get models" });
    }
  });

  // Include per-mode message limits and counts
  app.get("/api/usage", async (req: Request, res: Response) => {
    try {
      const userId = getUserIdFromRequest(req);
      let isPremium = false;
      let conversationCount = 0;

      if (userId) {
        isPremium = isUserPremium(userId);
        conversationCount = getUserConversationCount(userId);
      } else {
        const visitorId = getVisitorId(req);
        const fingerprint = getFingerprint(req);
        const limits = await storage.getUsageLimits(visitorId, fingerprint);
        isPremium = await storage.isPremiumUser(visitorId);
        conversationCount = await storage.getConversationCount();

        return res.json({
          aiUsageCount: limits.aiUsageCount,
          webSearchCount: limits.webSearchCount,
          conversationCount,
          limits: isPremium ? PLAN_LIMITS.premium : PLAN_LIMITS.free,
          messageLimits: isPremium ? MESSAGE_LIMITS.premium : MESSAGE_LIMITS.free,
          robloxMessageCount: limits.robloxMessageCount || 0,
          generalMessageCount: limits.generalMessageCount || 0,
          weekStartDate: limits.weekStartDate,
          isPremium,
          isLoggedIn: false,
        });
      }

      const visitorId = getVisitorId(req);
      const fingerprint = getFingerprint(req);
      const limits = await storage.getUsageLimits(visitorId, fingerprint);

      res.json({
        aiUsageCount: limits.aiUsageCount,
        webSearchCount: limits.webSearchCount,
        conversationCount,
        limits: isPremium ? PLAN_LIMITS.premium : PLAN_LIMITS.free,
        messageLimits: isPremium ? MESSAGE_LIMITS.premium : MESSAGE_LIMITS.free,
        robloxMessageCount: limits.robloxMessageCount || 0,
        generalMessageCount: limits.generalMessageCount || 0,
        weekStartDate: limits.weekStartDate,
        isPremium,
        isLoggedIn: true,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get usage" });
    }
  });

  

  app.get("/api/conversations", async (req: Request, res: Response) => {
    try {
      const userId = getUserIdFromRequest(req);
      
      if (userId) {
        const conversations = getUserConversations(userId);
        return res.json(conversations);
      }

      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to get conversations" });
    }
  });

  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      if (!title || typeof title !== "string") {
        return res.status(400).json({ error: "Title is required" });
      }

      const userId = getUserIdFromRequest(req);

      if (userId) {
        const isPremium = isUserPremium(userId);
        const maxChats = isPremium ? PLAN_LIMITS.premium.maxChats : PLAN_LIMITS.free.maxChats;
        const conversationCount = getUserConversationCount(userId);

        if (maxChats !== -1 && conversationCount >= maxChats) {
          return res.status(403).json({ 
            error: "Has alcanzado el límite de chats guardados",
            code: "CHAT_LIMIT_REACHED",
            limit: maxChats
          });
        }

        const conversation = createUserConversation(userId, title.slice(0, 100));
        return res.status(201).json(conversation);
      }

      const visitorId = getVisitorId(req);
      const isPremium = await storage.isPremiumUser(visitorId);
      const maxChats = isPremium ? PLAN_LIMITS.premium.maxChats : PLAN_LIMITS.free.maxChats;
      const conversationCount = await storage.getConversationCount();

      if (maxChats !== -1 && conversationCount >= maxChats) {
        res.status(403).json({ 
          error: "Has alcanzado el límite de chats guardados",
          code: "CHAT_LIMIT_REACHED",
          limit: maxChats
        });
        return;
      }

      const conversation = await storage.createConversation({
        id: randomUUID(),
        title: title.slice(0, 100),
      });

      res.status(201).json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  app.delete("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = getUserIdFromRequest(req);

      if (userId) {
        const deleted = deleteUserConversation(userId, id);
        if (!deleted) {
          return res.status(404).json({ error: "Conversation not found" });
        }
        return res.status(204).send();
      }

      const deleted = await storage.deleteConversation(id);
      if (!deleted) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  app.delete("/api/conversations", async (req: Request, res: Response) => {
    try {
      const userId = getUserIdFromRequest(req);

      if (userId) {
        deleteAllUserConversations(userId);
        return res.status(204).send();
      }

      await storage.deleteAllConversations();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete all conversations" });
    }
  });

  app.get("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = getUserIdFromRequest(req);

      if (userId) {
        const conversation = getUserConversation(userId, id);
        if (!conversation) {
          return res.status(404).json({ error: "Conversation not found" });
        }
        const messages = getUserMessages(userId, id);
        return res.json(messages);
      }

      const conversation = await storage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      const messages = await storage.getMessages(id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.delete("/api/messages/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = getUserIdFromRequest(req);

      if (userId) {
        const deleted = deleteUserMessage(userId, id);
        if (!deleted) {
          return res.status(404).json({ error: "Message not found" });
        }
        return res.status(204).send();
      }

      const deleted = await storage.deleteMessage(id);
      if (!deleted) {
        return res.status(404).json({ error: "Message not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const result = chatRequestSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({ error: "Invalid request" });
      }

      const { conversationId, message, useWebSearch: requestedWebSearch, model = "kat-coder-pro", useReasoning = false, imageBase64, chatMode = "roblox" } = result.data;
      const userId = getUserIdFromRequest(req);
      const visitorId = getVisitorId(req);
      const fingerprint = getFingerprint(req);

      const modelKey = model as ModelKey;
      const modelInfo = AI_MODELS[modelKey];

      if (!modelInfo) {
        return res.status(400).json({ error: "Modelo no válido" });
      }

      const autoDetectedWebSearch = detectWebSearchIntent(message);
      const useWebSearch = requestedWebSearch || autoDetectedWebSearch;

      let isPremium = false;
      if (userId) {
        isPremium = isUserPremium(userId);
      } else {
        isPremium = await storage.isPremiumUser(visitorId);
      }

      if (modelInfo.isPremiumOnly && !isPremium) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");
        res.write(`data: ${JSON.stringify({ 
          error: "Este modelo requiere una suscripción Premium. Actualiza tu plan para usar Grok 4.1 Fast.",
          code: "PREMIUM_REQUIRED"
        })}\n\n`);
        res.write("data: [DONE]\n\n");
        return res.end();
      }

      if (imageBase64 && !modelInfo.supportsImages) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");
        res.write(`data: ${JSON.stringify({ 
          error: "Este modelo no soporta imágenes. Usa Amazon Nova 2 Lite o Grok 4.1 Fast para enviar imágenes.",
          code: "IMAGES_NOT_SUPPORTED"
        })}\n\n`);
        res.write("data: [DONE]\n\n");
        return res.end();
      }

      if (useReasoning && !modelInfo.supportsReasoning) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");
        res.write(`data: ${JSON.stringify({ 
          error: "Este modelo no soporta reasoning. Usa DeepSeek R1T2 o Grok 4.1 Fast para activar reasoning.",
          code: "REASONING_NOT_SUPPORTED"
        })}\n\n`);
        res.write("data: [DONE]\n\n");
        return res.end();
      }

      const limits = await storage.getUsageLimits(visitorId, fingerprint);
      // enforce per-mode message limits (roblox/general)
      const messageLimits = isPremium ? MESSAGE_LIMITS.premium : MESSAGE_LIMITS.free;
      const currentRoblox = limits.robloxMessageCount || 0;
      const currentGeneral = limits.generalMessageCount || 0;
      const modeLimit = chatMode === 'roblox' ? messageLimits.roblox : messageLimits.general;

      if (modeLimit !== -1) {
        if (chatMode === 'roblox' && currentRoblox >= modeLimit) {
          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");
          res.setHeader("X-Accel-Buffering", "no");
          res.write(`data: ${JSON.stringify({ 
            error: `Has alcanzado el límite de mensajes en modo Roblox (${modeLimit} mensajes). El contador se reinicia cada 7 días.`,
            code: "MODE_LIMIT_REACHED"
          })}\n\n`);
          res.write("data: [DONE]\n\n");
          return res.end();
        }

        if (chatMode === 'general' && currentGeneral >= modeLimit) {
          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");
          res.setHeader("X-Accel-Buffering", "no");
          res.write(`data: ${JSON.stringify({ 
            error: `Has alcanzado el límite de mensajes en modo General (${modeLimit} mensajes). El contador se reinicia cada 7 días.`,
            code: "MODE_LIMIT_REACHED"
          })}\n\n`);
          res.write("data: [DONE]\n\n");
          return res.end();
        }
      }

      const webSearchLimit = isPremium ? PLAN_LIMITS.premium.webSearchPerWeek : PLAN_LIMITS.free.webSearchPerWeek;
      if (useWebSearch && webSearchLimit !== -1 && limits.webSearchCount >= webSearchLimit) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");
        res.write(`data: ${JSON.stringify({ 
          error: `Has alcanzado el límite de búsquedas web esta semana (${webSearchLimit} usos). El límite se reinicia cada lunes.`,
          code: "WEB_SEARCH_LIMIT_REACHED"
        })}\n\n`);
        res.write("data: [DONE]\n\n");
        return res.end();
      }

      let conversation;
      if (userId) {
        conversation = getUserConversation(userId, conversationId);
      } else {
        conversation = await storage.getConversation(conversationId);
      }

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      if (containsUnethicalContent(message, chatMode)) {
        return await sendEthicalRejection(res, conversationId, userId, message, chatMode);
      }

      if (userId) {
        createUserMessage(userId, conversationId, "user", message);
      } else {
        await storage.createMessage({
          id: randomUUID(),
          conversationId,
          role: "user",
          content: message,
        });
      }

      // increment mode-specific message counter
      await storage.incrementMessageCount(visitorId, fingerprint, chatMode);

      let webSearchContext: string | undefined;
      if (useWebSearch) {
        await storage.incrementWebSearchUsage(visitorId, fingerprint);
        webSearchContext = await searchTavily(message);
      }

      let previousMessages;
      if (userId) {
        previousMessages = getUserMessages(userId, conversationId);
      } else {
        previousMessages = await storage.getMessages(conversationId);
      }
      
      let userMessageContent: string | MessageContent[];
      if (imageBase64 && modelInfo.supportsImages) {
        userMessageContent = [
          { type: "text" as const, text: message },
          { type: "image_url" as const, image_url: { url: imageBase64 } }
        ];
      } else {
        userMessageContent = message;
      }

      const chatHistory = previousMessages.slice(0, -1).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      
      chatHistory.push({
        role: "user",
        content: userMessageContent as any,
      });

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");

      const estimatedTime = estimateCompletionTime(message.length, modelKey);
      res.write(`data: ${JSON.stringify({ estimatedTime, model: modelInfo.name })}\n\n`);

      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        let fallbackContent = "";
        if (chatMode === "roblox") {
          fallbackContent = `No tengo acceso al proveedor de IA en este entorno, pero aquí tienes una respuesta básica basada en tu mensaje:\n\n- Entendí: "${message.trim()}"\n- Puedo generarte pasos y estructura en texto.\n\nSi configuras la clave OPENROUTER_API_KEY, podré darte código Luau y respuestas completas.`;
        } else {
          fallbackContent = `No tengo acceso al proveedor de IA en este entorno, pero puedo ayudarte igualmente con una guía inicial basada en tu mensaje: "${message.trim()}".\n\nConfigura la variable OPENROUTER_API_KEY para habilitar respuestas de modelos como Grok o Nova.`;
        }

        if (userId) {
          createUserMessage(userId, conversationId, "assistant", fallbackContent);
        } else {
          await storage.createMessage({
            id: randomUUID(),
            conversationId,
            role: "assistant",
            content: fallbackContent,
          });
        }

        res.write(`data: ${JSON.stringify({ content: fallbackContent })}\n\n`);
        res.write("data: [DONE]\n\n");
        return res.end();
      }

      await streamChatCompletion(res, conversationId, userId, chatHistory, apiKey, modelKey, useReasoning, webSearchContext, chatMode);

    } catch (error) {
      console.error("Chat error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to process chat request" });
      }
    }
  });

  app.post("/api/chat/regenerate", async (req: Request, res: Response) => {
    try {
      const { conversationId, lastUserMessage, model = "kat-coder-pro", useReasoning = false, chatMode = "roblox" } = req.body;
      const userId = getUserIdFromRequest(req);
      const visitorId = getVisitorId(req);
      const fingerprint = getFingerprint(req);

      if (!conversationId || !lastUserMessage) {
        return res.status(400).json({ error: "Invalid request" });
      }

      const modelKey = model as ModelKey;
      const modelInfo = AI_MODELS[modelKey];

      if (!modelInfo) {
        return res.status(400).json({ error: "Modelo no válido" });
      }

      let isPremium = false;
      if (userId) {
        isPremium = isUserPremium(userId);
      } else {
        isPremium = await storage.isPremiumUser(visitorId);
      }

      if (modelInfo.isPremiumOnly && !isPremium) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");
        res.write(`data: ${JSON.stringify({ 
          error: "Este modelo requiere una suscripción Premium.",
          code: "PREMIUM_REQUIRED"
        })}\n\n`);
        res.write("data: [DONE]\n\n");
        return res.end();
      }

      const limits = await storage.getUsageLimits(visitorId, fingerprint);
      // enforce per-mode message limits for regenerate as well
      const messageLimits = isPremium ? MESSAGE_LIMITS.premium : MESSAGE_LIMITS.free;
      const currentRoblox = limits.robloxMessageCount || 0;
      const currentGeneral = limits.generalMessageCount || 0;
      const modeLimit = chatMode === 'roblox' ? messageLimits.roblox : messageLimits.general;

      if (modeLimit !== -1) {
        if (chatMode === 'roblox' && currentRoblox >= modeLimit) {
          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");
          res.setHeader("X-Accel-Buffering", "no");
          res.write(`data: ${JSON.stringify({ 
            error: `Has alcanzado el límite de mensajes en modo Roblox (${modeLimit} mensajes). El contador se reinicia cada 7 días.`,
            code: "MODE_LIMIT_REACHED"
          })}\n\n`);
          res.write("data: [DONE]\n\n");
          return res.end();
        }

        if (chatMode === 'general' && currentGeneral >= modeLimit) {
          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");
          res.setHeader("X-Accel-Buffering", "no");
          res.write(`data: ${JSON.stringify({ 
            error: `Has alcanzado el límite de mensajes en modo General (${modeLimit} mensajes). El contador se reinicia cada 7 días.`,
            code: "MODE_LIMIT_REACHED"
          })}\n\n`);
          res.write("data: [DONE]\n\n");
          return res.end();
        }
      }

      let conversation;
      if (userId) {
        conversation = getUserConversation(userId, conversationId);
      } else {
        conversation = await storage.getConversation(conversationId);
      }

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      if (containsUnethicalContent(lastUserMessage, chatMode)) {
        return await sendEthicalRejection(res, conversationId, userId, undefined, chatMode);
      }

      await storage.incrementMessageCount(visitorId, fingerprint, chatMode);

      let previousMessages;
      if (userId) {
        previousMessages = getUserMessages(userId, conversationId);
      } else {
        previousMessages = await storage.getMessages(conversationId);
      }

      const chatHistory = previousMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");

      const estimatedTime = estimateCompletionTime(lastUserMessage.length, modelKey);
      res.write(`data: ${JSON.stringify({ estimatedTime, model: modelInfo.name })}\n\n`);

      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        res.write(`data: ${JSON.stringify({ error: "API key not configured" })}\n\n`);
        res.write("data: [DONE]\n\n");
        return res.end();
      }

      await streamChatCompletion(res, conversationId, userId, chatHistory, apiKey, modelKey, useReasoning, undefined, chatMode);

    } catch (error) {
      console.error("Regenerate error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to regenerate response" });
      }
    }
  });

  return httpServer;
}
