import { memo } from "react";
import { AlertCircle, TrendingUp, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenCounterDisplayProps {
  totalTokens: number;
  maxTokens: number;
  contextPercentage: number;
  warningLevel: "safe" | "warning" | "critical";
  estimatedCostUSD: number;
  isApproachingLimit: boolean;
  modelName: string;
}

export const TokenCounterDisplay = memo(function TokenCounterDisplay({
  totalTokens,
  maxTokens,
  contextPercentage,
  warningLevel,
  estimatedCostUSD,
  isApproachingLimit,
  modelName,
}: TokenCounterDisplayProps) {
  const getWarningColor = () => {
    switch (warningLevel) {
      case "safe":
        return "text-emerald-500";
      case "warning":
        return "text-amber-500";
      case "critical":
        return "text-red-500";
    }
  };

  const getProgressColor = () => {
    switch (warningLevel) {
      case "safe":
        return "bg-emerald-500/30 border-emerald-500/50";
      case "warning":
        return "bg-amber-500/30 border-amber-500/50";
      case "critical":
        return "bg-red-500/30 border-red-500/50";
    }
  };

  const getBackgroundColor = () => {
    switch (warningLevel) {
      case "safe":
        return "bg-emerald-500/10";
      case "warning":
        return "bg-amber-500/10";
      case "critical":
        return "bg-red-500/10";
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(Math.round(num));
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-3 space-y-3 transition-all duration-200",
        getBackgroundColor(),
        warningLevel === "safe"
          ? "border-emerald-500/30"
          : warningLevel === "warning"
            ? "border-amber-500/30"
            : "border-red-500/30"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isApproachingLimit ? (
            <AlertTriangle className={cn("h-4 w-4", getWarningColor())} />
          ) : (
            <Zap className={cn("h-4 w-4", getWarningColor())} />
          )}
          <span className="text-xs font-semibold text-foreground">
            Tokens de Contexto
          </span>
        </div>
        <span className={cn("text-xs font-bold", getWarningColor())}>
          {contextPercentage.toFixed(1)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div
          className={cn(
            "h-2 rounded-full overflow-hidden border",
            getProgressColor()
          )}
        >
          <div
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              warningLevel === "safe"
                ? "bg-emerald-500"
                : warningLevel === "warning"
                  ? "bg-amber-500"
                  : "bg-red-500"
            )}
            style={{ width: `${contextPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{formatNumber(totalTokens)}</span>
          <span>{formatNumber(maxTokens)}</span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Modelo */}
        <div className="p-2 rounded bg-background/50 border border-border/30">
          <div className="text-[10px] text-muted-foreground">Modelo</div>
          <div className="text-xs font-semibold text-foreground truncate">
            {modelName}
          </div>
        </div>

        {/* Costo */}
        <div className="p-2 rounded bg-background/50 border border-border/30">
          <div className="text-[10px] text-muted-foreground">Costo Est.</div>
          <div className="text-xs font-semibold text-foreground">
            ${estimatedCostUSD.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {warningLevel === "warning" && (
        <div className="flex gap-2 p-2 rounded bg-amber-500/20 border border-amber-500/30">
          <AlertCircle className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-200">
            Aproximándose al límite de contexto. Considera crear una nueva
            conversación.
          </div>
        </div>
      )}

      {warningLevel === "critical" && (
        <div className="flex gap-2 p-2 rounded bg-red-500/20 border border-red-500/30">
          <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-red-700 dark:text-red-200">
            Límite de contexto casi alcanzado. Se recomienda crear una nueva
            conversación inmediatamente.
          </div>
        </div>
      )}

      {/* Helpful Tips */}
      <div className="text-xs text-muted-foreground space-y-1 bg-background/30 p-2 rounded border border-border/20">
        <div className="font-semibold text-foreground text-[10px]">💡 Tips:</div>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>Cada token cuesta ~$0.002 USD</li>
          <li>Respuestas largas consumen más tokens</li>
          <li>Chat antiguo se mantiene en memoria</li>
          <li>Crea nuevo chat para nuevo contexto</li>
        </ul>
      </div>
    </div>
  );
});
