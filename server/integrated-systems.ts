import { sendMessageResetUpdate, sendRateLimitUpdate, sendReferralUpdate } from "./realtime-updates";
import { logChatToDiscord } from "./webhook-logs";
import { getMessageResetInfo } from "./message-timer";
import { getFormattedRateLimitInfo, checkRateLimit, recordRequest } from "./rate-limit-tracker";
import { getReferralStats } from "./referral-system";

/**
 * SISTEMA INTEGRADO DE ACTUALIZACIONES EN TIEMPO REAL
 * Sincroniza: reinicio de mensajes, rate limits, referrals y logs de Discord
 */

/**
 * Enviar todas las actualizaciones de un usuario al cliente SSE
 */
export async function broadcastUserUpdates(userId: string): Promise<void> {
  // 1. Actualizar reinicio de mensajes
  const resetInfo = getMessageResetInfo(userId);
  if (resetInfo) {
    sendMessageResetUpdate(userId, resetInfo);
  }

  // 2. Actualizar estadísticas de referrals
  const referralStats = getReferralStats(userId);
  sendReferralUpdate(userId, referralStats);
}

/**
 * Registrar un chat nuevo y enviar a Discord + tiempo real
 */
export async function registerNewChat(
  userId: string,
  userEmail: string,
  conversationId: string,
  chatName: string,
  userMessage: string,
  botResponse: string,
  model: string
): Promise<void> {
  // 1. Enviar a Discord webhook
  await logChatToDiscord(userId, userEmail, conversationId, chatName, userMessage, botResponse, model);

  console.log(`[integrated] Chat logged for user ${userEmail}: ${chatName}`);
}

/**
 * Validar y registrar request a modelo con rate limiting
 */
export function validateModelRequest(modelKey: string): {
  allowed: boolean;
  message?: string;
  minuteRemaining: number;
  dayRemaining: number;
  minuteResetTime: number;
  dayResetTime: number;
} {
  const check = checkRateLimit(modelKey);

  if (!check.allowed) {
    console.warn(
      `[integrated] Rate limit exceeded for ${modelKey}: ${check.message}`
    );
    return {
      allowed: false,
      message: check.message,
      minuteRemaining: check.minuteRemaining,
      dayRemaining: check.dayRemaining,
      minuteResetTime: check.minuteResetTime,
      dayResetTime: check.dayResetTime,
    };
  }

  // Registrar el request
  recordRequest(modelKey);

  // Obtener estado actualizado
  const updated = getFormattedRateLimitInfo(modelKey);

  return {
    allowed: true,
    minuteRemaining: updated.minuteRemaining,
    dayRemaining: updated.dayRemaining,
    minuteResetTime: updated.minuteResetTime,
    dayResetTime: updated.dayResetTime,
  };
}

/**
 * Enviar actualización de rate limit a usuario específico
 */
export function notifyUserRateLimit(userId: string, modelKey: string): void {
  const status = getFormattedRateLimitInfo(modelKey);
  sendRateLimitUpdate(userId, modelKey, status);
}

/**
 * Verificar y actualizar reinicio de mensajes
 */
export function checkMessageReset(userId: string): {
  needsReset: boolean;
  resetInfo?: any;
} {
  const resetInfo = getMessageResetInfo(userId);

  if (!resetInfo) {
    return { needsReset: false };
  }

  sendMessageResetUpdate(userId, resetInfo);

  return {
    needsReset: resetInfo.hasReset,
    resetInfo,
  };
}

/**
 * Actualizar estadísticas de referral cuando se complete una invitación
 */
export function notifyReferralUpdate(userId: string): void {
  const stats = getReferralStats(userId);
  sendReferralUpdate(userId, stats);
}
