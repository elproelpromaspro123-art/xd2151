import { useEffect, useState } from "react";

interface MessageResetInfo {
  resetTime: string;
  remainingMilliseconds: number;
  remainingSeconds: number;
  remainingMinutes: number;
  remainingHours: number;
  remainingDays: number;
  hasReset: boolean;
}

interface RateLimitStatus {
  status: "available" | "blocked_minute" | "blocked_day";
  minuteRemaining: number;
  dayRemaining: number;
  minuteResetIn: string;
  dayResetIn: string;
  minuteResetTime: number;
  dayResetTime: number;
}

interface ReferralStats {
  referralCode: string | null;
  successfulReferrals: number;
  referralsNeeded: number;
  premiumFromReferrals: boolean;
}

interface RealtimeUpdate {
  type: "messageResetUpdate" | "rateLimitUpdate" | "referralUpdate";
  data: MessageResetInfo | RateLimitStatus | ReferralStats;
  modelKey?: string;
  timestamp: number;
}

export function useRealtimeUpdates(userId: string | null) {
  const [messageResetInfo, setMessageResetInfo] = useState<MessageResetInfo | null>(null);
  const [rateLimitStatus, setRateLimitStatus] = useState<Record<string, RateLimitStatus>>({});
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const eventSource = new EventSource(`/api/realtime?userId=${userId}`);

    const handleMessage = (event: MessageEvent) => {
      try {
        const update: RealtimeUpdate = JSON.parse(event.data);

        switch (update.type) {
          case "messageResetUpdate":
            setMessageResetInfo(update.data as MessageResetInfo);
            break;

          case "rateLimitUpdate":
            if (update.modelKey) {
              setRateLimitStatus((prev) => ({
                ...prev,
                [update.modelKey!]: update.data as RateLimitStatus,
              }));
            }
            break;

          case "referralUpdate":
            setReferralStats(update.data as ReferralStats);
            break;
        }
      } catch (err) {
        console.error("[realtime] Error parsing message:", err);
      }
    };

    const handleOpen = () => {
      setIsConnected(true);
      setError(null);
      console.log("[realtime] Connected to server updates");
    };

    const handleError = (event: Event) => {
      if (eventSource.readyState === EventSource.CLOSED) {
        setIsConnected(false);
        setError("Desconectado del servidor de actualizaciones");
        console.error("[realtime] Connection closed");
      }
    };

    eventSource.addEventListener("open", handleOpen);
    eventSource.addEventListener("message", handleMessage);
    eventSource.addEventListener("error", handleError);

    return () => {
      eventSource.removeEventListener("open", handleOpen);
      eventSource.removeEventListener("message", handleMessage);
      eventSource.removeEventListener("error", handleError);
      eventSource.close();
    };
  }, [userId]);

  return {
    messageResetInfo,
    rateLimitStatus,
    referralStats,
    isConnected,
    error,
  };
}
