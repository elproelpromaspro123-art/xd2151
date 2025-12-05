import { useState } from "react";
import { Brain, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
          {/* Header with enhanced styling */}
          <div className="text-xs font-bold mb-3 text-purple-400 flex items-center gap-2">
            <div className="p-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              <Zap className="h-3 w-3" />
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Pensamiento de {modelName || "Asistente"}
            </span>
            {isStreaming && (
              <div className="flex items-center gap-1">
                <span className="animate-pulse text-purple-400">●</span>
                <span className="text-xs text-purple-300/70">pensando</span>
              </div>
            )}
          </div>

          {/* Reasoning Box with beautiful design */}
          <div
            className={cn(
              "rounded-3xl rounded-tl-lg px-5 py-4 transition-all duration-300",
              "bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5",
              "border border-purple-500/20 backdrop-blur-md",
              "shadow-xl shadow-purple-500/5",
              "hover:shadow-purple-500/10 hover:border-purple-500/30"
            )}
          >
            {/* Preview Mode - Collapsed */}
            {!isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className={cn(
                  "w-full text-left group cursor-pointer",
                  "hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5",
                  "p-3 rounded-2xl transition-all duration-200 -m-1"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap break-words font-medium">
                      {reasoning || "Procesando pensamiento..."}
                    </p>
                    {reasoning && reasoning.length > 100 && (
                      <div className="flex items-center gap-2 mt-3 text-xs text-purple-300 font-semibold group-hover:text-purple-200 transition-colors">
                        <div className="p-1 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                          <ChevronDown className="h-3 w-3 group-hover:translate-y-0.5 transition-transform" />
                        </div>
                        Ver razonamiento completo
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )}

            {/* Expanded Mode */}
            {isExpanded && (
              <div className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                  {reasoning}
                </div>

                <button
                  onClick={() => setIsExpanded(false)}
                  className={cn(
                    "flex items-center gap-2 text-xs font-semibold",
                    "text-purple-300 hover:text-purple-200 transition-colors",
                    "mt-4 pt-4 border-t border-purple-500/20",
                    "hover:bg-purple-500/5 px-3 py-2 rounded-xl -mx-3 -mb-2"
                  )}
                >
                  <ChevronDown className="h-3 w-3 rotate-180 transition-transform" />
                  Ocultar razonamiento
                </button>
              </div>
            )}

            {/* Streaming Indicator with enhanced animation */}
            {isStreaming && (
              <div className="mt-4 pt-4 border-t border-purple-500/20">
                <div className="flex items-center gap-3 text-xs text-purple-300">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-ping opacity-30"></div>
                    <div className="relative w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"></div>
                  </div>
                  <span className="font-medium">Procesando pensamiento...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
