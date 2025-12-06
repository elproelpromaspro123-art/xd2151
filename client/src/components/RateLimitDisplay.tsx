import React from "react";
import { AlertCircle, Clock, Zap } from "lucide-react";

interface RateLimitStatus {
  status: "available" | "blocked_minute" | "blocked_day";
  minuteRemaining: number;
  dayRemaining: number;
  minuteResetIn: string;
  dayResetIn: string;
  minuteResetTime: number;
  dayResetTime: number;
}

interface RateLimitDisplayProps {
  modelKey: string;
  status: RateLimitStatus | undefined;
}

export function RateLimitDisplay({ modelKey, status }: RateLimitDisplayProps) {
  if (!status) return null;

  const isBlocked = status.status !== "available";
  const isBlockedByMinute = status.status === "blocked_minute";
  const isBlockedByDay = status.status === "blocked_day";

  if (!isBlocked) {
    return (
      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded">
        <Zap size={14} />
        <span>{status.minuteRemaining}/min • {status.dayRemaining}/día</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded border-l-4 ${
      isBlockedByMinute
        ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-700 dark:text-yellow-300"
        : "bg-red-50 dark:bg-red-900/20 border-red-400 text-red-700 dark:text-red-300"
    }`}>
      <AlertCircle size={14} />
      <div>
        {isBlockedByMinute ? (
          <div>
            <span className="font-semibold">Límite por minuto alcanzado</span>
            <span className="ml-2 flex items-center gap-1">
              <Clock size={12} />
              Espera {status.minuteResetIn}
            </span>
          </div>
        ) : (
          <div>
            <span className="font-semibold">Límite diario alcanzado</span>
            <span className="ml-2 flex items-center gap-1">
              <Clock size={12} />
              Se reinicia en {status.dayResetIn}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
