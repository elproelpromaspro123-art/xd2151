import React, { useEffect, useState } from "react";
import { Clock, RotateCcw } from "lucide-react";

interface MessageResetInfo {
  resetTime: string;
  remainingMilliseconds: number;
  remainingSeconds: number;
  remainingMinutes: number;
  remainingHours: number;
  remainingDays: number;
  hasReset: boolean;
}

interface MessageResetTimerProps {
  resetInfo: MessageResetInfo | null;
  messageCount?: number;
  maxMessages?: number;
}

export function MessageResetTimer({
  resetInfo,
  messageCount = 0,
  maxMessages = 50,
}: MessageResetTimerProps) {
  const [displayTime, setDisplayTime] = useState<string>("");
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!resetInfo) return;

    const updateDisplay = () => {
      const { remainingDays, remainingHours, remainingMinutes, remainingSeconds } = resetInfo;

      if (remainingDays > 0) {
        setDisplayTime(`${remainingDays}d ${remainingHours}h`);
      } else if (remainingHours > 0) {
        setDisplayTime(`${remainingHours}h ${remainingMinutes}m`);
      } else if (remainingMinutes > 0) {
        setDisplayTime(`${remainingMinutes}m ${remainingSeconds}s`);
      } else {
        setDisplayTime(`${remainingSeconds}s`);
      }

      // Calcular porcentaje de mensajes utilizados
      const used = Math.min(messageCount, maxMessages);
      setPercentage((used / maxMessages) * 100);
    };

    updateDisplay();
    const interval = setInterval(updateDisplay, 1000);
    return () => clearInterval(interval);
  }, [resetInfo, messageCount, maxMessages]);

  if (!resetInfo) {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Cargando información de reinicio...
      </div>
    );
  }

  const isNearReset = resetInfo.remainingMinutes <= 5;
  const percentageColor =
    percentage > 80 ? "bg-red-500" : percentage > 50 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="space-y-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
      {/* Contador de mensajes */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Mensajes utilizados
          </span>
          <span className="text-xs font-semibold text-gray-900 dark:text-white">
            {messageCount} / {maxMessages}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${percentageColor}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Reinicio automático */}
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-gray-600 dark:text-gray-400" />
        <div className="flex-1">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Reinicio automático en
          </span>
          <span
            className={`ml-2 font-mono font-semibold ${
              isNearReset
                ? "text-orange-600 dark:text-orange-400"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {displayTime}
          </span>
        </div>
      </div>

      {/* Estado de reinicio */}
      {resetInfo.hasReset && (
        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
          <RotateCcw size={14} />
          <span>Contador reiniciado correctamente</span>
        </div>
      )}

      {isNearReset && !resetInfo.hasReset && (
        <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
          <Clock size={14} />
          <span>Reinicio próximo en {displayTime}</span>
        </div>
      )}
    </div>
  );
}
