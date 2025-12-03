import { Brain, Loader2 } from "lucide-react";

interface ThinkingIndicatorProps {
  reasoning?: string;
  modelName?: string;
  chatMode?: "roblox" | "general";
}

export function ThinkingIndicator({ reasoning, chatMode = "roblox" }: ThinkingIndicatorProps) {
  return (
    <div className={`px-4 py-3 mb-2 mx-4 rounded-lg border transition-colors ${
      chatMode === 'general'
        ? 'bg-gradient-to-r from-indigo-500/5 to-blue-500/5 border-indigo-200/30'
        : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="relative">
          <Brain className={`h-4 w-4 transition-colors ${chatMode === 'general' ? 'text-indigo-600' : 'text-blue-500'}`} />
          <div className="absolute -top-1 -right-1">
            <span className="flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                chatMode === 'general' ? 'bg-indigo-400' : 'bg-blue-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 transition-colors ${
                chatMode === 'general' ? 'bg-indigo-600' : 'bg-blue-500'
              }`}></span>
            </span>
          </div>
        </div>
        <span className={`text-xs font-medium flex items-center gap-2 transition-colors ${
          chatMode === 'general' ? 'text-indigo-600' : 'text-blue-500'
        }`}>
          {modelName ? `${modelName} está pensando...` : 'Pensando...'}
          <Loader2 className="h-3 w-3 animate-spin" />
        </span>
      </div>
      {reasoning && (
        <div className={`mt-2 pl-6 border-l-2 transition-colors ${
          chatMode === 'general' ? 'border-indigo-200/50' : 'border-blue-500/30'
        }`}>
          <p className={`text-xs whitespace-pre-wrap leading-relaxed transition-colors ${
            chatMode === 'general' ? 'text-slate-600' : 'text-muted-foreground'
          }`}>
            {reasoning}
          </p>
        </div>
      )}
      {!reasoning && (
        <div className="flex items-center gap-1 pl-6">
          <div className="flex space-x-1">
            <div className={`w-1.5 h-1.5 rounded-full animate-bounce transition-colors ${
              chatMode === 'general' ? 'bg-indigo-500/60' : 'bg-blue-500/60'
            }`} style={{ animationDelay: "0ms" }}></div>
            <div className={`w-1.5 h-1.5 rounded-full animate-bounce transition-colors ${
              chatMode === 'general' ? 'bg-indigo-500/60' : 'bg-blue-500/60'
            }`} style={{ animationDelay: "150ms" }}></div>
            <div className={`w-1.5 h-1.5 rounded-full animate-bounce transition-colors ${
              chatMode === 'general' ? 'bg-indigo-500/60' : 'bg-blue-500/60'
            }`} style={{ animationDelay: "300ms" }}></div>
          </div>
          <span className={`text-[10px] ml-2 transition-colors ${
            chatMode === 'general' ? 'text-slate-500' : 'text-muted-foreground'
          }`}>Analizando y razonando la respuesta...</span>
        </div>
      )}
    </div>
  );
}
