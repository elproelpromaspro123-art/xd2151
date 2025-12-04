import { memo, useState } from "react";
import { ChevronDown, Lightbulb, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReasoningDisplayProps {
  reasoning: string;
  modelName?: string;
  isStreaming: boolean;
  chatMode: "roblox" | "general";
}

export const ReasoningDisplay = memo(function ReasoningDisplay({
  reasoning,
  modelName = "Assistant",
  isStreaming,
  chatMode,
}: ReasoningDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!reasoning) return null;

  const displayReasoning =
    isStreaming && reasoning.length > 500
      ? reasoning.substring(0, 500) + "..."
      : reasoning;

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        "justify-start"
      )}
    >
      <div className="relative flex gap-3 max-w-[90%] lg:max-w-[85%] w-full">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center bg-blue-500/20 text-blue-400 border border-blue-500/30">
          <Brain className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="text-xs font-semibold mb-2 text-blue-400 flex items-center gap-1.5">
            <Lightbulb className="h-3 w-3" />
            <span>Razonamiento del {modelName}</span>
            {isStreaming && <span className="animate-pulse">●</span>}
          </div>

          {/* Reasoning Box */}
          <div
            className={cn(
              "rounded-2xl rounded-tl-md px-4 py-3 transition-all",
              "bg-blue-500/10 border border-blue-500/30",
              "backdrop-blur-sm"
            )}
          >
            {/* Preview Mode - Collapsed */}
            {!isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className={cn(
                  "w-full text-left group cursor-pointer",
                  "hover:bg-blue-500/5 p-2 rounded transition-colors -m-2"
                )}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-blue-300 leading-relaxed whitespace-pre-wrap break-words">
                      {displayReasoning}
                    </p>
                    {reasoning.length > 500 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-blue-400 font-semibold">
                        <ChevronDown className="h-3 w-3 group-hover:translate-y-0.5 transition-transform" />
                        Ver razonamiento completo
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )}

            {/* Expanded Mode */}
            {isExpanded && (
              <div className="space-y-3">
                <div className="text-sm text-blue-300 leading-relaxed whitespace-pre-wrap break-words max-h-[400px] overflow-y-auto pr-2">
                  {reasoning}
                </div>

                <button
                  onClick={() => setIsExpanded(false)}
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold",
                    "text-blue-400 hover:text-blue-300 transition-colors",
                    "mt-3 pt-3 border-t border-blue-500/20"
                  )}
                >
                  <ChevronDown className="h-3 w-3 rotate-180 transition-transform" />
                  Ocultar razonamiento
                </button>
              </div>
            )}

            {/* Streaming Indicator */}
            {isStreaming && (
              <div className="mt-3 pt-3 border-t border-blue-500/20">
                <div className="flex items-center gap-2 text-xs text-blue-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                  </span>
                  Razonando...
                </div>
              </div>
            )}
          </div>

          {/* Info Footer */}
          <div className="mt-2 text-xs text-muted-foreground flex gap-2">
            <span>💭 Pensamiento intermedio</span>
            <span className="text-muted-foreground/50">•</span>
            <span>
              {reasoning.split(" ").length} palabras de razonamiento
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
