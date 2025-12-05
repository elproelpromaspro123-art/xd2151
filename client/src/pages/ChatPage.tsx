import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ThinkingIndicator } from "@/components/chat/ThinkingIndicator";
import { EmptyState } from "@/components/chat/EmptyState";
import { UpgradeModal } from "@/components/chat/UpgradeModal";
import { ProfileModal } from "@/components/ProfileModal";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { RateLimitAlert } from "@/components/RateLimitAlert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRateLimitStream } from "@/hooks/useRateLimitStream";
import {
    Sparkles, Zap, Crown, LogOut, User as UserIcon,
    Gamepad2, MessageCircle, StopCircle, PanelLeftClose, PanelLeft, Globe
} from "lucide-react";
import type { Conversation, Message, AIModel, ChatMode } from "@shared/schema";
import type { User } from "@/lib/auth";
import { getToken } from "@/lib/auth";
import { ArtifactPanel } from "@/components/chat/ArtifactPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ArtifactState {
    isOpen: boolean;
    content: string;
    language: string;
    title?: string;
}

interface UsageInfo {
    aiUsageCount: number;
    webSearchCount: number;
    conversationCount: number;
    limits: {
        aiUsagePerWeek: number;
        webSearchPerWeek: number;
        maxChats: number;
    };
    messageLimits?: {
        roblox: number;
        general: number;
    };
    robloxMessageCount?: number;
    generalMessageCount?: number;
    weekStartDate: string;
    isPremium: boolean;
    isLoggedIn?: boolean;
}

interface ModelsResponse {
    models: AIModel[];
    isPremium: boolean;
}

interface StreamProgress {
    tokensGenerated: number;
    estimatedSecondsRemaining: number;
}

interface ThemeSettings {
    robloxDark: boolean;
    generalDark: boolean;
}

function getThemeSettings(): ThemeSettings {
    if (typeof window === "undefined") return { robloxDark: true, generalDark: false };
    const stored = localStorage.getItem("themeSettings");
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch { }
    }
    return { robloxDark: true, generalDark: false };
}

interface ChatPageProps {
    user?: User | null;
    onLogout?: () => void;
}

