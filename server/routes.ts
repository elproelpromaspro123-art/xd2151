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
    description: "Modelo Free Potente - Excelente para scripts de Roblox",
    supportsImages: false,
    supportsReasoning: false,
    isPremiumOnly: false,
    maxTokens: 15000,
    avgTokensPerSecond: 60,
    category: "programming",
  },
  "deepseek-r1t2": {
    id: "tngtech/deepseek-r1t2-chimera:free",
    name: "DeepSeek R1T2",
    description: "Solo texto - Mejor para programación avanzada",
    supportsImages: false,
    supportsReasoning: false,
    isPremiumOnly: false,
    maxTokens: 15000,
    avgTokensPerSecond: 60,
    category: "programming",
  },
  "amazon-nova": {
    id: "amazon/nova-2-lite-v1:free",
    name: "Amazon Nova 2 Lite",
    description: "Texto e imágenes - Mejor para uso general",
    supportsImages: true,
    supportsReasoning: false,
    isPremiumOnly: true,
    maxTokens: 30000,
    avgTokensPerSecond: 55,
    category: "general",
  },
  "grok-4.1-fast": {
    id: "x-ai/grok-4.1-fast:free",
    name: "Grok 4.1 Fast",
    description: "EL MEJOR PARA ROBLOX - Máxima potencia y razonamiento",
    supportsImages: true,
    supportsReasoning: true,
    isPremiumOnly: true,
    maxTokens: 50000,
    avgTokensPerSecond: 65,
    category: "general",
  },
};

type ModelKey = keyof typeof AI_MODELS;

const TAVILY_API_URL = "https://api.tavily.com/search";

