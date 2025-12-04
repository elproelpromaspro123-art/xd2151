import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Send, Loader2, Globe, Image, Brain, ChevronDown, X, 
  Gamepad2, MessageCircle, StopCircle, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  onStopGeneration?: () => void;
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
  onChatModeChange,
  onStopGeneration
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [pastedChips, setPastedChips] = useState<PastedChip[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
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
      const preview = pastedText.slice(0, 60).replace(/\n/g, ' ') + '...';
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

  // Filtrar modelos por plan (free vs premium)
  const freeModels = models.filter(m => !m.isPremiumOnly);
  const premiumModels = models.filter(m => m.isPremiumOnly);

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        {/* Main input container */}
        <div className={`relative rounded-2xl transition-all duration-200 ${
          isFocused 
            ? chatMode === 'general'
              ? 'ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/5'
              : 'ring-2 ring-primary/30 shadow-lg shadow-primary/5'
            : 'shadow-md'
        } ${
          chatMode === 'general'
            ? 'bg-white border border-slate-200/80'
            : 'bg-zinc-800/80 border border-zinc-700/50'
        }`}>
          
          {/* Pasted chips */}
          {pastedChips.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 pb-0">
              {pastedChips.map(chip => (
                <div 
                  key={chip.id}
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs group ${
                    chatMode === 'general' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/50' 
                      : 'bg-primary/10 text-primary border border-primary/20'
                  }`}
                >
                  <span className="truncate max-w-[150px]">{chip.preview}</span>
                  <button
                    type="button"
                    onClick={() => removeChip(chip.id)}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Image preview */}
          {imagePreview && (
            <div className="p-3 pb-0">
              <div className="relative inline-block group">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className={`h-16 w-auto rounded-xl object-cover border-2 ${
                    chatMode === 'general' ? 'border-slate-200' : 'border-zinc-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={chatMode === "general" 
              ? "¿En qué puedo ayudarte hoy?" 
              : "Describe tu interfaz de Roblox..."}
            disabled={isLoading || disabled}
            rows={1}
            className={`w-full resize-none bg-transparent px-4 py-3.5 pr-24 text-sm focus:outline-none disabled:opacity-50 min-h-[52px] max-h-[200px] ${
              chatMode === 'general' 
                ? 'text-slate-900 placeholder:text-slate-400' 
                : 'text-white placeholder:text-zinc-500'
            }`}
          />
          
          {/* Action buttons */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {canUploadImage && !isLoading && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className={`h-8 w-8 rounded-lg ${
                  chatMode === 'general'
                    ? 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                    : 'text-zinc-500 hover:text-primary hover:bg-primary/10'
                }`}
              >
                <Image className="h-4 w-4" />
              </Button>
            )}
            
            {isLoading && onStopGeneration ? (
              <Button
                type="button"
                size="icon"
                onClick={onStopGeneration}
                className="h-9 w-9 rounded-xl bg-red-500 hover:bg-red-600 text-white"
              >
                <StopCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!hasContent || isLoading || disabled}
                className={`h-9 w-9 rounded-xl transition-all ${
                  hasContent
                    ? chatMode === 'general'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                      : 'bg-primary hover:bg-primary/90 shadow-md'
                    : chatMode === 'general'
                      ? 'bg-slate-100 text-slate-400'
                      : 'bg-zinc-700 text-zinc-500'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
        
        {/* Controls bar */}
        <div className="flex flex-wrap items-center justify-between mt-3 px-1 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Model selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-8 gap-1.5 text-xs rounded-lg ${
                    chatMode === 'general'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                  disabled={isLoading}
                >
                  <Sparkles className="h-3 w-3" />
                  <span className="max-w-[100px] truncate">{selectedModelInfo?.name || "Modelo"}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                {freeModels.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Free
                    </div>
                    {freeModels.map(model => (
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
                        className={`flex flex-col items-start gap-0.5 py-2 ${!model.available ? 'opacity-50' : ''}`}
                        disabled={!model.available}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className="font-medium text-sm">{model.name}</span>
                          <div className="ml-auto flex items-center gap-1">
                            {model.supportsImages && (
                              <span className="px-1.5 py-0.5 bg-green-500/10 text-green-600 rounded text-[9px] font-medium">
                                IMG
                              </span>
                            )}
                            {model.supportsReasoning && (
                              <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-600 rounded text-[9px] font-medium">
                                R1
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{model.description}</span>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
                
                {premiumModels.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5 text-[10px] font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Premium
                    </div>
                    {premiumModels.map(model => (
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
                        className={`flex flex-col items-start gap-0.5 py-2 ${!model.available ? 'opacity-50' : ''}`}
                        disabled={!model.available}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className="font-medium text-sm">{model.name}</span>
                          <div className="ml-auto flex items-center gap-1">
                            {model.supportsImages && (
                              <span className="px-1.5 py-0.5 bg-green-500/10 text-green-600 rounded text-[9px] font-medium">
                                IMG
                              </span>
                            )}
                            {model.supportsReasoning && (
                              <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-600 rounded text-[9px] font-medium">
                                R1
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{model.description}</span>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mode toggle */}
            <div className={`flex items-center rounded-lg p-0.5 ${
              chatMode === 'general' ? 'bg-slate-100' : 'bg-zinc-800'
            }`}>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onChatModeChange("roblox")}
                disabled={isLoading}
                className={`h-7 px-2.5 text-xs gap-1 rounded-md ${
                  chatMode === "roblox" 
                    ? "bg-white shadow-sm text-slate-900" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Gamepad2 className="h-3 w-3" />
                <span className="hidden sm:inline">Roblox</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onChatModeChange("general")}
                disabled={isLoading}
                className={`h-7 px-2.5 text-xs gap-1 rounded-md ${
                  chatMode === "general" 
                    ? "bg-white shadow-sm text-blue-600" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <MessageCircle className="h-3 w-3" />
                <span className="hidden sm:inline">General</span>
              </Button>
            </div>

            {/* Web search toggle */}
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${
              chatMode === 'general' ? 'hover:bg-slate-100' : 'hover:bg-zinc-800'
            }`}>
              <Switch
                id="web-search"
                checked={useWebSearch}
                onCheckedChange={setUseWebSearch}
                disabled={!canUseWebSearch || isLoading}
                className="scale-75"
              />
              <label 
                htmlFor="web-search" 
                className={`flex items-center gap-1 text-xs cursor-pointer ${
                  canUseWebSearch 
                    ? chatMode === 'general' ? 'text-slate-600' : 'text-zinc-400'
                    : chatMode === 'general' ? 'text-slate-400' : 'text-zinc-600'
                }`}
              >
                <Globe className="h-3 w-3" />
                <span className="hidden sm:inline">Web</span>
              </label>
            </div>

            {/* Reasoning toggle */}
            {canUseReasoning && (
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${
                chatMode === 'general' ? 'hover:bg-slate-100' : 'hover:bg-zinc-800'
              }`}>
                <Switch
                  id="reasoning"
                  checked={useReasoning}
                  onCheckedChange={onReasoningChange}
                  disabled={isLoading}
                  className="scale-75 data-[state=checked]:bg-blue-500"
                />
                <label 
                  htmlFor="reasoning" 
                  className={`flex items-center gap-1 text-xs cursor-pointer ${
                    chatMode === 'general' ? 'text-slate-600' : 'text-zinc-400'
                  }`}
                >
                  <Brain className="h-3 w-3" />
                  <span className="hidden sm:inline">Pensar</span>
                </label>
              </div>
            )}
          </div>
          
          {/* Keyboard hints */}
          <p className={`text-[10px] hidden sm:block ${
            chatMode === 'general' ? 'text-slate-400' : 'text-zinc-600'
          }`}>
            <kbd className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
              chatMode === 'general' ? 'bg-slate-100' : 'bg-zinc-800'
            }`}>Enter</kbd>
            <span className="mx-1">enviar</span>
            <kbd className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
              chatMode === 'general' ? 'bg-slate-100' : 'bg-zinc-800'
            }`}>Shift+Enter</kbd>
            <span className="ml-1">nueva línea</span>
          </p>
        </div>
      </form>
      
      {/* Disclaimer */}
      <p className={`text-[10px] text-center mt-3 max-w-3xl mx-auto ${
        chatMode === 'general' ? 'text-slate-400' : 'text-zinc-600'
      }`}>
        La IA puede cometer errores. Verifica la información importante.
      </p>
    </div>
  );
}
