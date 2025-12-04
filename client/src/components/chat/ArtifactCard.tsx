import { ChevronRight, Code2 } from "lucide-react";

interface ArtifactCardProps {
  title: string;
  language: string;
  code: string;
  onOpen: () => void;
}

export function ArtifactCard({ title, language, code, onOpen }: ArtifactCardProps) {
  const displayLanguage = 
    language === "luau" ? "Luau" : 
    language === "lua" ? "Luau" :
    language.toUpperCase();

  const lineCount = code.split('\n').length;

  return (
    <button
      onClick={onOpen}
      className="w-full group relative rounded-lg border border-border/50 bg-gradient-to-br from-muted/35 to-muted/15 hover:from-muted/55 hover:to-muted/25 transition-all duration-250 p-4 text-left mb-4 shadow-sm hover:shadow-lg hover:border-border/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
      
      <div className="relative z-10 flex items-start gap-3">
        {/* Icon */}
        <div className="mt-0.5 flex-shrink-0 p-2 rounded-md bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 group-hover:text-blue-300 transition-all duration-200">
          <Code2 className="w-4 h-4" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground group-hover:text-primary/90 transition-colors duration-200 truncate leading-tight">
              {title}
            </h3>
            <span className="text-xs font-mono text-muted-foreground/80 bg-background/50 group-hover:bg-background/70 px-2 py-0.5 rounded flex-shrink-0 transition-colors duration-200">
              {displayLanguage}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground/90 group-hover:text-muted-foreground transition-colors duration-200 mb-1.5">
            Click to open code
          </p>
          
          <div className="text-xs text-muted-foreground/60 group-hover:text-muted-foreground/70 transition-colors duration-200">
            {lineCount} line{lineCount !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Chevron Icon */}
        <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-all duration-200 -translate-x-0.5 group-hover:translate-x-1">
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary/70 transition-colors duration-200" />
        </div>
      </div>
    </button>
  );
}
