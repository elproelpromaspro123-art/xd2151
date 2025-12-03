import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Send, Loader2, Globe, Image, Brain, ChevronDown, X, Gamepad2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AIModel } from "@shared/schema";

interface PastedChip {
  id: string;
  preview: string;
  fullContent: string;
}

interface ChatInputProps {
  onSend: (message: string, useWebSearch: boolean, imageBase64?: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  webSearchRemaining?: number;
  models?: AIModel[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  useReasoning: boolean;
  onReasoningChange: (value: boolean) => void;
  isPremium: boolean;
  chatMode: "roblox" | "general";
  onChatModeChange: (mode: "roblox" | "general") => void;
}

const WEB_SEARCH_KEYWORDS = [
  "busca en la web", "buscar en la web", "busca en internet", "buscar en internet",
  "busca online", "buscar online", "search the web", "search online", "web search",
  "busca informacion", "buscar informacion", "busca sobre", "buscar sobre",
  "que hay de nuevo", "ultimas noticias", "tendencias actuales",
  "busca en google", "googlealo", "investigar", "investiga"
];

export function ChatInput({ 
  onSend, 
  isLoading, 
  disabled = false, 
  webSearchRemaining = 5,
  models = [],
  selectedModel,
  onModelChange,
  useReasoning,
  onReasoningChange,
  isPremium,
  chatMode,
  onChatModeChange
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [pastedChips, setPastedChips] = useState<PastedChip[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedModelInfo = models.find(m => m.key === selectedModel);
  const canUploadImage = selectedModelInfo?.supportsImages && (isPremium || !selectedModelInfo?.isPremiumOnly);
  const canUseReasoning = selectedModelInfo?.supportsReasoning && (isPremium || !selectedModelInfo?.isPremiumOnly);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    
    if (pastedText.length > 100) {
      e.preventDefault();
      const preview = pastedText.slice(0, 80).replace(/\n/g, ' ') + '...';
      const newChip: PastedChip = {
        id: Date.now().toString(),
        preview,
        fullContent: pastedText,
      };
      setPastedChips(prev => [...prev, newChip]);
    }
  }, []);

  const removeChip = (chipId: string) => {
    setPastedChips(prev => prev.filter(c => c.id !== chipId));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImageBase64(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const detectWebSearchIntent = useCallback((text: string): boolean => {
    const lowerText = text.toLowerCase();
    return WEB_SEARCH_KEYWORDS.some(keyword => lowerText.includes(keyword));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const chipContents = pastedChips.map(c => c.fullContent).join('\n\n');
    const fullMessage = chipContents ? `${chipContents}\n\n${message.trim()}` : message.trim();
    
    if (fullMessage && !isLoading && !disabled) {
      const shouldUseWebSearch = useWebSearch || (canUseWebSearch && detectWebSearchIntent(fullMessage));
      
      if (shouldUseWebSearch && !useWebSearch) {
        setUseWebSearch(true);
      }
      
      onSend(fullMessage, shouldUseWebSearch, imageBase64 || undefined);
      setMessage("");
      setPastedChips([]);
      setImagePreview(null);
      setImageBase64(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canUseWebSearch = webSearchRemaining > 0;
  const hasContent = message.trim() || pastedChips.length > 0;

  return (
    <div className={`p-4 border-t transition-colors ${chatMode === 'general' ? 'border-indigo-200/30 bg-gradient-to-r from-white/40 via-indigo-50/20 to-blue-50/20 backdrop-blur-md' : 'border-border/50 bg-background/80 backdrop-blur-sm'}`}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className={`relative rounded-xl animated-border-strong overflow-visible transition-colors ${chatMode === 'general' ? 'bg-white/70 border border-indigo-200/40 shadow-sm hover:border-indigo-300/50' : 'bg-card'}`}>
          {pastedChips.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 pb-0">
              {pastedChips.map(chip => (
                <div 
                  key={chip.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs max-w-[200px] group transition-colors ${chatMode === 'general' ? 'bg-indigo-100/60 border border-indigo-200/40' : 'bg-secondary/80'}`}
                >
                  <span className={`truncate ${chatMode === 'general' ? 'text-slate-700' : 'text-muted-foreground'}`}>{chip.preview}</span>
                  <button
                    type="button"
                    onClick={() => removeChip(chip.id)}
                    className={`transition-colors opacity-0 group-hover:opacity-100 ${chatMode === 'general' ? 'text-slate-600 hover:text-indigo-600' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${chatMode === 'general' ? 'bg-indigo-100 text-indigo-700' : 'bg-primary/10 text-primary'}`}>
                    PASTED
                  </span>
                </div>
              ))}
            </div>
          )}

          {imagePreview && (
            <div className="p-3 pb-0">
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className={`h-20 w-auto rounded-lg object-cover border transition-colors ${chatMode === 'general' ? 'border-indigo-200/50' : 'border-border'}`}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={chatMode === "general" 
              ? "Preguntame lo que quieras... estoy aqui para ayudarte" 
              : "Describe el diseño UI/UX que necesitas para Roblox Studio..."}
            disabled={isLoading || disabled}
            rows={1}
            className={`w-full resize-none bg-transparent px-4 py-3 pr-14 text-sm focus:outline-none disabled:opacity-50 min-h-[48px] max-h-[200px] rounded-xl transition-colors ${
              chatMode === 'general' 
                ? 'text-slate-900 placeholder:text-slate-500' 
                : 'text-foreground placeholder:text-muted-foreground'
            }`}
            data-testid="input-chat-message"
          />
          
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            
            {canUploadImage && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className={`h-8 w-8 transition-colors ${
                  chatMode === 'general'
                    ? 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={`Subir imagen (${selectedModelInfo?.name || 'modelo con soporte de imágenes'})`}
              >
                <Image className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              type="submit"
              size="icon"
              disabled={!hasContent || isLoading || disabled}
              className={`h-9 w-9 rounded-lg transition-all ${
                chatMode === 'general'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-primary hover:bg-primary/90'
              }`}
              data-testid="button-send-message"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-between mt-3 px-1 gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-1.5 text-xs"
                  disabled={isLoading}
                >
                  <span className="max-w-[100px] truncate">{selectedModelInfo?.name || "Modelo"}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {models.map(model => (
                  <DropdownMenuItem
                    key={model.key}
                    onClick={() => {
                      if (model.available) {
                        onModelChange(model.key);
                        if (!model.supportsReasoning) {
                          onReasoningChange(false);
                        }
                      }
                    }}
                    className={`flex flex-col items-start gap-1 ${!model.available ? 'opacity-50' : ''}`}
                    disabled={!model.available}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span className="font-medium">{model.name}</span>
                        <div className="ml-auto flex items-center gap-2">
                          {model.supportsReasoning && (
                            <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[10px] font-medium">
                              WITH REASONING
                            </span>
                          )}
                          {model.isPremiumOnly && (
                            <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[10px] font-medium">
                              PREMIUM
                            </span>
                          )}
                        </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{model.description}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
              <Button
                type="button"
                size="sm"
                variant={chatMode === "roblox" ? "default" : "ghost"}
                onClick={() => onChatModeChange("roblox")}
                disabled={isLoading}
                className={`h-7 px-2 text-xs gap-1 ${chatMode === "roblox" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                data-testid="button-mode-roblox"
              >
                <Gamepad2 className="h-3 w-3" />
                <span className="hidden sm:inline">Roblox</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant={chatMode === "general" ? "default" : "ghost"}
                onClick={() => onChatModeChange("general")}
                disabled={isLoading}
                className={`h-7 px-2 text-xs gap-1 ${chatMode === "general" ? "bg-blue-500 text-white hover:bg-blue-500/90" : "text-muted-foreground"}`}
                data-testid="button-mode-general"
              >
                <MessageCircle className="h-3 w-3" />
                <span className="hidden sm:inline">General</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="web-search"
                checked={useWebSearch}
                onCheckedChange={setUseWebSearch}
                disabled={!canUseWebSearch || isLoading}
                className="data-[state=checked]:bg-primary scale-90"
              />
              <label 
                htmlFor="web-search" 
                className={`flex items-center gap-1 text-xs cursor-pointer ${
                  canUseWebSearch ? 'text-muted-foreground' : 'text-muted-foreground/50'
                }`}
              >
                <Globe className="h-3 w-3" />
                <span className="hidden sm:inline">Web</span>
                <span className={`px-1 py-0.5 rounded text-[10px] font-medium ${
                  canUseWebSearch ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {webSearchRemaining === 999 ? "∞" : webSearchRemaining}
                </span>
              </label>
            </div>

            {canUseReasoning && (
              <div className="flex items-center gap-2">
                <Switch
                  id="reasoning"
                  checked={useReasoning}
                  onCheckedChange={onReasoningChange}
                  disabled={isLoading}
                  className="data-[state=checked]:bg-blue-500 scale-90"
                />
                <label 
                  htmlFor="reasoning" 
                  className="flex items-center gap-1 text-xs cursor-pointer text-muted-foreground"
                >
                  <Brain className="h-3 w-3" />
                  <span className="hidden sm:inline">Reasoning</span>
                </label>
              </div>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground hidden sm:block">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Enter</kbd>
            <span className="mx-1">enviar</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Shift+Enter</kbd>
            <span className="ml-1">nueva línea</span>
          </p>
        </div>
      </form>
      
      <p className="text-[10px] text-muted-foreground/60 text-center mt-3 max-w-4xl mx-auto">
        La IA puede cometer errores. Verifica siempre el código generado antes de usarlo en producción.
      </p>
    </div>
  );
}
