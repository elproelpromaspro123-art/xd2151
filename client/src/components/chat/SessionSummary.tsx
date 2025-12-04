import { memo, useState } from "react";
import { Download, Copy, Share2, MoreVertical, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SessionMetrics {
  totalTokensUsed: number;
  totalMessagesCount: number;
  averageMessageLength: number;
  sessionDuration: string;
  estimatedCost: number;
  contextPercentageUsed: number;
  webSearchQueriesCount: number;
  reasoningEnabledCount: number;
}

interface SessionSummaryProps {
  metrics: SessionMetrics;
  onExport?: () => void;
  onShare?: () => void;
  onContinue?: () => void;
  isApproachingLimit: boolean;
}

export const SessionSummary = memo(function SessionSummary({
  metrics,
  onExport,
  onShare,
  onContinue,
  isApproachingLimit,
}: SessionSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(Math.round(num));
  };

  const summaryText = `
📊 Resumen de Sesión
─────────────────────────
📝 Mensajes: ${metrics.totalMessagesCount}
🧠 Tokens usados: ${formatNumber(metrics.totalTokensUsed)}
⏱️ Duración: ${metrics.sessionDuration}
💰 Costo: $${metrics.estimatedCost.toFixed(4)}
🌐 Búsquedas web: ${metrics.webSearchQueriesCount}
🤔 Razonamiento: ${metrics.reasoningEnabledCount}x
📊 Contexto: ${metrics.contextPercentageUsed.toFixed(1)}%
  `.trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 space-y-3 transition-all duration-200",
        isApproachingLimit
          ? "bg-amber-500/10 border-amber-500/30"
          : "bg-primary/10 border-primary/30"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          📊 Resumen de Sesión
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div className="p-2 rounded bg-background/50 border border-border/30">
          <div className="text-[10px] text-muted-foreground">Mensajes</div>
          <div className="text-lg font-bold text-foreground">
            {metrics.totalMessagesCount}
          </div>
        </div>

        <div className="p-2 rounded bg-background/50 border border-border/30">
          <div className="text-[10px] text-muted-foreground">Tokens</div>
          <div className="text-lg font-bold text-primary">
            {formatNumber(metrics.totalTokensUsed)}
          </div>
        </div>

        <div className="p-2 rounded bg-background/50 border border-border/30">
          <div className="text-[10px] text-muted-foreground">Costo</div>
          <div className="text-lg font-bold text-foreground">
            ${metrics.estimatedCost.toFixed(4)}
          </div>
        </div>

        <div className="p-2 rounded bg-background/50 border border-border/30">
          <div className="text-[10px] text-muted-foreground">Duración</div>
          <div className="text-sm font-semibold text-foreground">
            {metrics.sessionDuration}
          </div>
        </div>

        <div className="p-2 rounded bg-background/50 border border-border/30">
          <div className="text-[10px] text-muted-foreground">Web</div>
          <div className="text-lg font-bold text-emerald-500">
            {metrics.webSearchQueriesCount}
          </div>
        </div>

        <div className="p-2 rounded bg-background/50 border border-border/30">
          <div className="text-[10px] text-muted-foreground">Contexto</div>
          <div
            className={cn(
              "text-lg font-bold",
              metrics.contextPercentageUsed > 80
                ? "text-amber-500"
                : "text-foreground"
            )}
          >
            {metrics.contextPercentageUsed.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="space-y-2 pt-2 border-t border-border/30">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Promedio por mensaje:</span>
              <span className="font-semibold text-foreground">
                {formatNumber(metrics.averageMessageLength)} caracteres
              </span>
            </div>
            <div className="flex justify-between">
              <span>Razonamiento usado:</span>
              <span className="font-semibold text-foreground">
                {metrics.reasoningEnabledCount}x
              </span>
            </div>
            <div className="flex justify-between">
              <span>Costo por token:</span>
              <span className="font-semibold text-foreground">
                ${(metrics.estimatedCost / metrics.totalTokensUsed).toFixed(6)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Warning */}
      {isApproachingLimit && (
        <div className="flex gap-2 p-2 rounded bg-amber-500/20 border border-amber-500/30">
          <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-200">
            Estás usando mucho contexto. Se recomienda crear un nuevo chat
            para continuar de forma más eficiente.
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="h-7 gap-1.5 text-xs flex-1 min-w-[100px]"
        >
          <Copy className="h-3 w-3" />
          {copied ? "Copiado" : "Copiar"}
        </Button>

        {onExport && (
          <Button
            size="sm"
            variant="outline"
            onClick={onExport}
            className="h-7 gap-1.5 text-xs flex-1 min-w-[100px]"
          >
            <Download className="h-3 w-3" />
            Exportar
          </Button>
        )}

        {onShare && (
          <Button
            size="sm"
            variant="outline"
            onClick={onShare}
            className="h-7 gap-1.5 text-xs flex-1 min-w-[100px]"
          >
            <Share2 className="h-3 w-3" />
            Compartir
          </Button>
        )}

        {onContinue && (
          <Button
            size="sm"
            onClick={onContinue}
            className="h-7 gap-1.5 text-xs flex-1 min-w-[100px] bg-primary hover:bg-primary/90"
          >
            ➕ Nuevo Chat
          </Button>
        )}
      </div>

      {/* Tips */}
      <div className="text-xs text-muted-foreground space-y-1 bg-background/30 p-2 rounded border border-border/20">
        <div className="font-semibold text-foreground text-[10px]">💡 Tips:</div>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>Considera crear un nuevo chat para nuevo contexto</li>
          <li>
            Usa razonamiento solo cuando sea necesario para ahorrar tokens
          </li>
          <li>Las búsquedas web añaden ~100 tokens por búsqueda</li>
        </ul>
      </div>
    </div>
  );
});
