import { Sparkles, Palette, Code2, Layers } from "lucide-react";

const suggestions = [
  {
    icon: Palette,
    title: "Menú Principal Premium",
    prompt: "Crea un menú principal moderno con estilo glassmorphism, botones animados y efectos de hover premium para un juego RPG.",
  },
  {
    icon: Code2,
    title: "Sistema de Inventario",
    prompt: "Diseña un sistema de inventario tipo grid con drag and drop, tooltips informativos y animaciones fluidas para items.",
  },
  {
    icon: Layers,
    title: "HUD Minimalista",
    prompt: "Genera un HUD minimalista con barra de vida, stamina, minimapa y sistema de notificaciones animado.",
  },
  {
    icon: Sparkles,
    title: "Shop Premium",
    prompt: "Crea una tienda in-game con tarjetas de productos, sistema de categorías, carrito de compras y efectos visuales premium.",
  },
];

interface EmptyStateProps {
  onSuggestionClick: (prompt: string) => void;
  chatMode?: "roblox" | "general";
}

export function EmptyState({ onSuggestionClick, chatMode = "roblox" }: EmptyStateProps) {
  return (
    <div className={`flex-1 flex flex-col items-center justify-center px-4 py-8 animate-fade-in ${
      chatMode === 'general' ? 'bg-gradient-to-b from-white/30 via-indigo-50/20 to-blue-50/30' : ''
    }`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 animated-border-strong animated-border-pulse ${
        chatMode === 'general'
          ? 'bg-gradient-to-br from-indigo-100 to-blue-100'
          : 'bg-primary/10'
      }`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`w-8 h-8 ${chatMode === 'general' ? 'text-indigo-600' : 'text-primary'}`}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
          />
        </svg>
      </div>

      <h1 className={`text-2xl font-semibold mb-2 text-center ${chatMode === 'general' ? 'text-slate-900' : 'text-foreground'}`}>
        {chatMode === 'general' ? 'Asistente Pro' : 'Roblox UI/UX Designer'}
      </h1>
      <p className={`text-center mb-8 max-w-md ${chatMode === 'general' ? 'text-slate-600' : 'text-muted-foreground'}`}>
        {chatMode === 'general' 
          ? '¿En qué puedo ayudarte hoy? Soy tu asistente inteligente para cualquier tema.' 
          : 'Generador de interfaces premium con IA especializada en diseño UI/UX para Roblox Studio. Describe tu idea y obtén código Luau profesional.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.prompt)}
            className={`group flex items-start gap-3 p-4 rounded-lg text-left transition-all animated-border ${
              chatMode === 'general'
                ? 'bg-white/60 hover:bg-indigo-50/60 border border-indigo-200/20'
                : 'bg-card'
            }`}
            data-testid={`button-suggestion-${index}`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              chatMode === 'general'
                ? 'bg-indigo-100 group-hover:bg-indigo-200 text-indigo-600 group-hover:text-indigo-700'
                : 'bg-secondary group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary'
            }`}>
              <suggestion.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium mb-1 ${chatMode === 'general' ? 'text-slate-900' : 'text-foreground'}`}>{suggestion.title}</h3>
              <p className={`text-xs line-clamp-2 ${chatMode === 'general' ? 'text-slate-600' : 'text-muted-foreground'}`}>{suggestion.prompt}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
