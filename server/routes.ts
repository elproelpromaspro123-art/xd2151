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
    validateReferralSignup,
    processSuccessfulReferral,
    getUserReferralCode,
    getUserReferralStats,
    getUserByReferralCode,
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
import { logChatCreation, logChatMessage, logUserRegistration } from "./webhook";
import { checkGeminiRateLimit, recordGeminiRequest, getGeminiRateLimitStatus } from "./geminiRateLimit";
import { readFileSync } from "fs";
import { join } from "path";
import { registerRealtimeRoutes } from "./routes-realtime";
import { registerReferralRoutes } from "./routes-referral";
import { logChatToDiscord } from "./webhook-logs";

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
        // Oficial docs: 1,048,576 contexto, 65,536 output - Usando capacidad máxima completa
        freeContextTokens: 1048576,
        freeOutputTokens: 65536,
        premiumContextTokens: 1048576,
        premiumOutputTokens: 65536,
    },
    "gemini-flash-2": {
        id: "gemini-2.0-flash",
        name: "Gemini Flash 2",
        description: "Modelo ultrarrápido optimizado para conversaciones generales y tareas creativas - Gemini 2.0 Flash Experimental con capacidades avanzadas",
        supportsImages: true,
        supportsReasoning: false,
        isPremiumOnly: false,
        category: "general" as const,
        availableModes: ["general"] as const, // Solo disponible en modo general
        provider: "google",
        fallbackProvider: null as string | null,
        apiProvider: "gemini" as const,
        // Gemini 2.0 Flash specs según docs oficiales: 1M contexto, 8K output
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
        // Oficial docs: 1,048,576 contexto de entrada, 65,536 tokens de salida - Usando capacidad máxima completa
        freeContextTokens: 0,
        freeOutputTokens: 0,
        premiumContextTokens: 1048576,
        premiumOutputTokens: 65536,
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

// Cache para la documentación de Roblox
let robloxDocumentationCache: string | null = null;
let contratoRobloxCache: string | null = null;
let robloxValidationCache: string | null = null;
let robloxApiRealCache: string | null = null;
let estrategiaGeneracionCache: string | null = null;
let solucionErroresCache: string | null = null;
let protocoloVisibleCache: string | null = null;

function getRobloxDocumentation(): string {
    if (robloxDocumentationCache) {
        return robloxDocumentationCache;
    }

    try {
        const docPath = join(process.cwd(), "ROBLOX_DOCUMENTATION.md");
        robloxDocumentationCache = readFileSync(docPath, "utf-8");
        return robloxDocumentationCache;
    } catch (error) {
        console.error("Error loading Roblox documentation:", error);
        return "Documentación de Roblox no disponible.";
    }
}

function getContratoRoblox(): string {
    if (contratoRobloxCache) return contratoRobloxCache;
    try {
        const docPath = join(process.cwd(), ".amp", "CONTRATO_ROBLOX.md");
        contratoRobloxCache = readFileSync(docPath, "utf-8");
        return contratoRobloxCache;
    } catch (error) {
        console.error("Error loading CONTRATO_ROBLOX:", error);
        return "";
    }
}

function getRobloxValidation(): string {
    if (robloxValidationCache) return robloxValidationCache;
    try {
        const docPath = join(process.cwd(), "ROBLOX_VALIDATION.md");
        robloxValidationCache = readFileSync(docPath, "utf-8");
        return robloxValidationCache;
    } catch (error) {
        console.error("Error loading ROBLOX_VALIDATION:", error);
        return "";
    }
}

function getRobloxApiReal(): string {
    if (robloxApiRealCache) return robloxApiRealCache;
    try {
        const docPath = join(process.cwd(), ".amp", "ROBLOX_API_REAL.md");
        robloxApiRealCache = readFileSync(docPath, "utf-8");
        return robloxApiRealCache;
    } catch (error) {
        console.error("Error loading ROBLOX_API_REAL:", error);
        return "";
    }
}

function getEstrategiaGeneracion(): string {
    if (estrategiaGeneracionCache) return estrategiaGeneracionCache;
    try {
        const docPath = join(process.cwd(), ".amp", "ESTRATEGIA_GENERACION.md");
        estrategiaGeneracionCache = readFileSync(docPath, "utf-8");
        return estrategiaGeneracionCache;
    } catch (error) {
        console.error("Error loading ESTRATEGIA_GENERACION:", error);
        return "";
    }
}

function getSolucionErrores(): string {
    if (solucionErroresCache) return solucionErroresCache;
    try {
        const docPath = join(process.cwd(), ".amp", "SOLUCION_ERRORES_OMEGA.md");
        solucionErroresCache = readFileSync(docPath, "utf-8");
        return solucionErroresCache;
    } catch (error) {
        console.error("Error loading SOLUCION_ERRORES_OMEGA:", error);
        return "";
    }
}

function getProtocoloVisible(): string {
    if (protocoloVisibleCache) return protocoloVisibleCache;
    try {
        const docPath = join(process.cwd(), ".amp", "PROTOCOLO_VISIBLE.md");
        protocoloVisibleCache = readFileSync(docPath, "utf-8");
        return protocoloVisibleCache;
    } catch (error) {
        console.error("Error loading PROTOCOLO_VISIBLE:", error);
        return "";
    }
}

function getDocumentacionMaestra(): string {
    const contrato = getContratoRoblox();
    const validation = getRobloxValidation();
    const apiReal = getRobloxApiReal();
    const estrategia = getEstrategiaGeneracion();
    const errores = getSolucionErrores();
    const protocolo = getProtocoloVisible();

    return `
DOCUMENTACIÓN MAESTRO SUPREMO (INYECTADA EN SISTEMA)
════════════════════════════════════════════════════════════════

${contrato ? `\n## CONTRATO ROBLOX\n${contrato}\n` : ""}
${validation ? `\n## VALIDACIÓN ROBLOX\n${validation}\n` : ""}
${apiReal ? `\n## API REAL ROBLOX 2025\n${apiReal}\n` : ""}
${estrategia ? `\n## ESTRATEGIA GENERACIÓN\n${estrategia}\n` : ""}
${errores ? `\n## SOLUCIÓN ERRORES\n${errores}\n` : ""}
${protocolo ? `\n## PROTOCOLO VISIBLE\n${protocolo}\n` : ""}
`.substring(0, 50000); // Limit to 50KB to avoid token overflow
}

function extractRelevantRobloxDocs(userMessage: string): string {
    const fullDocs = getRobloxDocumentation();
    const lowerMessage = userMessage.toLowerCase();

    // Keywords para diferentes secciones
    const keywordMappings = {
        // UI/GUI keywords
        ui: ["gui", "interfaz", "botón", "button", "textlabel", "textbox", "frame", "screen", "image", "scroll", "layout", "color", "position", "size", "anchor", "udim2", "uicorner", "uistroke", "uigradient"],
        // Events keywords
        events: ["evento", "event", "clicked", "activated", "mouseenter", "mouseleave", "input", "touch", "mouse"],
        // Services keywords
        services: ["service", "players", "replicatedstorage", "serverscriptservice", "starterplayer", "workspace", "lighting", "sound", "tween", "http", "datastore"],
        // Instances/Objects keywords
        instances: ["part", "model", "humanoid", "tool", "spawnlocation", "seat", "terrain"],
        // Animation/Tween keywords
        animation: ["tween", "animación", "animation", "easing", "tweenservice"],
        // Physics keywords
        physics: ["física", "physics", "collision", "gravity", "velocity", "force", "body"],
        // Scripting keywords
        scripting: ["script", "localscript", "modulescript", "require", "function", "variable", "table", "loop", "if", "task", "wait", "defer", "spawn"],
        // Best practices keywords
        bestpractices: ["mejor", "práctica", "practice", "performance", "optimización", "optimization", "seguridad", "security", "clean", "code"]
    };

    const relevantSections: string[] = [];
    const lines = fullDocs.split('\n');
    let currentSection = '';
    let inRelevantSection = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect section headers
        if (line.startsWith('#')) {
            currentSection = line.toLowerCase();
            inRelevantSection = false;

            // Check if this section is relevant
            for (const [category, keywords] of Object.entries(keywordMappings)) {
                if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                    if (currentSection.includes(category) ||
                        keywords.some(keyword => currentSection.includes(keyword))) {
                        inRelevantSection = true;
                        break;
                    }
                }
            }
        }

        if (inRelevantSection) {
            relevantSections.push(line);
            // Limit section size to avoid token overflow
            if (relevantSections.length > 100) {
                relevantSections.push("... (sección truncada para optimización)");
                break;
            }
        }
    }

    // If no specific sections found, provide general overview
    if (relevantSections.length === 0) {
        // Extract introduction and core concepts
        const introStart = fullDocs.indexOf("## Introduction");
        const coreStart = fullDocs.indexOf("## Core Objects and Classes");
        if (introStart !== -1 && coreStart !== -1) {
            const introSection = fullDocs.substring(introStart, coreStart);
            relevantSections.push(introSection.substring(0, 2000)); // Limit to 2000 chars
        }
    }

    return relevantSections.join('\n').substring(0, 4000); // Limit total to 4000 chars
}

const ROBLOX_SYSTEM_PROMPT = `🔱 SYSTEM PROMPT SUPREMO PRODUCCIÓN v3.0 - ROBLOX CODE GENERATION
════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

⚠️  PROTOCOLO OBLIGATORIO PARA GENERACIÓN DE CÓDIGO 100% CORRECTO
Este prompt inyecta 1000+ líneas de contexto en tiempo real.
VERSIÓN: 4.0 PRODUCCIÓN | FECHA: 6/12/2025 | GARANTÍA: SIN ERRORES ROJOS/NARANJAS | CONTEXTO ACTUALIZADO

════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
📋 SECCIÓN 1: REQUISITOS INICIALES (OBLIGATORIO)

CUANDO EL USUARIO PIDA CÓDIGO ROBLOX, DEBES SEGUIR ESTE PROTOCOLO EXACTAMENTE.
NO ES OPCIONAL. ES LA LEY DEL SISTEMA.

════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
🔴 REQUISITOS ANTES DE CUALQUIER GENERACIÓN:

ARCHIVOS DE REFERENCIA (INFORMACIÓN ACTUALIZADA 6/12/2025):
✅ Documentación completa de Roblox Studio 2025.1
✅ API Reference actualizada con todas las propiedades válidas
✅ Patrones de validación para errores críticos
✅ Estrategias de generación de código de alta calidad
✅ Soluciones para problemas comunes de Roblox

IMPORTANTE: Toda la documentación necesaria está integrada en este prompt.

DOCUMENTACIÓN MAESTRO SUPREMO INTEGRADA:
\${getDocumentacionMaestra()}

════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
🎯 FASE 1: LECTURA Y ANÁLISIS VISIBLE
════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

1️⃣  Lee CONTRATO_ROBLOX.md
    Extrae: Cláusulas críticas sobre errores prohibidos (rojo/naranja), estructura obligatoria, validación

2️⃣  Lee ROBLOX_DOCUMENTATION.md
    Extrae: Core Objects hierarchy, Properties reference, Methods, Events, Modern UI patterns

3️⃣  Lee ROBLOX_VALIDATION.md
    Extrae: Errores naranja comunes, patrones de validación, flujo de validación orden de declaración

4️⃣  Lee ROBLOX_API_REAL.md
    Extrae: TODAS las propiedades válidas en 2025, propiedades INVÁLIDAS a evitar, regla de oro

5️⃣  Identifica VARIABLES de tu código:
    Para cada variable: [Nombre] → [Tipo] → [¿Puede ser nil?] → [Validación necesaria]

6️⃣  Planifica ESTRUCTURA en 5 zonas:
    ZONA 1 (1-20): Variables locales
    ZONA 2 (21-50): Funciones helper
    ZONA 3 (51-100): Métodos de clase
    ZONA 4 (101-150): Event handlers
    ZONA 5 (151+): Inicialización

════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
🛡️  FASE 2: REGLAS DE CODIFICACIÓN OBLIGATORIAS
════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

⚠️  REGLA 1: VALIDAR ANTES DE USAR (CRÍTICO)
❌ NUNCA: for k, v in pairs(Config) do
✅ SIEMPRE:
   if not Config then Config = {} end
   if not next(Config) then return end
   for k, v in pairs(Config) do

⚠️  REGLA 2: DEFINIR ANTES DE USAR (CRÍTICO - ERROR NARANJA)
❌ NUNCA: Init() ... local function Init() end
✅ SIEMPRE: local function Init() end ... Init()

⚠️  REGLA 3: VALIDACIÓN EN CASCADA
   local player = game.Players.LocalPlayer
   if not player then return end
   local gui = player:WaitForChild("PlayerGui")
   if not gui then return end

⚠️  REGLA 4: COMENTARIOS SOLO AL INICIO
   ✅ Líneas 1-10: Comentarios explicativos
   ❌ NO hay comentarios dentro del código
   ✅ Código limpio sin explicaciones en líneas

⚠️  REGLA 5: RESPETO EXACTO A LÍNEAS Y AUTOCONTENIDO
   Usuario elige: 500, 1000, 1500 o 2000 líneas
   Tú generas: EXACTAMENTE esa cantidad (±5%)
   Para LocalScripts: TODO el código debe ser autocontenido - NO dependencias externas
   Para 1500/2000 líneas: USA TODAS las líneas para código increíble, NO rellenes con texto

════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
❌ ERRORES PROHIBIDOS ABSOLUTOS
════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

ERROR ROJO: Nil Indexing (Causas crashes)
❌ player.leaderstats.Gold = 100
✅ if player and player:FindFirstChild("leaderstats") then
     local ls = player.leaderstats
     if ls then ls.Gold.Value = 100 end
   end

ERROR NARANJA: Forward References (Errores de compilación)
❌ Init()
   local function Init() end
✅ local function Init() end
   Init()

ERROR: Propiedades inválidas (API Error)
❌ UIStroke.ApplyToBorder, UICorner.BorderRadius, TextButton.FontSize, TextButton.OnClick
✅ UIStroke.Color, UIStroke.Thickness, UICorner.CornerRadius, TextButton.TextSize, TextButton.Activated

ERROR: UDim2 Arithmetic Operations (CRÍTICO)
❌ local pos = UDim2.new(0.5, 0, 0.5, 0) + UDim2.new(0, 10, 0, 10)
❌ frame.Position = frame.Position * 1.1
✅ local pos = UDim2.new(frame.Position.X.Scale + 0.1, frame.Position.X.Offset, frame.Position.Y.Scale, frame.Position.Y.Offset)
✅ Usa funciones helper para cálculos complejos de UDim2

════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
📋 ESTRUCTURA OBLIGATORIA (5 ZONAS)
════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

ZONA 1 (1-20): Variables, Services, Config
ZONA 2 (21-50): Funciones helper, Validación
ZONA 3 (51-100): Métodos de clase
ZONA 4 (101-150): Event handlers
ZONA 5 (151+): Inicialización

════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
🎨 PATRONES UI/UX HERMOSO SIN ERRORES
════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

PATRÓN 1: Colores coherentes (theme con primario, secundario, acento, texto)
PATRÓN 2: Tipografía clara (Fonts válidos: GothamBold, Gotham, GothamMedium, RobotoMono)
PATRÓN 3: Espaciado consistente (UDim para padding y margins)
PATRÓN 4: Animaciones suaves (TweenPosition/TweenSize con validaciones)
PATRÓN 5: Componentes reutilizables (funciones que retornan instances con validación)

════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
📊 CONTROL DE LÍNEAS Y CHECKLIST FINAL
════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

✅ ANTES DE ENTREGAR:
[✅] Código autocontenido (LocalScript independiente - sin código de servidor)
[✅] Identifiqué TODAS las variables y validé cuáles pueden ser nil
[✅] Planeé validaciones en cascada para todos los objetos
[✅] Verifiqué orden de declaración de funciones
[✅] Estructura organizada en 5 zonas exactas
[✅] Sin errores ROJOS (nil indexing, UDim2 arithmetic inválida)
[✅] Sin errores NARANJAS (forward references)
[✅] Propiedades válidas para Roblox 2025
[✅] Comentarios SOLO al inicio del código
[✅] Líneas exactas (±5%) con código de calidad
[✅] UI/UX hermosa y funcional

════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
🔍 POST-GENERACIÓN: CÓMO MOSTRAR EL PROTOCOLO (VISIBLE EN RESPUESTA)
════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

Entrega el código directamente sin mencionar procesos internos.

════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
✅ GARANTÍA FINAL Y RECHAZO
════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

SI CUMPLES ESTE PROTOCOLO COMPLETAMENTE:

✅ Código 100% válido sin errores
✅ Sin errores ROJOS (nil indexing)
✅ Sin errores NARANJAS (forward references)
✅ Propiedades verificadas en API 2025
✅ UI/UX hermoso y profesional
✅ Líneas exactas con tolerancia ±5%
✅ Comentarios solo al inicio
✅ Código limpio y mantenible
✅ Listo para Roblox Studio 2025.1

SE RECHAZA INMEDIATAMENTE SI:
❌ NO mencionas lectura específica de archivos
❌ NO muestras análisis de variables visible
❌ Hay errores ROJOS (pairs(nil), indexing sin validar)
❌ Hay errores NARANJAS (funciones usadas antes de definirse)
❌ Propiedades NO están en ROBLOX_API_REAL.md
❌ Hay comentarios dentro del código
❌ Líneas fuera de rango (>5% de diferencia)
❌ No sigues estructura de 5 zonas exacta

════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
VERSIÓN FINAL: 4.0 PRODUCCIÓN | CONTEXTO: 2000+ líneas | FECHA: 6/12/2025 | GARANTÍA: CÓDIGO PERFECTO PARA ROBLOX STUDIO
════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════`;

const GENERAL_SYSTEM_PROMPT = `Eres un asistente inteligente y versátil. Tu objetivo es ayudar al usuario de la mejor manera posible.

INSTRUCCIONES:
- Responde de forma clara, precisa y útil, pero sé CONCISO
- Evita texto innecesario, explicaciones largas o relleno
- Solo incluye información esencial y directamente relevante
- Proporciona información actualizada cuando esté disponible
- Ofrece ejemplos prácticos cuando sea apropiado, pero mantén brevedad

SALIDA PARA SOLICITUDES DE CÓDIGO
- SOLO proporciona código cuando el usuario EXPLÍCITAMENTE lo solicite o pida
- Si el usuario NO pide código, responde normalmente sin incluir código
- Si el usuario solicita código, responde PRINCIPALMENTE con bloques de código completos y minimiza cualquier texto explicativo
- Evita comentarios largos; usa comentarios cortos solo cuando sean absolutamente necesarios
- Prioriza que el código sea correcto, ejecutable y sin errores de sintaxis`;

function getSystemPrompt(mode: "roblox" | "general" = "roblox", userMessage: string = ""): string {
    if (mode === "general") {
        return GENERAL_SYSTEM_PROMPT;
    }

    // For Roblox mode, include all documentation (Maestro Supremo)
    const relevantDocs = extractRelevantRobloxDocs(userMessage);
    const maestroDocumentation = getDocumentacionMaestra();

    const enhancedPrompt = ROBLOX_SYSTEM_PROMPT.replace(
        "DEBES leer EXACTAMENTE estos 7 archivos ANTES de generar código:\n\n1. ✅ CONTRATO_ROBLOX.md (contrato vinculante)\n2. ✅ ROBLOX_DOCUMENTATION.md (API de Roblox)\n3. ✅ ROBLOX_VALIDATION.md (validación de errores)\n4. ✅ ROBLOX_API_REAL.md (propiedades válidas)\n5. ✅ ESTRATEGIA_GENERACION.md (metodología)\n6. ✅ SOLUCION_ERRORES_OMEGA.md (garantía)\n7. ✅ PROTOCOLO_VISIBLE.md (cómo demostrar)\n\nREGLA CRÍTICA: Si NO mencionas en tu razonamiento que leíste estos 7 archivos,\n              tu respuesta será RECHAZADA por incompleta.",
        `DOCUMENTACIÓN MAESTRO SUPREMO INYECTADA EN SISTEMA:
════════════════════════════════════════════════════════════════════════════════

${maestroDocumentation}

════════════════════════════════════════════════════════════════════════════════

DEBES leer EXACTAMENTE estos 7 archivos ANTES de generar código:

1. ✅ CONTRATO_ROBLOX.md (contrato vinculante) - ARRIBA ↑
2. ✅ ROBLOX_DOCUMENTATION.md (API de Roblox) - ARRIBA ↑
3. ✅ ROBLOX_VALIDATION.md (validación de errores) - ARRIBA ↑
4. ✅ ROBLOX_API_REAL.md (propiedades válidas) - ARRIBA ↑
5. ✅ ESTRATEGIA_GENERACION.md (metodología) - ARRIBA ↑
6. ✅ SOLUCION_ERRORES_OMEGA.md (garantía) - ARRIBA ↑
7. ✅ PROTOCOLO_VISIBLE.md (cómo demostrar) - ARRIBA ↑

REGLA CRÍTICA: Ya tienes toda la documentación inyectada en el sistema.
              Cuando menciones que leíste estos archivos, te refieres a la documentación
              inyectada ARRIBA en este mismo prompt.`
    );

    return enhancedPrompt;
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

        // Extract last user message from chat history for system prompt
        let lastUserMessage = "";
        for (let i = chatHistory.length - 1; i >= 0; i--) {
            const msg = chatHistory[i];
            if (msg.role === "user") {
                if (typeof msg.content === "string") {
                    lastUserMessage = msg.content;
                } else if (Array.isArray(msg.content)) {
                    const textPart = msg.content.find((part: any) => part.type === "text");
                    if (textPart && textPart.text) {
                        lastUserMessage = textPart.text;
                    }
                }
                break;
            }
        }

        const systemPrompt = getSystemPrompt(chatMode, lastUserMessage);

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

        // Extract last user message from chat history for system prompt
        let lastUserMessage = "";
        for (let i = chatHistory.length - 1; i >= 0; i--) {
            const msg = chatHistory[i];
            if (msg.role === "user") {
                if (typeof msg.content === "string") {
                    lastUserMessage = msg.content;
                } else if (Array.isArray(msg.content)) {
                    const textPart = msg.content.find((part: any) => part.type === "text");
                    if (textPart && textPart.text) {
                        lastUserMessage = textPart.text;
                    }
                }
                break;
            }
        }

        const systemPrompt = getSystemPrompt(chatMode, lastUserMessage);

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

                // Log assistant message to Discord
                await logChatMessage(
                    conversationId,
                    userId,
                    "assistant",
                    fullContent,
                    model,
                    chatMode
                );
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

        // Extract last user message from chat history for system prompt
        let lastUserMessage = "";
        for (let i = chatHistory.length - 1; i >= 0; i--) {
            const msg = chatHistory[i];
            if (msg.role === "user") {
                if (typeof msg.content === "string") {
                    lastUserMessage = msg.content;
                } else if (Array.isArray(msg.content)) {
                    const textPart = msg.content.find((part: any) => part.type === "text");
                    if (textPart && textPart.text) {
                        lastUserMessage = textPart.text;
                    }
                }
                break;
            }
        }

        const systemPrompt = getSystemPrompt(chatMode, lastUserMessage);

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

    // Endpoint para obtener estado de rate limits de Gemini
    app.get("/api/gemini-rate-limits", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const { model } = req.query;
            if (!model || typeof model !== 'string') {
                return res.status(400).json({ error: "Modelo requerido" });
            }

            const status = getGeminiRateLimitStatus(userId, model);
            res.status(200).json(status);
        } catch (error) {
            console.error("Error fetching Gemini rate limits:", error);
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

            // Calculate next reset time (3 days from weekStartDate)
            const nextResetTime = new Date(usage.weekStartDate);
            nextResetTime.setDate(nextResetTime.getDate() + 3);
            const timeUntilReset = Math.max(0, nextResetTime.getTime() - Date.now());
            const hoursUntilReset = Math.floor(timeUntilReset / (1000 * 60 * 60));
            const minutesUntilReset = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));

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
                nextResetTime: nextResetTime.toISOString(),
                timeUntilResetMs: timeUntilReset,
                timeUntilResetFormatted: timeUntilReset > 0 ? `${hoursUntilReset}h ${minutesUntilReset}m` : "0m",
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
        const { email, password, turnstileToken, referralCode } = req.body;

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

        // Validate referral code if provided
        let referrerId: string | undefined;
        if (referralCode) {
            const referralValidation = validateReferralSignup(referralCode, ip);
            if (!referralValidation.valid) {
                return res.status(400).json({ error: referralValidation.error });
            }
            referrerId = referralValidation.referrerId;
        }

        const result = await registerUser(email, password, ip);
        if (!result.success || !result.userId) {
            return res.status(400).json({ error: result.error || "Registro inválido" });
        }

        // Process successful referral if applicable
        if (referrerId && referralCode) {
            processSuccessfulReferral(referrerId, result.userId, referralCode);
        }

        const session = createSession(result.userId, req.headers['user-agent'], ip);
        const user = getUserById(result.userId);

        // Log user registration to Discord
        if (user) {
            await logUserRegistration(result.userId, user.email, ip, user.isPremium, referralCode);
        }

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
            const referralCode = req.body.referralCode;

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

            // Validate referral code if provided
            let referrerId: string | undefined;
            if (referralCode) {
                const referralValidation = validateReferralSignup(referralCode, ip);
                if (!referralValidation.valid) {
                    return res.status(400).json({ error: referralValidation.error });
                }
                referrerId = referralValidation.referrerId;
            }

            const result = loginWithGoogle(googleId, email, ip);
            if (!result.success || !result.user) {
                return res.status(401).json({ error: result.error || "Login de Google inválido" });
            }

            // Process successful referral if applicable and it's a new user
            if (referrerId && referralCode && result.isNewUser) {
                processSuccessfulReferral(referrerId, result.user.id, referralCode);
            }

            const session = createSession(result.user.id, req.headers['user-agent'], ip);

            // Log user registration/login to Discord
            await logUserRegistration(result.user.id, result.user.email, ip, result.user.isPremium, referralCode);

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

    app.get("/api/user/referral", async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const referralStats = getUserReferralStats(userId);
            const referralLink = referralStats.referralCode
                ? `${process.env.APP_URL || 'https://your-app-url.com'}?ref=${referralStats.referralCode}`
                : null;

            res.status(200).json({
                referralCode: referralStats.referralCode,
                referralLink,
                successfulReferrals: referralStats.successfulReferrals,
                referralsNeededForPremium: Math.max(0, 30 - referralStats.successfulReferrals),
                isPremiumFromReferrals: referralStats.isPremiumFromReferrals,
            });
        } catch (error) {
            console.error("Error fetching referral data:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    app.get("/api/referral/:code", async (req: Request, res: Response) => {
        try {
            const { code } = req.params;
            const referrer = getUserByReferralCode(code);

            if (!referrer) {
                return res.status(404).json({ error: "Código de referencia inválido" });
            }

            res.status(200).json({
                valid: true,
                referrerEmail: referrer.email,
                referrerId: referrer.id,
            });
        } catch (error) {
            console.error("Error validating referral code:", error);
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

            const { title, chatMode, model } = req.body;
            const conversation = await createUserConversation(userId, title || "Nueva Conversación");

            // Log conversation creation to Discord
            await logChatCreation(
                conversation.id,
                conversation.title,
                userId,
                chatMode || "roblox",
                model || "gemini-2.5-flash"
            );

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

            let currentConversationId = clientConversationId;
            const selectedModel: ModelKey = (model && (model in AI_MODELS)) ? (model as ModelKey) : "gemini-2.5-flash";

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

            // Check Gemini-specific rate limits
            const isGeminiModelForRateLimit = AI_MODELS[selectedModel]?.apiProvider === "gemini";
            if (isGeminiModelForRateLimit) {
                const rateLimitCheck = checkGeminiRateLimit(userId, selectedModel);
                if (!rateLimitCheck.allowed) {
                    return res.status(429).json({
                        error: rateLimitCheck.reason || "Límite de rate alcanzado para este modelo.",
                        code: "GEMINI_RATE_LIMIT",
                        resetTime: rateLimitCheck.resetTime,
                        limits: rateLimitCheck.limits,
                    });
                }
            }

            // Verificar si el modelo requiere premium
            if (AI_MODELS[selectedModel].isPremiumOnly && !isPremium) {
                return res.status(403).json({
                    error: "Este modelo requiere una cuenta Premium.",
                    code: "PREMIUM_REQUIRED"
                });
            }

            // Crear conversación si no existe
            if (!currentConversationId) {
                // Extraer el mensaje real del usuario, ignorando las líneas de configuración de Roblox
                let userMessageForTitle = message;
                if (chatMode === "roblox") {
                    // Remover las líneas de configuración que empiezan con CONFIG_
                    const lines = message.split('\n');
                    const filteredLines = lines.filter(line => !line.startsWith('CONFIG_'));
                    userMessageForTitle = filteredLines.join('\n').trim();
                }

                // Generar un título inteligente basado en el mensaje
                let title = userMessageForTitle.slice(0, 50);
                if (userMessageForTitle.length > 50) {
                    title += "...";
                }

                // Si el título está vacío o solo tiene configuración, usar un título genérico
                if (!title.trim() || title.trim().length === 0) {
                    title = chatMode === "roblox" ? "Nueva interfaz Roblox" : "Nueva conversación";
                }

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

            // Log user message to Discord
            await logChatMessage(
                currentConversationId!,
                userId,
                "user",
                message,
                selectedModel,
                mode
            );

            // Incrementar contador de mensajes
            if (!isPremium) {
                incrementMessageCount(userId, mode);
            }

            // Record Gemini request for rate limiting
            if (isGeminiModelForRateLimit) {
                recordGeminiRequest(userId, selectedModel);
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

    // Registrar rutas de tiempo real (SSE, webhooks, rate limits)
    console.log("[Routes] Registering realtime routes");
    registerRealtimeRoutes(app);

    // Registrar rutas de referrals
    console.log("[Routes] Registering referral routes");
    registerReferralRoutes(app);
}
