import { Sparkles, Palette, Code2, Layers, Brain, Calculator, BookOpen, Lightbulb, Zap, Info, Gamepad2, MousePointer, Settings, ShoppingCart } from "lucide-react";


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

const robloxSuggestions = [
  {
    icon: Gamepad2,
    title: "Menú Principal",
    prompt: "Crea un menú principal moderno con botones animados, fondo con gradiente y efectos de hover. Incluye botones para Jugar, Tienda, Configuración y Salir.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: MousePointer,
    title: "Sistema de Inventario",
    prompt: "Diseña un sistema de inventario tipo grid con slots para items, tooltips al hacer hover, sistema de drag & drop, y animaciones suaves de apertura/cierre.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Settings,
    title: "Panel de Configuración",
    prompt: "Crea un panel de configuración completo con sliders para volumen, toggles para efectos visuales, dropdowns para calidad gráfica, y botones para guardar/cargar configuraciones.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: ShoppingCart,
    title: "Tienda In-Game",
    prompt: "Desarrolla una tienda virtual con categorías de productos, sistema de monedas, preview de items con animaciones 3D, y efectos de compra con partículas.",
    gradient: "from-amber-500 to-orange-500",
  },
];

interface EmptyStateProps {
  onSuggestionClick: (prompt: string) => void;
  chatMode?: "roblox" | "general";
}

export function EmptyState({ onSuggestionClick, chatMode = "roblox" }: EmptyStateProps) {
  const suggestions = chatMode === 'general' ? generalSuggestions : robloxSuggestions;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-4 sm:py-6 md:py-12 min-h-[50vh] sm:min-h-[60vh] relative overflow-visible">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-radial from-secondary/5 to-transparent rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Logo/Icon */}
      <div className="relative mb-8 sm:mb-12 animate-float">
        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center bg-gradient-to-br from-primary/25 to-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover-lift border border-primary/20`}>
          <Zap className={`w-10 h-10 sm:w-12 sm:h-12 text-primary`} />
        </div>
        <div className={`absolute -bottom-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 shadow-lg animate-pulse border border-primary/50`}>
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </div>
      </div>

      {/* Title */}
      <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-center text-foreground px-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80`}>
        {chatMode === 'general' ? '¿En qué puedo ayudarte?' : 'Roblox UI Designer'}
      </h1>

      {/* Subtitle */}
      <p className={`text-center mb-8 sm:mb-10 max-w-lg text-base sm:text-lg text-muted-foreground px-2 leading-relaxed`}>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-4xl px-2 sm:px-4 overflow-visible">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.prompt)}
              className={`group flex items-start gap-3 p-3 sm:p-4 rounded-xl text-left transition-all duration-300 bg-card hover:bg-card/90 border border-card-border hover:border-primary/40 shadow-sm hover:shadow-lg hover-lift relative overflow-hidden`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Subtle background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.gradient} opacity-0 group-hover:opacity-8 transition-opacity duration-300 rounded-2xl`}></div>

              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${suggestion.gradient} text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 relative z-10`}>
                <suggestion.icon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1 min-w-0 relative z-10">
                <h3 className={`text-sm sm:text-base font-semibold mb-1.5 text-card-foreground group-hover:text-primary transition-colors duration-200`}>
                  {suggestion.title}
                </h3>
                <p className={`text-xs sm:text-sm line-clamp-2 text-muted-foreground group-hover:text-muted-foreground/90 transition-colors duration-200`}>
                  {suggestion.prompt}
                </p>
              </div>

              {/* Subtle shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Footer hint */}
      <div className={`mt-12 sm:mt-16 px-3 py-3 sm:py-4 rounded-xl bg-primary/8 border border-primary/20 max-w-sm mx-2 backdrop-blur-sm`}>
        <p className={`text-xs sm:text-sm text-center text-muted-foreground leading-relaxed`}>
          <span className="text-foreground/80 font-medium">Escribe un mensaje para comenzar</span>
          {chatMode === 'roblox' && (
            <span className="block mt-2 text-primary/70 text-xs sm:text-sm">
              💡 Para mejores respuestas sé detallado: incluye colores, estilos y animaciones
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
