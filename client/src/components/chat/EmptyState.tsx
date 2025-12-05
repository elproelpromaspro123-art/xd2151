import { Sparkles, Palette, Code2, Layers, Brain, Calculator, BookOpen, Lightbulb, Zap, Info } from "lucide-react";


const generalSuggestions = [
  {
    icon: Brain,
    title: "Explicación",
    prompt: "Explícame la teoría de la relatividad de forma sencilla con ejemplos cotidianos.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Calculator,
    title: "Problema",
    prompt: "Ayúdame a resolver este problema matemático paso a paso.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: BookOpen,
    title: "Resumen",
    prompt: "Haz un resumen conciso de los puntos clave del siguiente texto...",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Lightbulb,
    title: "Ideas",
    prompt: "Dame 5 ideas creativas para una campaña de marketing digital.",
    gradient: "from-amber-500 to-yellow-500",
  },
];

interface EmptyStateProps {
  onSuggestionClick: (prompt: string) => void;
  chatMode?: "roblox" | "general";
}

export function EmptyState({ onSuggestionClick, chatMode = "roblox" }: EmptyStateProps) {
  const suggestions = chatMode === 'general' ? generalSuggestions : [];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-12 min-h-[60vh]">
      {/* Logo/Icon */}
      <div className="relative mb-6 sm:mb-8">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5`}>
          <Zap className={`w-8 h-8 sm:w-10 sm:h-10 text-primary`} />
        </div>
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center bg-primary`}>
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
        </div>
      </div>

      {/* Title */}
      <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-3 text-center text-foreground px-2`}>
        {chatMode === 'general' ? '¿En qué puedo ayudarte?' : 'Roblox UI Designer'}
      </h1>

      {/* Subtitle */}
      <p className={`text-center mb-4 sm:mb-6 max-w-md text-sm sm:text-base text-muted-foreground px-2`}>
        {chatMode === 'general'
          ? 'Pregunta lo que quieras. Estoy aquí para ayudarte.'
          : 'Describe tu interfaz ideal y obtén código Luau profesional.'}
      </p>

      {/* Recommendation tip for Roblox mode */}
      {chatMode === 'roblox' && (
        <div className="flex items-start gap-2 mb-6 sm:mb-8 px-3 sm:px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 max-w-md mx-2">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-primary/80">
            <span className="font-medium text-primary">Tip:</span> Para mejores respuestas, sé bastante detallado con tu descripción.
            Incluye colores, estilos, animaciones y funcionalidades específicas.
          </p>
        </div>
      )}

      {/* Suggestions grid */}
      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl px-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.prompt)}
              className={`group flex items-start gap-3 p-3 sm:p-4 rounded-xl text-left transition-all duration-200 bg-card hover:bg-card/80 border border-card-border hover:border-primary/30 shadow-sm hover:shadow-md`}
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${suggestion.gradient} text-white shadow-lg`}>
                <suggestion.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-semibold mb-0.5 text-card-foreground`}>
                  {suggestion.title}
                </h3>
                <p className={`text-xs line-clamp-2 text-muted-foreground`}>
                  {suggestion.prompt}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Footer hint */}
      <p className={`mt-8 sm:mt-10 text-xs sm:text-sm text-center max-w-sm text-muted-foreground/70 px-2`}>
        Escribe un mensaje para comenzar
        {chatMode === 'roblox' && (
          <span className="block mt-1 text-primary/60">
            Para mejores respuestas te recomendamos ser bastante detallado
          </span>
        )}
      </p>
    </div>
  );
}
