import type { Response } from "express";

const sseClients = new Map<string, Response>();

export function registerSSEClient(userId: string, res: Response): void {
  sseClients.set(userId, res);

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
  });

  // Clean up on disconnect
  res.on("close", () => {
    sseClients.delete(userId);
  });
}

export function sendMessageResetUpdate(
  userId: string,
  resetInfo: any
): void {
  const res = sseClients.get(userId);
  if (res) {
    res.write(
      `data: ${JSON.stringify({ type: "messageReset", data: resetInfo })}\n\n`
    );
  }
}

export function sendRateLimitUpdate(
  userId: string,
  modelKey: string,
  status: any
): void {
  const res = sseClients.get(userId);
  if (res) {
    res.write(
      `data: ${JSON.stringify({ type: "rateLimit", modelKey, data: status })}\n\n`
    );
  }
}

export function sendReferralUpdate(userId: string, stats: any): void {
  const res = sseClients.get(userId);
  if (res) {
    res.write(
      `data: ${JSON.stringify({ type: "referral", data: stats })}\n\n`
    );
  }
}
