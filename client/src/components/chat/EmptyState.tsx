import { Sparkles, Palette, Code2, Layers, Brain, Calculator, BookOpen, Lightbulb, Zap, Info } from "lucide-react";

const robloxSuggestions = [
  {
    icon: Palette,
    title: "Menú Principal",
    prompt: "Crea un menú principal moderno con estilo glassmorphism y botones animados para un juego RPG.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Code2,
    title: "Sistema de Inventario",
    prompt: "Diseña un sistema de inventario tipo grid con drag and drop y tooltips para items.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Layers,
    title: "HUD Minimalista",
    prompt: "Genera un HUD minimalista con barra de vida, stamina y minimapa animado.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Sparkles,
    title: "Tienda In-Game",
    prompt: "Crea una tienda in-game con tarjetas de productos y carrito de compras elegante.",
    gradient: "from-amber-500 to-orange-500",
  },
];

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
  const suggestions = chatMode === 'general' ? generalSuggestions : robloxSuggestions;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo/Icon */}
      <div className="relative mb-8">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5`}>
          <Zap className={`w-10 h-10 text-primary`} />
        </div>
        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center bg-primary`}>
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Title */}
      <h1 className={`text-2xl sm:text-3xl font-bold mb-3 text-center text-foreground`}>
        {chatMode === 'general' ? '¿En qué puedo ayudarte?' : 'Roblox UI Designer'}
      </h1>
      
      {/* Subtitle */}
      <p className={`text-center mb-6 max-w-md text-muted-foreground`}>
        {chatMode === 'general' 
          ? 'Pregunta lo que quieras. Estoy aquí para ayudarte.' 
          : 'Describe tu interfaz ideal y obtén código Luau profesional.'}
      </p>

      {/* Recommendation tip for Roblox mode */}
      {chatMode === 'roblox' && (
        <div className="flex items-start gap-2 mb-8 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 max-w-md">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-primary/80">
            <span className="font-medium text-primary">Tip:</span> Para mejores respuestas, sé bastante detallado con tu descripción. 
            Incluye colores, estilos, animaciones y funcionalidades específicas.
          </p>
        </div>
      )}

      {/* Suggestions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.prompt)}
            className={`group flex items-start gap-3 p-4 rounded-xl text-left transition-all duration-200 bg-card hover:bg-card/80 border border-card-border hover:border-primary/30 shadow-sm hover:shadow-md`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${suggestion.gradient} text-white shadow-lg`}>
              <suggestion.icon className="w-5 h-5" />
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

      {/* Footer hint */}
      <p className={`mt-10 text-xs text-center max-w-sm text-muted-foreground/70`}>
        Escribe un mensaje o selecciona una sugerencia para comenzar
        {chatMode === 'roblox' && (
          <span className="block mt-1 text-primary/60">
            Para mejores respuestas te recomendamos ser bastante detallado
          </span>
        )}
      </p>
    </div>
  );
}
