import { memo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Message } from "@shared/schema";
import { MessageContent } from "./MessageContent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Copy, Check, User, Bot, Pencil, X, Send } from "lucide-react";
import { getToken } from "@/lib/auth";

interface MessageBubbleProps {
  message: Message;
  chatMode?: "roblox" | "general";
  onRegenerate?: () => void;
  onEditAndResend?: (newContent: string) => void;
  isStreaming?: boolean;
  onOpenArtifact?: (code: string, language: string) => void;
  artifactState?: {
    isOpen: boolean;
    content: string;
  };
}

export const MessageBubble = memo(function MessageBubble({ 
  message, 
  chatMode = "roblox", 
  onRegenerate, 
  onEditAndResend,
  isStreaming, 
  onOpenArtifact, 
  artifactState 
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const isUser = message.role === "user";

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  let textContent = message.content;
  let imageUrl: string | undefined;

  if (isUser) {
    try {
      if (typeof message.content === 'string' && message.content.trim().startsWith('[')) {
        const parsed = JSON.parse(message.content);
        if (Array.isArray(parsed)) {
          const textPart = parsed.find((p: any) => p.type === "text");
          const imagePart = parsed.find((p: any) => p.type === "image_url");
          if (textPart) textContent = textPart.text || "";
          if (imagePart) imageUrl = imagePart.image_url?.url;
        }
      }
    } catch (e) {
      textContent = message.content;
    }
    if (typeof textContent === 'string') {
      const lines = textContent.split('\n');
      const filtered = lines.filter(line => !/^CONFIG_ROBLOX_OUTPUT=/.test(line) && !/^CONFIG_ROBLOX_LINES=/.test(line));
      textContent = filtered.join('\n');
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  const handleStartEdit = () => {
    setEditContent(textContent);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent("");
  };

  const handleSubmitEdit = () => {
    if (editContent.trim() && onEditAndResend) {
      onEditAndResend(editContent.trim());
      setIsEditing(false);
      setEditContent("");
    }
  };

  const ActionButtons = () => {
    if (isStreaming) return null;
    
    return (
      <div className={cn(
        "absolute -bottom-8 flex items-center gap-0.5 px-1 py-0.5 rounded-lg transition-all duration-200",
        isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none",
        "bg-card/95 border border-card-border shadow-md backdrop-blur-sm"
      )}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className={cn(
            "h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          )}
          title="Copiar"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>

        {isUser && onEditAndResend && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleStartEdit}
            className={cn(
              "h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            )}
            title="Editar y reenviar"
          >
            <Pencil className="h-3 w-3" />
          </Button>
        )}

        {!isUser && onRegenerate && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRegenerate}
            className={cn(
              "h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            )}
            title="Regenerar respuesta"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  if (isEditing && isUser) {
    return (
      <div className={cn(
        "flex w-full mb-6 animate-in fade-in-0 duration-200",
        "justify-end"
      )}>
        <div className="flex gap-3 max-w-[90%] lg:max-w-[85%] flex-row-reverse">
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center",
            "bg-primary text-primary-foreground"
          )}>
            <User className="h-4 w-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className={cn(
              "text-xs font-medium mb-1.5 text-right text-muted-foreground"
            )}>
              Editando mensaje
            </div>

            <div className={cn(
              "rounded-2xl rounded-tr-md p-3 bg-primary/10 border border-primary/30"
            )}>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className={cn(
                  "min-h-[80px] resize-none border-0 bg-transparent focus-visible:ring-0 p-0 text-foreground"
                )}
                placeholder="Edita tu mensaje..."
                autoFocus
              />
              <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-border/30">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="h-7 gap-1 text-xs"
                >
                  <X className="h-3 w-3" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitEdit}
                  disabled={!editContent.trim()}
                  className="h-7 gap-1 text-xs"
                >
                  <Send className="h-3 w-3" />
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full mb-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => {
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          setHoverTimeout(null);
        }
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        const timeout = setTimeout(() => setIsHovered(false), 300); // 300ms delay
        setHoverTimeout(timeout);
      }}
    >
      <div className={cn(
        "relative flex gap-3 max-w-[90%] lg:max-w-[85%]",
        isUser && "flex-row-reverse"
      )}>
        <ActionButtons />

        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}>
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>

        {/* Message content */}
        <div className="flex-1 min-w-0">
          {/* Role label */}
          <div className={cn(
            "text-xs font-medium mb-1.5 text-muted-foreground",
            isUser && "text-right"
          )}>
            {isUser ? "Tú" : "Asistente"}
          </div>

          {/* Message bubble */}
          <div
            className={cn(
              "rounded-2xl px-4 py-3 transition-all",
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-md"
                : "bg-card border border-card-border shadow-sm rounded-tl-md text-card-foreground"
            )}
          >
            {isUser ? (
              <div className="flex flex-col gap-3">
                {imageUrl && (
                  <div className="rounded-lg overflow-hidden bg-black/10 border border-white/10">
                    <img 
                      src={imageUrl} 
                      alt="Uploaded" 
                      className="max-w-full h-auto max-h-[250px] object-contain" 
                    />
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{textContent}</div>
              </div>
            ) : (
              <MessageContent 
                content={textContent} 
                isStreaming={isStreaming} 
                chatMode={chatMode} 
                onOpenArtifact={onOpenArtifact} 
                artifactState={artifactState}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
