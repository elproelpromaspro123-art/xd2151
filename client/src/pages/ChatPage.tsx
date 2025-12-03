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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Zap, Crown, Clock, LogOut, User as UserIcon, Settings, Gamepad2, MessageCircle } from "lucide-react";
import type { Conversation, Message, AIModel, ChatMode } from "@shared/schema";
import type { User } from "@/lib/auth";
import { getToken } from "@/lib/auth";

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

interface ChatPageProps {
  user?: User | null;
  onLogout?: () => void;
}

export default function ChatPage({ user, onLogout }: ChatPageProps) {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [streamingReasoning, setStreamingReasoning] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("kat-coder-pro");
  const [useReasoning, setUseReasoning] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [streamProgress, setStreamProgress] = useState<StreamProgress | null>(null);
  const [currentModelName, setCurrentModelName] = useState<string>("");
  const [chatMode, setChatMode] = useState<ChatMode>("roblox");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: usage } = useQuery<UsageInfo>({
    queryKey: ["/api/usage"],
    refetchInterval: 30000,
  });

  const { data: modelsData } = useQuery<ModelsResponse>({
    queryKey: ["/api/models"],
  });

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/conversations", currentConversationId, "messages"],
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

  const handleSendMessage = async (content: string, useWebSearch = false, imageBase64?: string) => {
    let conversationId = currentConversationId;

    if (!conversationId) {
      try {
        const res = await apiRequest("POST", "/api/conversations", { title: content?.slice(0, 50) || "Chat" });
        const created = await res.json();
        conversationId = created.id;
        setCurrentConversationId(conversationId);
      } catch (e) {
        toast({ title: "Error", description: "No se pudo crear la conversación.", variant: "destructive" });
        return;
      }
    }

    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: conversationId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    queryClient.setQueryData<Message[]>(
      ["/api/conversations", conversationId, "messages"],
      (old = []) => [...old, tempUserMessage]
    );

    setIsStreaming(true);
    setStreamingMessage("");
    setStreamingReasoning("");
    setEstimatedTime(null);
    setStreamProgress(null);
    setCurrentModelName("");

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
        } catch {}
        toast({ title: "Error", description: msg, variant: "destructive" });
        setIsStreaming(false);
        setStreamingMessage("");
        setStreamingReasoning("");
        setEstimatedTime(null);
        setStreamProgress(null);
        return;
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
              
              if (parsed.estimatedTime) {
                setEstimatedTime(parsed.estimatedTime);
                setCurrentModelName(parsed.model || "");
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
                  title: parsed.code === "AI_LIMIT_REACHED" || parsed.code === "PREMIUM_REQUIRED" 
                    ? "Límite alcanzado" 
                    : "Error",
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
        queryKey: ["/api/conversations", conversationId, "messages"],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/usage"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsStreaming(false);
      setStreamingMessage("");
      setStreamingReasoning("");
      setEstimatedTime(null);
      setStreamProgress(null);
    }
  };

  const handleRegenerate = async () => {
    if (!currentConversationId || messages.length < 2) return;

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMessage) return;

    const lastAssistantMessage = messages[messages.length - 1];
    if (lastAssistantMessage.role !== "assistant") return;

    try {
      await apiRequest("DELETE", `/api/messages/${lastAssistantMessage.id}`);
      queryClient.invalidateQueries({
        queryKey: ["/api/conversations", currentConversationId, "messages"],
      });

      setIsStreaming(true);
      setStreamingMessage("");
      setStreamingReasoning("");
      setEstimatedTime(null);
      setStreamProgress(null);

      const token = getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/chat/regenerate", {
        method: "POST",
        headers,
        body: JSON.stringify({
          conversationId: currentConversationId,
          lastUserMessage: lastUserMessage.content,
          model: selectedModel,
          useReasoning,
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
              
              if (parsed.estimatedTime) {
                setEstimatedTime(parsed.estimatedTime);
                setCurrentModelName(parsed.model || "");
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
                  title: "Límite alcanzado",
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
      setEstimatedTime(null);
      setStreamProgress(null);
    }
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    setSidebarOpen(false);
  };

  const handleSuggestionClick = (prompt: string) => {
    handleSendMessage(prompt, false);
  };

  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const showEmptyState = !currentConversationId && messages.length === 0;
  const isPremium = user?.isPremium || usage?.isPremium || modelsData?.isPremium || false;
  const webSearchRemaining = usage?.limits.webSearchPerWeek === -1 
    ? 999 
    : (usage?.limits.webSearchPerWeek || 5) - (usage?.webSearchCount || 0);
  const aiUsageRemaining = usage?.limits.aiUsagePerWeek === -1 
    ? 999 
    : (usage?.limits.aiUsagePerWeek || 50) - (usage?.aiUsageCount || 0);

  const selectedModelInfo = modelsData?.models.find(m => m.key === selectedModel);

  // Message remaining per mode
  const modeMessageLimit = isPremium ? (usage?.messageLimits ? (usage?.messageLimits.roblox && usage?.messageLimits.general ? usage.messageLimits : { roblox: -1, general: -1 }) : { roblox: -1, general: -1 }) : (usage?.messageLimits || { roblox: 20, general: 30 });
  const messagesUsedRoblox = usage?.robloxMessageCount || 0;
  const messagesUsedGeneral = usage?.generalMessageCount || 0;
  const messageRemaining = chatMode === 'roblox' ? (modeMessageLimit.roblox === -1 ? 999 : Math.max(0, modeMessageLimit.roblox - messagesUsedRoblox)) : (modeMessageLimit.general === -1 ? 999 : Math.max(0, modeMessageLimit.general - messagesUsedGeneral));

  const formatTimeRemaining = (seconds: number): string => {
    if (seconds < 60) return `~${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `~${minutes}m ${secs}s`;
  };

  return (
    <div className={`flex h-screen w-full ${chatMode === 'general' ? 'bg-gradient-to-br from-white via-blue-50 to-indigo-50 text-slate-900' : 'bg-background'}`} data-testid="chat-page">
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
      />

      <div className="flex flex-col flex-1 min-w-0">
        <header className={`flex items-center justify-between px-4 py-3 border-b ${
          chatMode === 'general'
            ? 'border-indigo-200/50 bg-white/40 backdrop-blur-md shadow-sm'
            : 'border-border/50 bg-background/80 backdrop-blur-sm'
        } lg:px-6`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center animated-border-strong ${
              chatMode === 'general'
                ? 'bg-gradient-to-br from-indigo-100 to-blue-100'
                : 'bg-primary/10'
            }`}>
              <svg viewBox="0 0 24 24" fill="none" className={`w-4 h-4 ${chatMode === 'general' ? 'text-indigo-600' : 'text-primary'}`} stroke="currentColor" strokeWidth="1.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                />
              </svg>
            </div>
            <div>
              <h1 className={`text-sm font-semibold ${chatMode === 'general' ? 'text-slate-900' : 'text-foreground'}`} data-testid="text-header-title">
                {chatMode === 'general' ? 'Asistente Pro' : 'Roblox UI/UX Designer Pro'}
              </h1>
              <p className={`text-xs ${chatMode === 'general' ? 'text-slate-600' : 'text-muted-foreground'}`}>
                {chatMode === 'general' ? 'Tu asistente inteligente multipropósito' : 'Especializado en diseño de interfaces premium'}
              </p>
            </div>
            <div className={`hidden sm:flex items-center gap-2 text-xs ml-4 ${
              chatMode === 'general'
                ? 'text-slate-600'
                : 'text-muted-foreground'
            }`}>
              <Zap className={`h-3.5 w-3.5 ${chatMode === 'general' ? 'text-indigo-500' : 'text-primary'}`} />
              <span>{messageRemaining === 999 ? "∞" : messageRemaining} mensajes restantes ({chatMode === 'roblox' ? 'Roblox' : 'General'})</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <ProfileModal user={user} chatMode={chatMode}>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.email}</span>
                  <Settings className="h-3 w-3 opacity-50" />
                </Button>
              </ProfileModal>
            )}

            {isPremium && (
              <div className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                chatMode === 'general'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-amber-500/10 text-amber-500'
              }`}>
                <Crown className="h-3.5 w-3.5" />
                Premium
              </div>
            )}
            
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span>{aiUsageRemaining === 999 ? "∞" : aiUsageRemaining} usos</span>
            </div>
            
            <UpgradeModal usage={usage || null} chatMode={chatMode}>
              <Button variant="outline" size="sm" className={`gap-2 animated-border ${
                chatMode === 'general'
                  ? 'border-indigo-300/30 text-indigo-600 hover:bg-indigo-50'
                  : ''
              }`}>
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">{isPremium ? "Premium" : "Mejorar"}</span>
              </Button>
            </UpgradeModal>

            {onLogout && (
              <LogoutConfirmDialog onConfirm={onLogout}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </LogoutConfirmDialog>
            )}
          </div>
        </header>

        {isStreaming && (estimatedTime || streamProgress) && (
          <div className="px-4 py-2 bg-primary/5 border-b border-border/50 flex items-center justify-center gap-3">
            <Clock className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">
              {currentModelName && <span className="font-medium text-foreground">{currentModelName}</span>}
              {streamProgress ? (
                <span> - {streamProgress.tokensGenerated} tokens generados, {formatTimeRemaining(streamProgress.estimatedSecondsRemaining)} restantes</span>
              ) : estimatedTime ? (
                <span> - Tiempo estimado: {formatTimeRemaining(estimatedTime)}</span>
              ) : null}
            </span>
          </div>
        )}

        <div className={`flex-1 overflow-hidden ${chatMode === 'general' ? 'bg-gradient-to-b from-white/50 to-indigo-50/30' : ''}`}>
          {showEmptyState ? (
            <EmptyState onSuggestionClick={handleSuggestionClick} chatMode={chatMode} />
          ) : (
            <ScrollArea className="h-full">
              <div className={`max-w-4xl mx-auto py-4 ${chatMode === 'general' ? 'px-4' : ''}`}>
                {messages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    chatMode={chatMode}
                    onRegenerate={
                      index === messages.length - 1 && message.role === "assistant"
                        ? handleRegenerate
                        : undefined
                    }
                  />
                ))}

                {isStreaming && useReasoning && (
                  <ThinkingIndicator reasoning={streamingReasoning || undefined} modelName={currentModelName || selectedModelInfo?.name} chatMode={chatMode} />
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
                  />
                )}

                {isStreaming && !streamingMessage && <TypingIndicator chatMode={chatMode} />}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}
        </div>

        <div className={`border-t ${ chatMode === 'general' ? 'border-indigo-200/30 bg-gradient-to-r from-white/50 via-indigo-50/40 to-blue-50/30' : 'border-border/50 bg-background/50' }`}>
          <ChatInput
            onSend={handleSendMessage}
            isLoading={isStreaming}
            disabled={messageRemaining <= 0}
            webSearchRemaining={Math.max(0, webSearchRemaining)}
            models={modelsData?.models || []}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            useReasoning={useReasoning}
            onReasoningChange={setUseReasoning}
            isPremium={isPremium}
            chatMode={chatMode}
            onChatModeChange={setChatMode}
          />
        </div>
      </div>
    </div>
  );
}
