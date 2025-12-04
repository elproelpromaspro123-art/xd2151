import { useState } from "react";
import { Brain, ChevronDown, ChevronUp, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThinkingIndicatorProps {
  reasoning?: string;
  modelName?: string;
  chatMode?: "roblox" | "general";
}

export function ThinkingIndicator({ reasoning, modelName, chatMode = "roblox" }: ThinkingIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex w-full mb-6 justify-start animate-in fade-in-0 duration-300">
      <div className="flex gap-3 max-w-[90%] lg:max-w-[85%]">
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
          chatMode === 'general'
            ? "bg-blue-100 text-blue-600"
            : "bg-primary/20 text-primary"
        }`}>
          <Brain className="h-4 w-4 animate-pulse" />
        </div>

        {/* Thinking content */}
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-medium mb-1.5 ${
            chatMode === 'general' ? "text-slate-600" : "text-zinc-400"
          }`}>
            {modelName || "Asistente"} está pensando...
          </div>

          <div className={`rounded-2xl rounded-tl-md overflow-hidden ${
            chatMode === 'general'
              ? "bg-blue-50/50 border border-blue-200/50"
              : "bg-primary/5 border border-primary/20"
          }`}>
            {/* Header */}
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`w-full flex items-center justify-between px-4 py-2.5 h-auto ${
                chatMode === 'general'
                  ? "text-blue-700 hover:bg-blue-100/50"
                  : "text-primary hover:bg-primary/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                        chatMode === 'general' ? "bg-blue-500" : "bg-primary"
                      }`}
                      style={{
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium">
                  Razonamiento en progreso
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {/* Expandable content */}
            {isExpanded && reasoning && (
              <div className={`px-4 pb-4 pt-2 border-t ${
                chatMode === 'general' ? "border-blue-200/50" : "border-primary/20"
              }`}>
                <div className={`text-xs leading-relaxed whitespace-pre-wrap font-mono max-h-64 overflow-y-auto scrollbar-thin ${
                  chatMode === 'general' ? "text-blue-800/80" : "text-primary/80"
                }`}>
                  {reasoning}
                </div>
              </div>
            )}

            {/* Preview when collapsed */}
            {!isExpanded && reasoning && (
              <div className={`px-4 pb-3 ${
                chatMode === 'general' ? "text-blue-600/60" : "text-primary/60"
              }`}>
                <p className="text-xs truncate font-mono">
                  {reasoning.slice(0, 100)}...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
