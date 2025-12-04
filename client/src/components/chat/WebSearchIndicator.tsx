import { memo, useState, useEffect } from "react";
import { Globe, Link2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  timestamp: number;
}

interface WebSearchIndicatorProps {
  isActive: boolean;
  results: SearchResult[];
  isSearching: boolean;
  currentSearchQuery?: string;
  onResultClick?: (url: string) => void;
}

export const WebSearchIndicator = memo(function WebSearchIndicator({
  isActive,
  results,
  isSearching,
  currentSearchQuery,
  onResultClick,
}: WebSearchIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayResults, setDisplayResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    setDisplayResults(results);
  }, [results]);

  if (!isActive && !isSearching && results.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        "justify-start"
      )}
    >
      <div className="relative flex gap-3 max-w-[90%] lg:max-w-[85%] w-full">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Globe className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="text-xs font-semibold mb-2 text-emerald-400 flex items-center gap-2">
            <span className="flex items-center gap-1">
              Búsqueda en la Web
              {isSearching && (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
            </span>
          </div>

          {/* Search Box */}
          <div
            className={cn(
              "rounded-2xl rounded-tl-md px-4 py-3 transition-all",
              "bg-emerald-500/10 border border-emerald-500/30",
              "backdrop-blur-sm space-y-3"
            )}
          >
            {/* Current Query */}
            {isSearching && currentSearchQuery && (
              <div className="flex items-center gap-2 pb-3 border-b border-emerald-500/20">
                <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
                <span className="text-sm text-emerald-300">
                  Buscando: <span className="font-semibold">{currentSearchQuery}</span>
                </span>
              </div>
            )}

            {/* Results List */}
            {displayResults.length > 0 && (
              <div
                className={cn(
                  "space-y-2",
                  isExpanded && "max-h-[400px] overflow-y-auto pr-2"
                )}
              >
                {(isExpanded
                  ? displayResults
                  : displayResults.slice(0, 3)
                ).map((result, index) => (
                  <button
                    key={`${result.url}-${index}`}
                    onClick={() => {
                      onResultClick?.(result.url);
                      window.open(result.url, "_blank", "noopener");
                    }}
                    className={cn(
                      "w-full text-left p-2 rounded",
                      "hover:bg-emerald-500/10 transition-colors",
                      "group"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <Link2 className="h-3 w-3 text-emerald-400 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-emerald-300 group-hover:text-emerald-200 line-clamp-1 transition-colors">
                          {result.title}
                        </div>
                        <div className="text-[10px] text-emerald-400/60 group-hover:text-emerald-400/80 line-clamp-1 transition-colors">
                          {result.url}
                        </div>
                        <div className="text-xs text-emerald-300/70 mt-1 line-clamp-2">
                          {result.snippet}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                {!isExpanded && displayResults.length > 3 && (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className={cn(
                      "flex items-center gap-1 text-xs font-semibold",
                      "text-emerald-400 hover:text-emerald-300 transition-colors",
                      "mt-2 pt-2 border-t border-emerald-500/20 w-full justify-center"
                    )}
                  >
                    Ver {displayResults.length - 3} resultados más
                  </button>
                )}

                {isExpanded && displayResults.length > 3 && (
                  <button
                    onClick={() => setIsExpanded(false)}
                    className={cn(
                      "flex items-center gap-1 text-xs font-semibold",
                      "text-emerald-400 hover:text-emerald-300 transition-colors",
                      "mt-2 pt-2 border-t border-emerald-500/20 w-full justify-center"
                    )}
                  >
                    Ocultar resultados
                  </button>
                )}
              </div>
            )}

            {/* Empty State */}
            {isSearching && displayResults.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-emerald-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Buscando en la web...</span>
              </div>
            )}

            {!isSearching && displayResults.length === 0 && isActive && (
              <div className="text-sm text-emerald-300">
                No se encontraron resultados
              </div>
            )}
          </div>

          {/* Footer Info */}
          {displayResults.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground flex gap-2">
              <span>🔍 {displayResults.length} fuentes encontradas</span>
              <span className="text-muted-foreground/50">•</span>
              <span>Información verificada de la web</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
