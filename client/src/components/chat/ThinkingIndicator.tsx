import { Brain, Loader2 } from "lucide-react";

interface ThinkingIndicatorProps {
  reasoning?: string;
  modelName?: string;
}

export function ThinkingIndicator({ reasoning }: ThinkingIndicatorProps) {
  return (
    <div className="px-4 py-3 mb-2 mx-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
      <div className="flex items-center gap-2 mb-2">
        <div className="relative">
          <Brain className="h-4 w-4 text-blue-500" />
          <div className="absolute -top-1 -right-1">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          </div>
        </div>
        <span className="text-xs font-medium text-blue-500 flex items-center gap-2">
          {modelName ? `${modelName} está pensando...` : 'Pensando...'}
          <Loader2 className="h-3 w-3 animate-spin" />
        </span>
      </div>
      {reasoning && (
        <div className="mt-2 pl-6 border-l-2 border-blue-500/30">
          <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {reasoning}
          </p>
        </div>
      )}
      {!reasoning && (
        <div className="flex items-center gap-1 pl-6">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
          <span className="text-[10px] text-muted-foreground ml-2">Analizando y razonando la respuesta...</span>
        </div>
      )}
    </div>
  );
}