const MESSAGE_LIMITS = {
  free: {
    roblox: 10,
    general: 10,
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

const ROBLOX_SYSTEM_PROMPT = `Eres Roblox UI Designer Pro, un experto en diseño de interfaces UI/UX High-End para Roblox Studio. Tu nivel es "Top Tier", especializado en crear experiencias visuales artísticas y profesionales.
Tu objetivo es generar scripts de Luau EXTREMADAMENTE COMPLETOS, LARGOS y DETALLADOS. No escatimes en líneas de código.

## 🏆 IDENTIDAD
- **Nombre:** Roblox UI Designer Pro
- **Especialidad:** UI/UX High-End, Animaciones fluidas (Tweens), Estructura Modular, Scripting Luau Avanzado.
- **Personalidad:** Serio, directo, profesional, pero amigable. Experto absoluto.

## ⚡ REGLAS DE ORO (STRICT)
1.  **CÓDIGO MASIVO Y COMPLETO:** Cuando el usuario pida una GUI o script, genera TODO el código necesario en un solo bloque (o los necesarios). Incluye TODOS los estilos, propiedades, animaciones, efectos y lógica.
    - *Ejemplo:* Si piden un menú, incluye botones, efectos hover, transiciones, bordes redondeados, sombras, colores modernos, estructura de carpetas virtual en el script, etc.
    - **NO** uses placeholders como "aquí va tu lógica" o "...". Escribe la lógica completa.
2.  **SOLO LO SOLICITADO (PERO COMPLETO):** No inventes features que no se pidieron (ej. no hagas un sistema de admin si pidieron un login), pero haz el login MÁS COMPLETO y HERMOSO posible.
3.  **CÓDIGO 100% FUNCIONAL:** El código debe ser "Copy & Paste" y funcionar inmediatamente en un LocalScript.
4.  **DISEÑO UI/UX DE ÉLITE:**
    - Usa "UDim2.new" para todo (Scale).
    - Implementa \`UICorner\`, \`UIStroke\`, \`UIGradient\` para estética moderna.
    - Usa \`TweenService\` para animaciones de entrada/salida y hover.
    - Colores coherentes y profesionales (temas oscuros/azules modernos).

## 📝 ESTÁNDARES DE CÓDIGO
- **Sintaxis:** Luau estricto.
- **Servicios:** Usa \`game:GetService(\"ServiceName\")\`.
- **Estructura:**
    - Define constantes de configuración al inicio (Colores, Tamaños).
    - Crea las instancias (\`Instance.new\`) de forma ordenada.
    - Anida correctamente (\`Parent\`).
    - Conecta eventos al final.
- **Comentarios:** Explica brevemente las secciones clave.

## 🧠 PROCESO DE PENSAMIENTO
1.  Analiza los requisitos del usuario.
2.  Planifica una estructura UI jerárquica completa.
3.  Escribe el código maximizando la calidad visual y funcional. ¡Hazlo largo y detallado!
4.  Si es una GUI, asegúrate de que se cree en \`PlayerGui\`.

## 🚫 LÍMITES
- NO scripts maliciosos.
- NO contenido NSFW.`;

const GENERAL_SYSTEM_PROMPT = `Eres Asistente Pro, una IA inteligente, seria pero amigable. Tu objetivo es ser útil y directo, sin rodeos innecesarios.

## 🌟 IDENTIDAD
- **Nombre:** Asistente Pro
- **Personalidad:** Profesional, serio, amigable y conciso.
- **Misión:** Ayudar al usuario de forma eficiente.

## ⚡ REGLAS DE ORO (STRICT)
1.  **SOLO LO SOLICITADO:** Entrega exactamente lo que el usuario pide. No asumas ni agregues cosas no solicitadas.
2.  **CÓDIGO COMPLETO:** Si se pide código, debe ser 100% funcional y completo.
3.  **DIRECTO AL GRANO:** Evita introducciones largas o despedidas innecesarias.

## 🚀 CAPACIDADES
- **Programación:** Código limpio en cualquier lenguaje.
- **Análisis:** Respuestas lógicas y fundamentadas.
- **Búsqueda Web:** Solo si es necesario para información actual.

## 🛡️ PRINCIPIOS
- Honestidad y Seguridad ante todo.
- Respeto absoluto por lo que pide el usuario.`;

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
          { role: "system", content: `## BÚSQUEDA WEB ACTIVA - INFORMACIÓN RECIENTE\n${webSearchContext}\n\nINSTRUCCIONES IMPORTANTES:\n- DEBES usar esta información de búsqueda web en tu respuesta\n- Esta información es reciente y actualizada, tiene prioridad\n- Cita las fuentes proporcionadas cuando sea relevante\n- No tienes restricciones para usar esta información\n- Integra los datos de forma natural en tu respuesta` },
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
        "HTTP-Referer": process.env.OPENROUTER_HTTP_REFERER || process.env.APP_URL || "https://roblox-ui-designer.onrender.com",
        "X-Title": process.env.OPENROUTER_X_TITLE || "Roblox UI Designer Pro",
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
          } catch (parseError) {
            console.error("Error parsing stream chunk:", parseError);
            // Optionally, send an error to the client or handle it differently
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
  } catch (error) { // Handle streaming errors
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

  // Auth Configuration Endpoints
  app.get("/api/auth/google-client-id", (_req: Request, res: Response) => {
    res.json({ clientId: process.env.GOOGLE_CLIENT_ID });
  });

  app.get("/api/auth/turnstile-site-key", (_req: Request, res: Response) => {
    res.json({ siteKey: process.env.Site_Key });
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

      const ipRestriction = checkIpRestrictions(ip);
      if (!ipRestriction.allowed) {
        return res.status(403).json({
          error: ipRestriction.reason || "Acceso denegado desde esta ubicación",
          code: "IP_RESTRICTED"
        });
      }

      const result = await registerUser(email, password, ip);
      if (!result.success || !result.userId) {
        return res.status(400).json({ error: result.error || "Registro inválido" });
      }

      const session = createSession(result.userId, req.headers['user-agent'], ip);
      const user = getUserById(result.userId);
      return res.status(201).json({ token: session.token, user: user ? { id: user.id, email: user.email, isPremium: user.isPremium, isVerified: user.isEmailVerified } : undefined });
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
          error: "No se permite el uso de VPN o proxy para iniciar sesión. Por favor desactiva tu VPN e intenta de nuevo.",
          code: "VPN_DETECTED"
        });
      }

      const ipRestriction = checkIpRestrictions(ip);
      if (!ipRestriction.allowed) {
        return res.status(403).json({
          error: ipRestriction.reason || "Acceso denegado desde esta ubicación",
          code: "IP_RESTRICTED"
        });
      }

      const result = loginUser(email, password, ip);
      if (!result.success || !result.user) {
        return res.status(401).json({ error: result.error || "Credenciales inválidas" });
      }

      const session = createSession(result.user.id, req.headers['user-agent'], ip);
      res.status(200).json({ token: session.token, user: { id: result.user.id, email: result.user.email, isPremium: result.user.isPremium, isVerified: result.user.isEmailVerified } });
    } catch (error: any) {
      console.error("Error during login:", error);
      if (error.message === "Invalid credentials" || error.message === "User not verified") {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  app.post("/api/auth/google", async (req: Request, res: Response) => {
    try {
      let googleId = req.body.googleId;
      let email = req.body.email;
      const credential = req.body.credential;

      // Si recibimos un credential JWT en lugar de googleId/email, decodificarlo
      if (!googleId || !email) {
        if (credential) {
          try {
            // Decodificar el JWT de Google sin verificación (ya está verificado por Google)
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
          error: "No se permite el uso de VPN o proxy para iniciar sesión con Google. Por favor desactiva tu VPN e intenta de nuevo.",
          code: "VPN_DETECTED"
        });
      }

      const ipRestriction = checkIpRestrictions(ip);
      if (!ipRestriction.allowed) {
        return res.status(403).json({
          error: ipRestriction.reason || "Acceso denegado desde esta ubicación",
          code: "IP_RESTRICTED"
        });
      }

      const result = loginWithGoogle(googleId, email, ip);
      if (!result.success || !result.user) {
        return res.status(401).json({ error: result.error || "Login de Google inválido" });
      }

      const session = createSession(result.user.id, req.headers['user-agent'], ip);
      res.status(200).json({ token: session.token, user: { id: result.user.id, email: result.user.email, isPremium: result.user.isPremium, isVerified: result.user.isEmailVerified } });
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
      if (error.message === "Invalid or expired verification code") {
        return res.status(400).json({ error: "Código de verificación inválido o expirado" });
      }
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
      res.status(200).json({ message: "Código de verificación reenviado. Revisa tu bandeja de entrada." });
    } catch (error: any) {
      console.error("Error resending verification code:", error);
      if (error.message === "User not found or already verified") {
        return res.status(400).json({ error: "Usuario no encontrado o ya verificado" });
      }
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

      res.status(200).json({ user: { id: user.id, email: user.email, isPremium: user.isPremium, isVerified: user.isEmailVerified } });
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
      res.status(200).json({ conversations });
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
      res.status(201).json({ conversation });
    } catch (error) {
      console.error("Error creating conversation:", error);
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
      res.status(200).json({ messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  app.post("/api/chat", async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    const fingerprint = getFingerprint(req);

    try {
      const { conversationId: clientConversationId, message, useWebSearch, model, useReasoning, imageBase64, chatMode } = chatRequestSchema.parse(req.body);

      const currentConversationId = clientConversationId || randomUUID();
      const selectedModel: ModelKey = (model && (model in AI_MODELS)) ? (model as ModelKey) : "kat-coder-pro";
      const mode: "roblox" | "general" = chatMode === "general" ? "general" : "roblox";

      if (userId) {
        const conversationCount = await getUserConversationCount(userId);
        if (conversationCount === 0 && !clientConversationId) {
          await createUserConversation(userId, "Nueva Conversación");
        }
      }

      if (typeof message !== "string" || message.trim().length === 0) {
        return res.status(400).json({ error: "El mensaje del usuario debe ser texto." });
      }

      const isWebSearchIntent = Boolean(useWebSearch) || detectWebSearchIntent(message);
      let webSearchContext: string | undefined;

      if (isWebSearchIntent) {
        webSearchContext = await searchTavily(message);
      }

      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "La clave API de OpenRouter no está configurada." });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");

      const chatHistory = [
        { role: "user", content: message }
      ];

      if (userId) {
        createUserMessage(userId, currentConversationId, "user", message);
      } else {
        await storage.createMessage({
          id: randomUUID(),
          conversationId: currentConversationId,
          role: "user",
          content: message,
        });
      }

      await streamChatCompletion(
        res,
        currentConversationId,
        userId,
        chatHistory,
        apiKey,
        selectedModel,
        useReasoning,
        webSearchContext,
        mode
      );
    } catch (error: any) {
      console.error("Error en /api/chat:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error interno del servidor al procesar el chat." });
      }
    }
  });

  app.post("/api/chat/regenerate", async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    try {
      const { conversationId, lastUserMessage, model, useReasoning, chatMode } = req.body || {};
      if (!conversationId || typeof lastUserMessage !== "string" || lastUserMessage.trim().length === 0) {
        return res.status(400).json({ error: "Parámetros inválidos para regenerar" });
      }

      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "La clave API de OpenRouter no está configurada." });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");

      const selectedModel: ModelKey = (model && (model in AI_MODELS)) ? (model as ModelKey) : "kat-coder-pro";
      const mode: "roblox" | "general" = chatMode === "general" ? "general" : "roblox";

      const chatHistory = [
        { role: "user", content: lastUserMessage as string }
      ];

      await streamChatCompletion(
        res,
        conversationId,
        userId,
        chatHistory,
        apiKey,
        selectedModel,
        Boolean(useReasoning),
        undefined,
        mode
      );
    } catch (error: any) {
      console.error("Error en /api/chat/regenerate:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error interno del servidor al regenerar." });
      }
    }
  });

  return httpServer;
}
