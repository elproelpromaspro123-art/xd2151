import { useState } from "react";
import { Brain, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThinkingIndicatorProps {
  reasoning?: string;
  modelName?: string;
  chatMode?: "roblox" | "general";
  isStreaming?: boolean;
}

export function ThinkingIndicator({ reasoning, modelName, chatMode = "roblox", isStreaming = true }: ThinkingIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex w-full mb-6 justify-start animate-in fade-in-0 duration-300">
      <div className="flex gap-3 max-w-[90%] lg:max-w-[85%]">
        {/* Avatar con efecto especial */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center relative ${
          chatMode === 'general'
            ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30"
            : "bg-gradient-to-br from-primary to-primary/70 text-white shadow-lg shadow-primary/30"
        }`}>
          {isStreaming && (
            <div className="absolute inset-0 rounded-xl animate-pulse" style={{
              background: chatMode === 'general' 
                ? 'radial-gradient(circle, rgba(59,130,246,0.3), transparent)'
                : 'radial-gradient(circle, rgba(79,70,229,0.3), transparent)'
            }}/>
          )}
          <Brain className="h-4 w-4 relative z-10" style={{
            animation: isStreaming ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
          }} />
        </div>

        {/* Thinking content */}
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-medium mb-1.5 flex items-center gap-1 ${
            chatMode === 'general' ? "text-slate-600" : "text-zinc-400"
          }`}>
            <Zap className="w-3 h-3" />
            {modelName || "Asistente"} está pensando...
          </div>

          <div className={`rounded-2xl rounded-tl-md overflow-hidden backdrop-blur-sm ${
            chatMode === 'general'
              ? "bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-400/20 shadow-lg shadow-blue-500/5"
              : "bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-lg shadow-primary/5"
          }`}>
            {/* Header */}
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`w-full flex items-center justify-between px-4 py-2.5 h-auto transition-all ${
                chatMode === 'general'
                  ? "text-blue-700 hover:bg-blue-500/10"
                  : "text-primary hover:bg-primary/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        chatMode === 'general' 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                          : "bg-gradient-to-r from-primary to-primary/70"
                      }`}
                      style={{
                        animation: isStreaming ? `pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite` : 'none',
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold">
                  🧠 Razonamiento en progreso
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
                chatMode === 'general' ? "border-blue-400/20" : "border-primary/20"
              } ${modelName?.includes('Gemini 2.5') ? 'bg-gradient-to-r from-blue-50/40 via-purple-50/40 to-pink-50/40 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 rounded-b-xl' : ''}`}>
                <div className={`text-xs leading-relaxed whitespace-pre-wrap font-mono max-h-64 overflow-y-auto scrollbar-thin ${
                  chatMode === 'general' ? "text-blue-700/90" : "text-primary/90"
                }`}>
                  {reasoning}
                </div>
              </div>
            )}

            {/* Preview when collapsed */}
            {!isExpanded && reasoning && (
              <div className={`px-4 pb-3 ${
                chatMode === 'general' ? "text-blue-600/70" : "text-primary/70"
              } ${modelName?.includes('Gemini 2.5') ? 'bg-gradient-to-r from-blue-50/40 via-purple-50/40 to-pink-50/40 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 rounded-b-xl' : ''}`}>
                <p className="text-xs truncate font-mono font-medium">
                  💭 {reasoning.slice(0, 100)}...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
