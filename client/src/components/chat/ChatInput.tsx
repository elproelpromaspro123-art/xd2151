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
import { useModelAvailability } from "@/hooks/useModelAvailability";

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
    userId?: string;
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
    onStopGeneration,
    userId
}: ChatInputProps) {
    const [message, setMessage] = useState("");
    const [robloxScriptMode, setRobloxScriptMode] = useState<'screen' | 'localscript'>(() => {
        if (typeof window === 'undefined') return 'localscript';
        const key = userId ? `robloxScriptMode_${userId}` : 'robloxScriptMode';
        const saved = localStorage.getItem(key);
        return saved === 'screen' || saved === 'localscript' ? (saved as 'screen' | 'localscript') : 'localscript';
    });
    const [robloxLines, setRobloxLines] = useState<500 | 1000 | 1500 | 2000>(() => {
        if (typeof window === 'undefined') return 500;
        const key = userId ? `robloxLines_${userId}` : 'robloxLines';
        const saved = Number(localStorage.getItem(key));
        return saved === 1000 || saved === 1500 || saved === 2000 ? (saved as 1000 | 1500 | 2000) : 500;
    });
    const [useWebSearch, setUseWebSearch] = useState(false);
    const [pastedChips, setPastedChips] = useState<PastedChip[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Real-time model availability updates
    const livesModels = useModelAvailability(models);

    const selectedModelInfo = livesModels.find(m => m.key === selectedModel);
    const modelSupportsImages = selectedModelInfo?.supportsImages === true;
    const modelSupportsReasoning = selectedModelInfo?.supportsReasoning === true;
    const modelAvailable = selectedModelInfo?.available !== false;
    const showImageButton = modelSupportsImages;
    const showReasoningToggle = modelSupportsReasoning;

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
        let fullMessage = chipContents ? `${chipContents}\n\n${message.trim()}` : message.trim();
        if (chatMode === 'roblox') {
            const configLine = robloxScriptMode === 'screen' ? 'CONFIG_ROBLOX_OUTPUT=screen' : 'CONFIG_ROBLOX_OUTPUT=localscript';
            const linesConfig = `CONFIG_ROBLOX_LINES=${robloxLines}`;
            fullMessage = `${configLine}\n${linesConfig}\n${fullMessage}`;
        }

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
        <div className="p-3 sm:p-6 w-full bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                {/* Main input container */}
                <div className={`relative rounded-2xl sm:rounded-3xl transition-all duration-300 ${isFocused
                        ? chatMode === 'general'
                            ? 'ring-2 ring-blue-500/40 shadow-2xl shadow-blue-500/10 border-blue-200/50'
                            : 'ring-2 ring-primary/40 shadow-2xl shadow-primary/10 border-primary/30'
                        : 'shadow-xl border'
                    } ${chatMode === 'general'
                        ? 'bg-white/95 border-slate-200/60'
                        : 'bg-zinc-900/95 border-zinc-700/60'
                    } backdrop-blur-xl`}>

                    {/* Pasted chips */}
                    {pastedChips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 p-2 sm:p-3 pb-0">
                            {pastedChips.map(chip => (
                                <div
                                    key={chip.id}
                                    className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs group ${chatMode === 'general'
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200/50'
                                            : 'bg-primary/10 text-primary border border-primary/20'
                                        }`}
                                >
                                    <span className="truncate max-w-[100px] sm:max-w-[150px]">{chip.preview}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeChip(chip.id)}
                                        className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
                                    >
                                        <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Image preview */}
                    {imagePreview && (
                        <div className="p-2 sm:p-3 pb-0">
                            <div className="relative inline-block group">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className={`h-12 sm:h-16 w-auto rounded-lg sm:rounded-xl object-cover border-2 ${chatMode === 'general' ? 'border-slate-200' : 'border-zinc-700'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-1.5 -right-1.5 p-0.5 sm:p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
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
                            ? "¿En qué puedo ayudarte?"
                            : "Describe tu UI..."}
                        disabled={isLoading || disabled}
                        rows={1}
                        className={`w-full resize-none px-3 sm:px-4 py-2.5 sm:py-3.5 pr-16 sm:pr-24 text-sm focus:outline-none disabled:opacity-50 min-h-[44px] sm:min-h-[52px] max-h-[200px] transition-colors ${
                            chatMode === 'general'
                                ? 'bg-transparent text-slate-900 placeholder:text-slate-500'
                                : 'bg-transparent text-white placeholder:text-zinc-400'
                        }`}
                    />

                    {/* Action buttons */}
                    <div className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 flex items-center gap-0.5 sm:gap-1">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                        {showImageButton && (
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg ${chatMode === 'general'
                                        ? 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                                        : 'text-zinc-500 hover:text-primary hover:bg-primary/10'
                                    }`}
                            >
                                <Image className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                        )}

                        {isLoading && onStopGeneration ? (
                            <Button
                                type="button"
                                size="icon"
                                onClick={onStopGeneration}
                                className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-red-500 hover:bg-red-600 text-white"
                            >
                                <StopCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!hasContent || isLoading || disabled}
                                className={`h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl transition-all ${hasContent
                                        ? chatMode === 'general'
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                                            : 'bg-primary hover:bg-primary/90 shadow-md'
                                        : chatMode === 'general'
                                            ? 'bg-slate-100 text-slate-400'
                                            : 'bg-zinc-700 text-zinc-500'
                                    }`}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                ) : (
                                    <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Controls bar */}
                <div className="flex flex-wrap items-center justify-between mt-3 sm:mt-4 px-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {/* Model selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-7 sm:h-8 gap-1 sm:gap-1.5 text-[11px] sm:text-xs rounded-lg px-1.5 sm:px-2 ${chatMode === 'general'
                                            ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                        }`}
                                    disabled={isLoading}
                                >
                                    <Sparkles className="h-3 w-3 flex-shrink-0" />
                                    <span className="max-w-[80px] sm:max-w-[100px] truncate hidden xs:inline">{selectedModelInfo?.name || "Modelo"}</span>
                                    <ChevronDown className="h-3 w-3 opacity-50 flex-shrink-0" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-80">
                                {freeModels.length > 0 && (
                                    <>
                                        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                            Free
                                        </div>
                                        {freeModels.map(model => {
                                            const formattedTime = model.remainingTime 
                                                ? (() => {
                                                    const totalSeconds = Math.ceil(model.remainingTime / 1000);
                                                    const minutes = Math.floor(totalSeconds / 60);
                                                    const seconds = totalSeconds % 60;
                                                    if (minutes === 0) return `${seconds}s`;
                                                    if (minutes < 60) return `${minutes}m ${seconds}s`;
                                                    const hours = Math.floor(minutes / 60);
                                                    const remainingMinutes = minutes % 60;
                                                    return `${hours}h ${remainingMinutes}m`;
                                                })()
                                                : '';
                                            
                                            const isGeminiPro = model.key === "gemini-2.5-pro";
                                            const isGeminiFlash = model.key === "gemini-2.5-flash";
                                            const isGeminiFlash2 = model.key === "gemini-flash-2";
                                            const isFlash2Blocked = isGeminiFlash2 && chatMode !== "general";

                                            return (
                                            <DropdownMenuItem
                                                key={model.key}
                                                onClick={() => {
                                                    if (model.available && !isFlash2Blocked) {
                                                        onModelChange(model.key);
                                                        if (!model.supportsReasoning) {
                                                            onReasoningChange(false);
                                                        }
                                                    }
                                                }}
                                                className={`flex flex-col items-start gap-0.5 py-2 relative ${!model.available || isFlash2Blocked ? 'opacity-50' : ''} ${(isGeminiPro || isGeminiFlash || isGeminiFlash2) ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-md border border-blue-400/20 hover:border-blue-400/40 transition-all' : ''}`}
                                                disabled={!model.available || isFlash2Blocked}
                                            >
                                                <div className="flex items-center gap-2 w-full">
                                                    <span className={`font-medium text-sm flex-1 ${(isGeminiPro || isGeminiFlash || isGeminiFlash2) ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent' : ''}`}>{model.name}</span>
                                                    <div className="ml-auto flex items-center gap-1.5 flex-wrap justify-end">
                                                        {isGeminiPro && (
                                                            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-300 rounded text-[8px] font-semibold whitespace-nowrap">
                                                                🏆 Mejor para programar
                                                            </span>
                                                        )}
                                                        {isGeminiFlash && (
                                                            <span className="px-2 py-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-300 rounded text-[8px] font-semibold whitespace-nowrap">
                                                                💚 Mejor para plan free
                                                            </span>
                                                        )}
                                                        {isGeminiFlash2 && isFlash2Blocked && (
                                                            <span className="px-2 py-0.5 bg-red-500/15 text-red-700 dark:text-red-400 rounded text-[8px] font-semibold whitespace-nowrap">
                                                                🔒 Solo modo general
                                                            </span>
                                                        )}
                                                        {model.isRateLimited && (
                                                            <span className="px-2 py-0.5 bg-red-500/15 text-red-700 dark:text-red-400 rounded text-[8px] font-semibold whitespace-nowrap">
                                                                No disponible ({formattedTime})
                                                            </span>
                                                        )}
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
                                            );
                                            })}
                                    </>
                                )}

                                {premiumModels.length > 0 && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <div className="px-2 py-1.5 text-[10px] font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                                            <Sparkles className="h-3 w-3" /> Premium
                                        </div>
                                        {premiumModels.map(model => {
                                            const formattedTime = model.remainingTime 
                                                ? (() => {
                                                    const totalSeconds = Math.ceil(model.remainingTime / 1000);
                                                    const minutes = Math.floor(totalSeconds / 60);
                                                    const seconds = totalSeconds % 60;
                                                    if (minutes === 0) return `${seconds}s`;
                                                    if (minutes < 60) return `${minutes}m ${seconds}s`;
                                                    const hours = Math.floor(minutes / 60);
                                                    const remainingMinutes = minutes % 60;
                                                    return `${hours}h ${remainingMinutes}m`;
                                                })()
                                                : '';
                                            
                                            const isGeminiPro = model.key === "gemini-2.5-pro";
                                            return (
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
                                                className={`flex flex-col items-start gap-0.5 py-2 relative ${!model.available ? 'opacity-50' : ''} ${isGeminiPro ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-md border border-amber-400/20 hover:border-amber-400/40 transition-all' : ''}`}
                                                disabled={!model.available}
                                            >
                                                <div className="flex items-center gap-2 w-full">
                                                    <span className={`font-medium text-sm flex-1 ${isGeminiPro ? 'bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent' : ''}`}>{model.name}</span>
                                                    <div className="ml-auto flex items-center gap-1.5 flex-wrap justify-end">
                                                        {isGeminiPro && (
                                                            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-300 rounded text-[8px] font-semibold whitespace-nowrap">
                                                                🏆 Mejor actualmente
                                                            </span>
                                                        )}
                                                        {model.isRateLimited && (
                                                            <span className="px-2 py-0.5 bg-red-500/15 text-red-700 dark:text-red-400 rounded text-[8px] font-semibold whitespace-nowrap">
                                                                No disponible ({formattedTime})
                                                            </span>
                                                        )}
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
                                            );
                                            })}
                                            </>
                                            )}
                                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mode toggle */}
                        <div className={`flex items-center rounded-xl p-1 border ${chatMode === 'general'
                                ? 'bg-blue-50 border-blue-200 shadow-sm'
                                : 'bg-zinc-800/50 border-zinc-700 shadow-lg'
                            } transition-all duration-200`}>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => onChatModeChange("roblox")}
                                disabled={isLoading}
                                className={`h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-xs gap-1 sm:gap-1.5 rounded-lg font-medium transition-all ${chatMode === "roblox"
                                        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                                        : "text-zinc-400 hover:text-violet-400 hover:bg-violet-500/10"
                                    }`}
                            >
                                <Gamepad2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="hidden xs:inline">Roblox</span>
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => onChatModeChange("general")}
                                disabled={isLoading}
                                className={`h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-xs gap-1 sm:gap-1.5 rounded-lg font-medium transition-all ${chatMode === "general"
                                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg"
                                        : "text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10"
                                    }`}
                            >
                                <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="hidden xs:inline">General</span>
                            </Button>
                        </div>

                        {chatMode === 'roblox' && (
                            <div className="flex items-center gap-3">
                                {/* Lines selector */}
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                                    <span className="text-[10px] sm:text-xs text-zinc-300 font-medium">Líneas:</span>
                                    <div className="flex gap-1">
                                        {([500, 1000, 1500, 2000] as const).map((n) => {
                                            const premiumRequired = n >= 1500;
                                            const disabled = isLoading || (!isPremium && premiumRequired);
                                            const isSelected = robloxLines === n;
                                            return (
                                                <Button
                                                    key={n}
                                                    type="button"
                                                    size="sm"
                                                    variant={isSelected ? 'default' : 'ghost'}
                                                    onClick={() => {
                                                        if (disabled) return;
                                                        setRobloxLines(n);
                                                        if (typeof window !== 'undefined') {
                                                            const key = userId ? `robloxLines_${userId}` : 'robloxLines';
                                                            localStorage.setItem(key, String(n));
                                                        }
                                                    }}
                                                    disabled={disabled}
                                                    className={`h-6 sm:h-7 px-2 sm:px-2.5 text-[10px] sm:text-xs rounded-lg font-medium transition-all ${isSelected
                                                            ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md'
                                                            : 'text-zinc-400 hover:text-violet-300 hover:bg-violet-500/20'
                                                        } ${premiumRequired && !isPremium ? 'opacity-50' : ''}`}
                                                >
                                                    {n}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    {(() => {
                                        const available = (selectedModelInfo as any)?.maxTokens ?? 0;
                                        const estimated = robloxLines * 20;
                                        const ok = available > 0 ? available >= estimated : true;
                                        return (
                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-medium ${ok
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                }`}>
                                                {ok ? '✓ Compatible' : '⚠ No compatible'}
                                            </span>
                                        );
                                    })()}
                                </div>

                                {/* Script mode selector */}
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                                    <span className="text-[10px] sm:text-xs text-zinc-300 font-medium">Modo:</span>
                                    <div className="flex gap-1">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={robloxScriptMode === 'screen' ? 'default' : 'ghost'}
                                            onClick={() => {
                                                setRobloxScriptMode('screen');
                                                if (typeof window !== 'undefined') {
                                                    const key = userId ? `robloxScriptMode_${userId}` : 'robloxScriptMode';
                                                    localStorage.setItem(key, 'screen');
                                                }
                                            }}
                                            disabled={isLoading}
                                            className={`h-6 sm:h-7 px-2 sm:px-2.5 text-[10px] sm:text-xs gap-1 rounded-lg font-medium transition-all ${robloxScriptMode === 'screen'
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                                    : 'text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/20'
                                                }`}
                                        >
                                            ScreenGui
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={robloxScriptMode === 'localscript' ? 'default' : 'ghost'}
                                            onClick={() => {
                                                setRobloxScriptMode('localscript');
                                                if (typeof window !== 'undefined') {
                                                    const key = userId ? `robloxScriptMode_${userId}` : 'robloxScriptMode';
                                                    localStorage.setItem(key, 'localscript');
                                                }
                                            }}
                                            disabled={isLoading}
                                            className={`h-6 sm:h-7 px-2 sm:px-2.5 text-[10px] sm:text-xs gap-1 rounded-lg font-medium transition-all ${robloxScriptMode === 'localscript'
                                                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                                                    : 'text-zinc-400 hover:text-orange-300 hover:bg-orange-500/20'
                                                }`}
                                        >
                                            LocalScript
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Web search toggle */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${canUseWebSearch
                                ? chatMode === 'general'
                                    ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                    : 'bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-700/50'
                                : chatMode === 'general'
                                    ? 'bg-slate-50/50 border-slate-200/50'
                                    : 'bg-zinc-800/20 border-zinc-700/30'
                            }`}>
                            <Switch
                                id="web-search"
                                checked={useWebSearch}
                                onCheckedChange={setUseWebSearch}
                                disabled={!canUseWebSearch || isLoading}
                                className="scale-75 data-[state=checked]:bg-emerald-500"
                            />
                            <label
                                htmlFor="web-search"
                                className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-medium cursor-pointer ${canUseWebSearch
                                        ? chatMode === 'general' ? 'text-slate-700' : 'text-zinc-300'
                                        : chatMode === 'general' ? 'text-slate-400' : 'text-zinc-500'
                                    }`}
                            >
                                <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
                                <span>Web Search</span>
                                {!canUseWebSearch && (
                                    <span className="text-[9px] text-red-500 font-semibold">({webSearchRemaining})</span>
                                )}
                            </label>
                        </div>

                        {/* Reasoning toggle */}
                        {showReasoningToggle && (
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${chatMode === 'general'
                                    ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                    : 'bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-700/50'
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
                                    className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-medium cursor-pointer ${chatMode === 'general' ? 'text-slate-700' : 'text-zinc-300'
                                        }`}
                                >
                                    <Brain className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500" />
                                    <span>Deep Thinking</span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Keyboard hints */}
                    <p className={`text-[8px] sm:text-[10px] hidden sm:block ${chatMode === 'general' ? 'text-slate-400' : 'text-zinc-600'
                        }`}>
                        <kbd className={`px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono ${chatMode === 'general' ? 'bg-slate-100' : 'bg-zinc-800'
                            }`}>Enter</kbd>
                        <span className="mx-0.5 sm:mx-1">enviar</span>
                        <kbd className={`px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono ${chatMode === 'general' ? 'bg-slate-100' : 'bg-zinc-800'
                            }`}>Shift+Enter</kbd>
                        <span className="ml-0.5 sm:ml-1">salto</span>
                    </p>
                </div>
            </form>

            {/* Disclaimer */}
            <div className="mt-4 sm:mt-6 text-center">
                <p className={`text-[10px] sm:text-xs px-4 py-2 rounded-full inline-block ${chatMode === 'general'
                        ? 'bg-slate-100/80 text-slate-500 border border-slate-200/50'
                        : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50'
                    } backdrop-blur-sm`}>
                    <span className="opacity-75">⚠️</span> La IA puede cometer errores. Verifica el código antes de usarlo en producción.
                </p>
            </div>
        </div>
    );
}