export default function ChatPage({ user, onLogout }: ChatPageProps) {
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [streamingMessage, setStreamingMessage] = useState<string>("");
    const [streamingReasoning, setStreamingReasoning] = useState<string>("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedModel, setSelectedModel] = useState<string>("gemini-2.5-flash");
    const [useReasoning, setUseReasoning] = useState(false);
    const [streamProgress, setStreamProgress] = useState<StreamProgress | null>(null);
    const [currentModelName, setCurrentModelName] = useState<string>("");
    const [chatMode, setChatMode] = useState<ChatMode>("roblox");
    const [artifactState, setArtifactState] = useState<ArtifactState>({ isOpen: false, content: "", language: "text" });
    const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
    const [webSearchActive, setWebSearchActive] = useState(false);
    const [isModelRateLimited, setIsModelRateLimited] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [showAnnouncement, setShowAnnouncement] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const seen = localStorage.getItem("announcementShown_gemini25_v1");
            if (!seen) {
                setShowAnnouncement(true);
            }
        }
    }, []);

    // Suscribirse a actualizaciones de rate limit en tiempo real
    const { limitInfo } = useRateLimitStream({
        modelKey: selectedModel,
        onUpdate: (info) => {
            if (!Array.isArray(info)) {
                setIsModelRateLimited(!info.available);
            }
        }
    });

    // Apply theme based on mode and tone
    useEffect(() => {
        const settings = getThemeSettings();
        const shouldBeDark = chatMode === 'roblox' ? settings.robloxDark : settings.generalDark;
        const root = document.documentElement;

        // Remove all theme classes
        root.classList.remove("dark", "light", "roblox-dark", "roblox-light", "general-dark", "general-light");

        // Add the appropriate theme class
        if (chatMode === 'roblox') {
            if (shouldBeDark) {
                root.classList.add("roblox-dark");
                root.style.colorScheme = "dark";
            } else {
                root.classList.add("roblox-light");
                root.style.colorScheme = "light";
            }
        } else {
            if (shouldBeDark) {
                root.classList.add("general-dark");
                root.style.colorScheme = "dark";
            } else {
                root.classList.add("general-light");
                root.style.colorScheme = "light";
            }
        }

        // Force repaint to ensure theme changes apply immediately
        void root.offsetHeight;
    }, [chatMode]);

    // Listen for theme settings changes
    useEffect(() => {
        const handleThemeChange = () => {
            const settings = getThemeSettings();
            const shouldBeDark = chatMode === 'roblox' ? settings.robloxDark : settings.generalDark;
            const root = document.documentElement;

            // Remove all theme classes
            root.classList.remove("dark", "light", "roblox-dark", "roblox-light", "general-dark", "general-light");

            // Add the appropriate theme class
            if (chatMode === 'roblox') {
                if (shouldBeDark) {
                    root.classList.add("roblox-dark");
                    root.style.colorScheme = "dark";
                } else {
                    root.classList.add("roblox-light");
                    root.style.colorScheme = "light";
                }
            } else {
                if (shouldBeDark) {
                    root.classList.add("general-dark");
                    root.style.colorScheme = "dark";
                } else {
                    root.classList.add("general-light");
                    root.style.colorScheme = "light";
                }
            }

            // Force repaint
            void root.offsetHeight;
        };

        window.addEventListener('themeSettingsChange', handleThemeChange);
        return () => window.removeEventListener('themeSettingsChange', handleThemeChange);
    }, [chatMode]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [streamingMessage, scrollToBottom]);

    const extractLatestCodeBlock = (text: string) => {
        const codeBlockRegex = /```(\w*)\n([\s\S]*?)(```|$)/g;
        let match;
        let lastMatch = null;
        while ((match = codeBlockRegex.exec(text)) !== null) {
            lastMatch = match;
        }
        if (lastMatch) {
            return {
                language: lastMatch[1] || 'text',
                code: lastMatch[2],
                isComplete: !!lastMatch[3]
            };
        }
        return null;
    };

    const { data: usage } = useQuery<UsageInfo>({
        queryKey: ["/api/usage"],
        refetchInterval: 30000,
        retry: 3,
        throwOnError: false,
    });

    const { data: modelsData } = useQuery<ModelsResponse>({
        queryKey: ["/api/models"],
        retry: 3,
        throwOnError: false,
    });

    const { data: conversations = [] } = useQuery<Conversation[]>({
        queryKey: ["/api/conversations"],
        retry: 3,
        throwOnError: false,
    });

    const { data: messages = [] } = useQuery<Message[]>({
        queryKey: ["/api/conversations", currentConversationId, "messages"],
        enabled: !!currentConversationId,
        retry: 3,
        throwOnError: false,
    });

    const deleteConversationMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("DELETE", `/api/conversations/${id}`);
        },
        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
            queryClient.invalidateQueries({ queryKey: ["/api/usage"] });
            if (currentConversationId === deletedId) {
                setCurrentConversationId(null);
            }
        },
    });

    const deleteAllConversationsMutation = useMutation({
        mutationFn: async () => {
            await apiRequest("DELETE", "/api/conversations");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
            queryClient.invalidateQueries({ queryKey: ["/api/usage"] });
            setCurrentConversationId(null);
        },
    });

    const handleStopGeneration = async () => {
        if (!currentRequestId) return;

        try {
            const token = getToken();
            const headers: Record<string, string> = { "Content-Type": "application/json" };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            await fetch("/api/chat/stop", {
                method: "POST",
                headers,
                body: JSON.stringify({ requestId: currentRequestId }),
            });

            setIsStreaming(false);
            setStreamingMessage("");
            setStreamingReasoning("");
            setCurrentRequestId(null);
            toast({
                title: "Generación detenida",
                description: "Se ha cancelado la generación.",
            });
        } catch (error) {
            console.error("Error stopping generation:", error);
        }
    };

    const handleSendMessage = async (content: string, useWebSearch = false, imageBase64?: string) => {
        let conversationId = currentConversationId;

        let contentToSave = content;
        if (imageBase64) {
            contentToSave = JSON.stringify([
                { type: "text", text: content },
                { type: "image_url", image_url: { url: imageBase64 } }
            ]);
        }

        const tempUserMessage: Message = {
            id: `temp-${Date.now()}`,
            conversationId: conversationId || "pending",
            role: "user",
            content: contentToSave,
            createdAt: new Date().toISOString(),
        };

        if (conversationId) {
            queryClient.setQueryData<Message[]>(
                ["/api/conversations", conversationId, "messages"],
                (old = []) => [...old, tempUserMessage]
            );
        }

        setIsStreaming(true);
        setStreamingMessage("");
        setStreamingReasoning("");
        setStreamProgress(null);
        setCurrentModelName("");
        setWebSearchActive(useWebSearch);

        try {
            const token = getToken();
            const headers: Record<string, string> = { "Content-Type": "application/json" };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch("/api/chat", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    conversationId,
                    message: content,
                    useWebSearch,
                    model: selectedModel,
                    useReasoning,
                    imageBase64: imageBase64 ?? undefined,
                    chatMode
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                let msg = "No se pudo enviar el mensaje.";
                try {
                    const data = JSON.parse(errText);
                    if (data?.error) msg = data.error;
                } catch { }
                toast({ title: "Error", description: msg, variant: "destructive" });
                setIsStreaming(false);
                setStreamingMessage("");
                setStreamingReasoning("");
                setStreamProgress(null);
                return;
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No reader available");

            const decoder = new TextDecoder();
            let fullMessage = "";
            let fullReasoning = "";
            let hasError = false;
            let lastError = "";
            let retryCount = 0;
            const maxRetries = 3;

            while (true) {
                try {
                    const { done, value } = await reader.read();
                    if (done) break;

                    retryCount = 0; // Reset on successful read
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split("\n");

                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            const data = line.slice(6).trim();
                            if (data === "[DONE]") continue;
                            if (!data) continue;

                            try {
                                const parsed = JSON.parse(data);

                                if (parsed.conversationId && !conversationId) {
                                    conversationId = parsed.conversationId;
                                    setCurrentConversationId(conversationId);
                                    queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
                                }

                                if (parsed.requestId) {
                                    setCurrentRequestId(parsed.requestId);
                                }

                                if (parsed.webSearchUsed) {
                                    setWebSearchActive(true);
                                }

                                if (parsed.cancelled) {
                                    setIsStreaming(false);
                                    return;
                                }

                                if (parsed.progress) {
                                    setStreamProgress(parsed.progress);
                                }

                                if (parsed.reasoning) {
                                    fullReasoning += parsed.reasoning;
                                    setStreamingReasoning(fullReasoning);
                                }

                                if (parsed.content) {
                                    fullMessage += parsed.content;
                                    setStreamingMessage(fullMessage);

                                    const codeBlock = extractLatestCodeBlock(fullMessage);
                                    if (codeBlock && codeBlock.code.length > 50) {
                                        setArtifactState({
                                            isOpen: true,
                                            content: codeBlock.code,
                                            language: codeBlock.language,
                                            title: "Generando código..."
                                        });
                                    }
                                }

                                if (parsed.error) {
                                    hasError = true;
                                    lastError = parsed.error;
                                    toast({
                                        title: parsed.code === "MESSAGE_LIMIT_REACHED" || parsed.code === "PREMIUM_REQUIRED"
                                            ? "Límite alcanzado"
                                            : "Error",
                                        description: parsed.error,
                                        variant: "destructive",
                                    });
                                }
                            } catch (parseErr) {
                                console.debug("Parse error (non-critical):", parseErr);
                            }
                        }
                    }
                } catch (readErr: any) {
                    if (readErr?.name === 'AbortError') {
                        setIsStreaming(false);
                        return;
                    }
                    
                    if (retryCount < maxRetries) {
                        retryCount++;
                        console.warn(`Read error, retry ${retryCount}/${maxRetries}:`, readErr);
                        await new Promise(r => setTimeout(r, 1000 * retryCount));
                        continue;
                    } else {
                        throw readErr;
                    }
                }
            }

            if (conversationId) {
                queryClient.invalidateQueries({
                    queryKey: ["/api/conversations", conversationId, "messages"],
                });
            }
            queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
            queryClient.invalidateQueries({ queryKey: ["/api/usage"] });
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo enviar el mensaje.",
                variant: "destructive",
            });
        } finally {
            setIsStreaming(false);
            setStreamingMessage("");
            setStreamingReasoning("");
            setStreamProgress(null);
            setCurrentRequestId(null);
            setWebSearchActive(false);
        }
    };

    const handleRegenerate = async (fromMessageIndex?: number) => {
        if (!currentConversationId) return;

        let lastUserMsg: Message | undefined;

        if (fromMessageIndex !== undefined) {
            // Regenerar desde un mensaje específico del usuario
            lastUserMsg = messages[fromMessageIndex];
        } else {
            // Regenerar el último mensaje del asistente
            lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
        }

        if (!lastUserMsg) return;

        // Si regeneramos desde un mensaje del usuario, eliminar todos los mensajes posteriores
        if (fromMessageIndex !== undefined) {
            const messagesToDelete = messages.slice(fromMessageIndex + 1);
            for (const msg of messagesToDelete) {
                try {
                    const token = getToken();
                    const headers: Record<string, string> = {};
                    if (token) headers["Authorization"] = `Bearer ${token}`;
                    await fetch(`/api/messages/${msg.id}`, { method: "DELETE", headers });
                } catch { }
            }
        } else {
            // Solo eliminar el último mensaje del asistente
            const lastAssistantMessage = messages[messages.length - 1];
            if (lastAssistantMessage?.role === "assistant") {
                try {
                    const token = getToken();
                    const headers: Record<string, string> = {};
                    if (token) headers["Authorization"] = `Bearer ${token}`;
                    await fetch(`/api/messages/${lastAssistantMessage.id}`, { method: "DELETE", headers });
                } catch { }
            }
        }

        queryClient.invalidateQueries({
            queryKey: ["/api/conversations", currentConversationId, "messages"],
        });

        setIsStreaming(true);
        setStreamingMessage("");
        setStreamingReasoning("");
        setStreamProgress(null);

        try {
            const token = getToken();
            const headers: Record<string, string> = { "Content-Type": "application/json" };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            let userContent = lastUserMsg.content;
            try {
                if (typeof lastUserMsg.content === 'string' && lastUserMsg.content.trim().startsWith('[')) {
                    const parsed = JSON.parse(lastUserMsg.content);
                    if (Array.isArray(parsed)) {
                        const textPart = parsed.find((p: any) => p.type === "text");
                        if (textPart) userContent = textPart.text || "";
                    }
                }
            } catch { }

            const response = await fetch("/api/chat/regenerate", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    conversationId: currentConversationId,
                    lastUserMessage: userContent,
                    model: selectedModel,
                    useReasoning,
                    chatMode,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to regenerate");
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No reader available");

            const decoder = new TextDecoder();
            let fullMessage = "";
            let fullReasoning = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6);
                        if (data === "[DONE]") continue;

                        try {
                            const parsed = JSON.parse(data);

                            if (parsed.requestId) {
                                setCurrentRequestId(parsed.requestId);
                            }

                            if (parsed.progress) {
                                setStreamProgress(parsed.progress);
                            }

                            if (parsed.reasoning) {
                                fullReasoning += parsed.reasoning;
                                setStreamingReasoning(fullReasoning);
                            }

                            if (parsed.content) {
                                fullMessage += parsed.content;
                                setStreamingMessage(fullMessage);
                            }

                            if (parsed.error) {
                                toast({
                                    title: "Error",
                                    description: parsed.error,
                                    variant: "destructive",
                                });
                            }
                        } catch (e) {
                        }
                    }
                }
            }

            queryClient.invalidateQueries({
                queryKey: ["/api/conversations", currentConversationId, "messages"],
            });
            queryClient.invalidateQueries({ queryKey: ["/api/usage"] });
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo regenerar la respuesta",
                variant: "destructive",
            });
        } finally {
            setIsStreaming(false);
            setStreamingMessage("");
            setStreamingReasoning("");
            setStreamProgress(null);
            setCurrentRequestId(null);
        }
    };

    const handleEditAndResend = async (messageIndex: number, newContent: string) => {
        if (!currentConversationId) return;

        // Eliminar el mensaje editado y todos los posteriores
        const messagesToDelete = messages.slice(messageIndex);
        for (const msg of messagesToDelete) {
            try {
                const token = getToken();
                const headers: Record<string, string> = {};
                if (token) headers["Authorization"] = `Bearer ${token}`;
                await fetch(`/api/messages/${msg.id}`, { method: "DELETE", headers });
            } catch { }
        }

        queryClient.invalidateQueries({
            queryKey: ["/api/conversations", currentConversationId, "messages"],
        });

        // Enviar el nuevo mensaje
        await handleSendMessage(newContent);
    };

    const handleNewChat = () => {
        setCurrentConversationId(null);
        setSidebarOpen(false);
        setArtifactState({ isOpen: false, content: "", language: "text" });
    };

    const handleSelectConversation = (id: string) => {
        setCurrentConversationId(id);
        setSidebarOpen(false);
        setArtifactState({ isOpen: false, content: "", language: "text" });
    };

    const handleSuggestionClick = (prompt: string) => {
        handleSendMessage(prompt, false);
    };

    const sortedConversations = [...conversations].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const showEmptyState = !currentConversationId && messages.length === 0;
    const isPremium = user?.isPremium || usage?.isPremium || modelsData?.isPremium || false;
    const webSearchRemaining = isPremium ? 999 : Math.max(0, 5 - (usage?.webSearchCount || 0));

    const selectedModelInfo = modelsData?.models.find(m => m.key === selectedModel);

    const modeMessageLimit = isPremium
        ? { roblox: -1, general: -1 }
        : { roblox: 10, general: 10 };
    const messagesUsedRoblox = usage?.robloxMessageCount || 0;
    const messagesUsedGeneral = usage?.generalMessageCount || 0;
    const messageRemaining = chatMode === 'roblox'
        ? (modeMessageLimit.roblox === -1 ? 999 : Math.max(0, modeMessageLimit.roblox - messagesUsedRoblox))
        : (modeMessageLimit.general === -1 ? 999 : Math.max(0, modeMessageLimit.general - messagesUsedGeneral));

    const formatTimeRemaining = (seconds: number): string => {
        if (seconds < 60) return `~${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `~${minutes}m ${secs}s`;
    };

    return (
        <>
        <div className={`flex h-screen w-screen overflow-hidden bg-background`}>
            {/* Sidebar */}
            <ChatSidebar
                conversations={sortedConversations}
                currentConversationId={currentConversationId}
                onNewChat={handleNewChat}
                onSelectConversation={handleSelectConversation}
                onDeleteConversation={(id) => deleteConversationMutation.mutate(id)}
                onDeleteAllConversations={() => deleteAllConversationsMutation.mutate()}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                chatMode={chatMode}
                isCollapsed={sidebarCollapsed}
                onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main Content */}
            <div className="flex flex-1 min-w-0 overflow-hidden w-0">
                <div className={`flex flex-col h-full w-full transition-all duration-300 ease-in-out ${artifactState.isOpen ? 'hidden lg:flex lg:w-1/2' : 'flex w-full'
                    }`}>
                    {/* Header */}
                    <header className={`flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 border-b border-border/30 bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-2xl gap-3 sm:gap-4 lg:gap-0 shadow-lg relative overflow-hidden`}>
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-[0.02]">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-radial from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto relative z-10 overflow-x-auto">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className={`hidden lg:flex h-7 w-7 sm:h-8 sm:w-8 text-foreground/70 hover:text-foreground flex-shrink-0`}
                            >
                                {sidebarCollapsed ? <PanelLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <PanelLeftClose className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                            </Button>

                            {/* Mode indicator */}
                            <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-[10px] sm:text-[11px] lg:text-xs font-semibold whitespace-nowrap shadow-md flex-shrink-0 ${
                                chatMode === 'general'
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                    : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                            }`}>
                                {chatMode === 'general' ? <MessageCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" /> : <Gamepad2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />}
                                <span className="hidden xs:inline">{chatMode === 'general' ? 'Modo General' : 'Modo Roblox'}</span>
                                <span className="xs:hidden">{chatMode === 'general' ? 'General' : 'Roblox'}</span>
                            </div>

                            {/* AI Provider badge */}
                            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-[9px] sm:text-[10px] lg:text-xs font-semibold whitespace-nowrap bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-pink-500/15 border-2 border-blue-400/30 text-blue-600 dark:text-blue-300 shadow-md backdrop-blur-sm flex-shrink-0">
                                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 text-blue-500" />
                                <span className="hidden sm:inline">Powered by Gemini AI</span>
                                <span className="sm:hidden">Gemini</span>
                            </div>

                            {/* Model indicator */}
                            {selectedModel === 'gemini-2.5-pro' || selectedModel === 'gemini-2.5-flash' ? (
                                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-[10px] sm:text-[11px] lg:text-xs font-semibold whitespace-nowrap bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border-2 border-amber-400/30 text-amber-600 dark:text-amber-300 shadow-md backdrop-blur-sm flex-shrink-0">
                                    <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 text-amber-500" />
                                    <span className="hidden sm:inline">{selectedModel === 'gemini-2.5-pro' ? 'Gemini 2.5 Pro' : 'Gemini 2.5 Flash'}</span>
                                    <span className="sm:hidden">{selectedModel === 'gemini-2.5-pro' ? 'Pro' : 'Flash'}</span>
                                </div>
                            ) : null}

                            {/* Usage indicators */}
                            <div className="hidden sm:flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-border/30 backdrop-blur-sm flex-shrink-0">
                                <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] lg:text-xs font-medium">
                                    <Zap className={`h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 flex-shrink-0 ${messageRemaining === 999 ? 'text-amber-500' : messageRemaining > 0 ? 'text-green-500' : 'text-red-500'}`} />
                                    <span className={messageRemaining === 999 ? 'text-amber-600' : messageRemaining > 0 ? 'text-green-600' : 'text-red-600'}>
                                        {messageRemaining === 999 ? "∞" : messageRemaining}
                                    </span>
                                    <span className="text-muted-foreground/60 hidden lg:inline">mensajes</span>
                                    <span className="text-muted-foreground/60 lg:hidden">msg</span>
                                </div>
                                <div className="w-px h-2.5 sm:h-3 bg-border/30"></div>
                                <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] lg:text-xs font-medium">
                                    <Globe className={`h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 flex-shrink-0 ${webSearchRemaining === 999 ? 'text-amber-500' : webSearchRemaining > 0 ? 'text-emerald-500' : 'text-gray-400'}`} />
                                    <span className={webSearchRemaining === 999 ? 'text-amber-600' : webSearchRemaining > 0 ? 'text-emerald-600' : 'text-gray-500'}>
                                        {webSearchRemaining === 999 ? "∞" : webSearchRemaining}
                                    </span>
                                    <span className="text-muted-foreground/60">web</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 w-full sm:w-auto justify-end relative z-10 flex-shrink-0">
                            {user && (
                                <ProfileModal user={user} chatMode={chatMode}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1.5 sm:gap-2 h-7 sm:h-8 lg:h-9 px-2 sm:px-3 text-[10px] sm:text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-full transition-all duration-200"
                                    >
                                        <UserIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                                        <span className="hidden sm:inline max-w-[60px] sm:max-w-[80px] truncate">{user.email}</span>
                                    </Button>
                                </ProfileModal>
                            )}

                            {isPremium && (
                                <div className="hidden sm:flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-400/30 shadow-sm">
                                    <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-500" />
                                    <span>Premium</span>
                                </div>
                            )}

                            <UpgradeModal usage={usage || null} chatMode={chatMode}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`gap-1.5 sm:gap-2 h-7 sm:h-8 lg:h-9 px-2 sm:px-3 text-[10px] sm:text-xs font-semibold rounded-full border-2 transition-all duration-200 ${
                                        isPremium
                                            ? 'border-amber-400/50 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400'
                                            : 'border-primary/60 text-primary hover:bg-primary/10 hover:border-primary'
                                    }`}
                                >
                                    <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                                    <span className="hidden sm:inline">{isPremium ? "Premium" : "Mejorar"}</span>
                                </Button>
                            </UpgradeModal>

                            {onLogout && (
                                <LogoutConfirmDialog onConfirm={onLogout}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 text-foreground/70 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-200 flex-shrink-0"
                                    >
                                        <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-4.5 lg:w-4.5" />
                                    </Button>
                                </LogoutConfirmDialog>
                            )}
                        </div>
                    </header>

                    {/* Progress Bar when streaming */}
                    {isStreaming && streamProgress && (
                        <div className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border-b bg-gradient-to-r from-primary/5 to-secondary/5 border-border/50 backdrop-blur-sm`}>
                            <div className="flex items-center justify-between max-w-4xl mx-auto">
                                <div className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-primary`}>
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current animate-pulse" />
                                    <span>{streamProgress.tokensGenerated} tokens</span>
                                    <span className={`text-muted-foreground hidden sm:inline`}>•</span>
                                    <span>{formatTimeRemaining(streamProgress.estimatedSecondsRemaining)}</span>
                                    {webSearchActive && (
                                        <>
                                            <span className={`text-muted-foreground hidden sm:inline`}>•</span>
                                            <Globe className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-500" />
                                            <span className="text-emerald-500 hidden sm:inline">Web</span>
                                        </>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleStopGeneration}
                                    className={`h-6 sm:h-7 gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 px-2 sm:px-3`}
                                >
                                    <StopCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    <span className="hidden xs:inline">Detener</span>
                                    <span className="xs:inline">Stop</span>
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Messages Area */}
                    <div className="flex-1 overflow-hidden">
                        {showEmptyState ? (
                            <EmptyState onSuggestionClick={handleSuggestionClick} chatMode={chatMode} />
                        ) : (
                            <ScrollArea className="h-full">
                                <div className="w-full max-w-4xl mx-auto py-3 sm:py-4 lg:py-8 px-2 sm:px-3 lg:px-6">
                                    {messages.map((message, index) => (
                                        <MessageBubble
                                            key={message.id}
                                            message={message}
                                            chatMode={chatMode}
                                            onOpenArtifact={(content, language) => setArtifactState({
                                                isOpen: true,
                                                content,
                                                language,
                                                title: "Código"
                                            })}
                                            onRegenerate={!isStreaming ? () => handleRegenerate(
                                                message.role === "user" ? index : undefined
                                            ) : undefined}
                                            onEditAndResend={
                                                message.role === "user" && !isStreaming
                                                    ? (newContent) => handleEditAndResend(index, newContent)
                                                    : undefined
                                            }
                                        />
                                    ))}

                                    {isStreaming && useReasoning && streamingReasoning && (
                                        <ThinkingIndicator
                                            reasoning={streamingReasoning}
                                            modelName={currentModelName || selectedModelInfo?.name}
                                            chatMode={chatMode}
                                            isStreaming={isStreaming}
                                        />
                                    )}

                                    {isStreaming && streamingMessage && (
                                        <MessageBubble
                                            message={{
                                                id: "streaming",
                                                conversationId: currentConversationId || "",
                                                role: "assistant",
                                                content: streamingMessage,
                                                createdAt: new Date().toISOString(),
                                            }}
                                            chatMode={chatMode}
                                            isStreaming={true}
                                            onOpenArtifact={(content, language) => setArtifactState({
                                                isOpen: true,
                                                content,
                                                language,
                                                title: "Generando..."
                                            })}
                                        />
                                    )}

                                    {isStreaming && !streamingMessage && !streamingReasoning && (
                                        <TypingIndicator chatMode={chatMode} />
                                    )}

                                    <div ref={messagesEndRef} className="h-3 sm:h-4" />
                                </div>
                            </ScrollArea>
                        )}
                    </div>

                    {/* Rate Limit Alert */}
                    {isModelRateLimited && selectedModelInfo && (
                        <div className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-b border-border/50 bg-gradient-to-r from-destructive/5 to-orange/5 backdrop-blur-sm">
                            <div className="max-w-4xl mx-auto">
                                <RateLimitAlert
                                    modelKey={selectedModel}
                                    modelName={selectedModelInfo.name}
                                    onAvailable={() => setIsModelRateLimited(false)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className={`border-t border-border/50 bg-background/80 backdrop-blur-xl shadow-lg`}>
                        <ChatInput
                            onSend={handleSendMessage}
                            isLoading={isStreaming}
                            disabled={messageRemaining <= 0 || isModelRateLimited}
                            webSearchRemaining={webSearchRemaining}
                            models={modelsData?.models || []}
                            selectedModel={selectedModel}
                            onModelChange={setSelectedModel}
                            useReasoning={useReasoning}
                            onReasoningChange={setUseReasoning}
                            isPremium={isPremium}
                            chatMode={chatMode}
                            onChatModeChange={setChatMode}
                            onStopGeneration={isStreaming ? handleStopGeneration : undefined}
                            userId={user?.id}
                        />
                    </div>
                </div>

                {/* Artifact Panel */}
                {artifactState.isOpen && (
                    <div className={`w-full lg:w-1/2 h-full border-l border-border bg-background`}>
                        <ArtifactPanel
                            content={artifactState.content}
                            language={artifactState.language}
                            title={artifactState.title}
                            onClose={() => setArtifactState(prev => ({ ...prev, isOpen: false }))}
                        />
                    </div>
                )}
            </div>
        </div>

        {/* Announcement Modal */}
        <Dialog
            open={showAnnouncement}
            onOpenChange={(open) => {
                setShowAnnouncement(open);
                if (!open && typeof window !== "undefined") {
                    localStorage.setItem("announcementShown_gemini25_v1", "1");
                }
            }}
        >
            <DialogContent className="sm:max-w-[500px] bg-background border-border shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        🚀 ¡Nuevos Modelos Disponibles!
                        <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-300 rounded text-[10px] font-semibold">Actualización</span>
                    </DialogTitle>
                    <DialogDescription className="text-sm text-foreground/80">
                        Descubre los modelos de IA más avanzados para potenciar tu creatividad y productividad.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-blue-500/30 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-foreground">⭐ Gemini 2.5 Pro</p>
                                <p className="text-xs text-muted-foreground">Multimodal avanzado con reasoning, 1M contexto, visión y ejecución de código</p>
                            </div>
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded text-[10px] font-medium">Premium</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-lg border border-blue-500/30 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-foreground">✨ Gemini 2.5 Flash</p>
                                <p className="text-xs text-muted-foreground">Ultra-rápido, excelente en código, con capacidades de reasoning avanzado</p>
                            </div>
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-600 dark:text-green-400 rounded text-[10px] font-medium">Free</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border">
                        <div className="text-center">
                            <p className="text-sm font-semibold text-foreground mb-3">Planes Disponibles</p>
                            <div className="flex justify-center gap-3 text-xs">
                                <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-md font-medium border border-green-200 dark:border-green-800">Free: 10 mensajes/día</span>
                                <span className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-md font-medium border border-amber-200 dark:border-amber-800">Premium: Próximamente</span>
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => setShowAnnouncement(false)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">¡Empezar Ahora!</Button>
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
}
