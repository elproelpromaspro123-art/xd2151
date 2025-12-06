import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Clock, AlertTriangle } from "lucide-react";

interface GeminiRateLimitStatusProps {
  modelKey: string;
  className?: string;
}

interface GeminiRateLimitData {
  allowed: boolean;
  reason?: string;
  resetTime?: number;
  limits?: {
    requestsPerMinute: number;
    requestsPerDay: number;
    usedThisMinute: number;
    usedToday: number;
    remainingThisMinute: number;
    remainingToday: number;
  };
}

export function GeminiRateLimitStatus({ modelKey, className = "" }: GeminiRateLimitStatusProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  const { data: rateLimitData } = useQuery<GeminiRateLimitData>({
    queryKey: ["/api/gemini-rate-limits", modelKey],
    refetchInterval: 10000, // Refresh every 10 seconds
    enabled: !!modelKey,
  });

  useEffect(() => {
    if (!rateLimitData?.resetTime) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const resetTime = rateLimitData.resetTime!;
      const difference = resetTime - now;

      if (difference <= 0) {
        setTimeLeft("0s");
        return;
      }

      const minutes = Math.floor(difference / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000); // Update every second

    return () => clearInterval(interval);
  }, [rateLimitData?.resetTime]);

  if (!rateLimitData || !rateLimitData.limits) {
    return null;
  }

  const { limits, allowed } = rateLimitData;

  if (allowed) {
    // Show usage status when allowed
    const minuteUsagePercent = (limits.usedThisMinute / limits.requestsPerMinute) * 100;
    const dayUsagePercent = (limits.usedToday / limits.requestsPerDay) * 100;

    return (
      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${
            minuteUsagePercent > 80 ? 'bg-red-500' :
            minuteUsagePercent > 50 ? 'bg-yellow-500' : 'bg-green-500'
          }`} />
          <span>{limits.usedThisMinute}/{limits.requestsPerMinute}/min</span>
        </div>
        <div className="w-px h-3 bg-border" />
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${
            dayUsagePercent > 80 ? 'bg-red-500' :
            dayUsagePercent > 50 ? 'bg-yellow-500' : 'bg-green-500'
          }`} />
          <span>{limits.usedToday}/{limits.requestsPerDay}/día</span>
        </div>
      </div>
    );
  }

  // Show blocked status
  return (
    <div className={`flex items-center gap-1.5 text-xs text-red-500 ${className}`}>
      <AlertTriangle className="h-3 w-3" />
      <span>Límite alcanzado</span>
      {timeLeft && (
        <>
          <div className="w-px h-3 bg-border" />
          <Clock className="h-3 w-3" />
          <span>{timeLeft}</span>
        </>
      )}
    </div>
  );
}