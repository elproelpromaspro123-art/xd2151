import { Bot } from "lucide-react";

interface TypingIndicatorProps {
  chatMode?: "roblox" | "general";
}

export function TypingIndicator({ chatMode = "roblox" }: TypingIndicatorProps) {
  return (
    <div className="flex w-full mb-6 justify-start animate-in fade-in-0 duration-300">
      <div className="flex gap-3 max-w-[90%]">
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
          chatMode === 'general'
            ? "bg-slate-100 text-slate-600"
            : "bg-zinc-800 text-zinc-400"
        }`}>
          <Bot className="h-4 w-4" />
        </div>

        {/* Typing bubble */}
        <div className="flex-1">
          <div className={`text-xs font-medium mb-1.5 ${
            chatMode === 'general' ? "text-slate-600" : "text-zinc-400"
          }`}>
            Asistente
          </div>
          
          <div className={`inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-md ${
            chatMode === 'general'
              ? "bg-white border border-slate-200/80 shadow-sm"
              : "bg-zinc-800/80 border border-zinc-700/50"
          }`}>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full animate-bounce ${
                    chatMode === 'general' ? "bg-blue-500" : "bg-primary"
                  }`}
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: "0.6s",
                  }}
                />
              ))}
            </div>
            <span className={`text-xs ml-2 ${
              chatMode === 'general' ? "text-slate-400" : "text-zinc-500"
            }`}>
              Pensando...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
