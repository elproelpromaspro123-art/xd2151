import type { Express, Request, Response } from "express";
import { registerSSEClient } from "./realtime-updates";
import { broadcastUserUpdates, registerNewChat, validateModelRequest, notifyUserRateLimit, notifyReferralUpdate } from "./integrated-systems";
import { logChatToDiscord } from "./webhook-logs";
import { getReferralStats } from "./referral-system";
import { getMessageResetInfo } from "./message-timer";

/**
 * Registrar rutas de tiempo real (SSE y webhooks)
 */
export function registerRealtimeRoutes(app: Express): void {
  /**
   * GET /api/realtime
   * Conectar cliente SSE para recibir actualizaciones en tiempo real
   * Parámetros: userId (query)
   */
  app.get("/api/realtime", (req: Request, res: Response) => {
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).json({ error: "userId requerido" });
      return;
    }

    // Registrar el cliente SSE
    registerSSEClient(userId, res);

    // Enviar estado inicial al cliente
    setTimeout(() => {
      broadcastUserUpdates(userId);
    }, 100);
  });

  /**
   * POST /api/chat/log
   * Registrar un nuevo chat en Discord webhook y base de datos
   * Body: { userId, userEmail, conversationId, chatName, userMessage, botResponse, model }
   */
  app.post("/api/chat/log", async (req: Request, res: Response) => {
    const { userId, userEmail, conversationId, chatName, userMessage, botResponse, model } = req.body;

    if (!userId || !userEmail || !conversationId || !chatName || !botResponse) {
      res.status(400).json({ error: "Campos requeridos incompletos" });
      return;
    }

    try {
      await registerNewChat(userId, userEmail, conversationId, chatName, userMessage, botResponse, model);
      res.json({ success: true, message: "Chat registrado en Discord" });
    } catch (error) {
      console.error("[routes-realtime] Error logging chat:", error);
      res.status(500).json({ error: "Error al registrar el chat" });
    }
  });

  /**
   * POST /api/rate-limit/check
   * Validar y registrar una petición al modelo con rate limiting
   * Body: { modelKey }
   */
  app.post("/api/rate-limit/check", (req: Request, res: Response) => {
    const { modelKey } = req.body;

    if (!modelKey) {
      res.status(400).json({ error: "modelKey requerido" });
      return;
    }

    try {
      const result = validateModelRequest(modelKey);

      if (!result.allowed) {
        res.status(429).json({
          allowed: false,
          message: result.message,
          minuteRemaining: result.minuteRemaining,
          dayRemaining: result.dayRemaining,
          minuteResetTime: result.minuteResetTime,
          dayResetTime: result.dayResetTime,
        });
        return;
      }

      res.json(result);
    } catch (error) {
      console.error("[routes-realtime] Error checking rate limit:", error);
      res.status(500).json({ error: "Error al validar rate limit" });
    }
  });

  /**
   * GET /api/user/message-reset-info
   * Obtener información de reinicio de mensajes del usuario
   * Parámetros: userId (query)
   */
  app.get("/api/user/message-reset-info", (req: Request, res: Response) => {
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).json({ error: "userId requerido" });
      return;
    }

    try {
      const resetInfo = getMessageResetInfo(userId);

      if (!resetInfo) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      res.json(resetInfo);
    } catch (error) {
      console.error("[routes-realtime] Error getting message reset info:", error);
      res.status(500).json({ error: "Error al obtener información de reinicio" });
    }
  });

  /**
   * GET /api/user/referral-stats
   * Obtener estadísticas de referrals del usuario
   * Parámetros: userId (query)
   */
  app.get("/api/user/referral-stats", (req: Request, res: Response) => {
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).json({ error: "userId requerido" });
      return;
    }

    try {
      const stats = getReferralStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("[routes-realtime] Error getting referral stats:", error);
      res.status(500).json({ error: "Error al obtener estadísticas de referrals" });
    }
  });

  /**
   * POST /api/realtime/broadcast-updates
   * Enviar actualización a usuario específico (admin/sistema)
   * Body: { userId, updateType: 'all' | 'messageReset' | 'rateLimit' | 'referral' }
   */
  app.post("/api/realtime/broadcast-updates", async (req: Request, res: Response) => {
    const { userId, updateType = "all" } = req.body;

    if (!userId) {
      res.status(400).json({ error: "userId requerido" });
      return;
    }

    try {
      if (updateType === "all" || updateType === "messageReset") {
        const resetInfo = getMessageResetInfo(userId);
        if (resetInfo) {
          // Este se envía automáticamente a través de SSE
        }
      }

      if (updateType === "all" || updateType === "referral") {
        notifyReferralUpdate(userId);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("[routes-realtime] Error broadcasting updates:", error);
      res.status(500).json({ error: "Error al enviar actualizaciones" });
    }
  });
}
