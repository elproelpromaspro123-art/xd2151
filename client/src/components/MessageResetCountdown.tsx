import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface MessageResetCountdownProps {
  nextResetTime: string;
  isPremium: boolean;
  className?: string;
}

export function MessageResetCountdown({ nextResetTime, isPremium, className = "" }: MessageResetCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const resetTime = new Date(nextResetTime).getTime();
      const difference = resetTime - now;

      if (difference <= 0) {
        setTimeLeft("0m");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [nextResetTime]);

  if (isPremium) {
    return null; // Don't show countdown for premium users
  }

  return (
    <div className={`flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}>
      <Clock className="h-3 w-3" />
      <span>Reinicio en: {timeLeft}</span>
    </div>
  );
}