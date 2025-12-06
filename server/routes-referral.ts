import type { Express, Request, Response } from "express";
import { getReferralStats } from "./referral-system";

export function registerReferralRoutes(app: Express): void {
  app.get("/api/referral/stats", (req: Request, res: Response) => {
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).json({ error: "userId requerido" });
      return;
    }

    try {
      const stats = getReferralStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("[routes-referral] Error:", error);
      res.status(500).json({ error: "Error al obtener estadísticas de referral" });
    }
  });
}
