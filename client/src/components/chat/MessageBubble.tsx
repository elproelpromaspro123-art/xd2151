import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import { Message } from "@shared/schema";
import { MessageContent } from "./MessageContent";
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy, Check, User, Bot } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  chatMode?: "roblox" | "general";
  onRegenerate?: () => void;
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
  isStreaming, 
  onOpenArtifact, 
  artifactState 
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  
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

  return (
    <div
      className={cn(
        "flex w-full mb-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex gap-3 max-w-[90%] lg:max-w-[85%]",
        isUser && "flex-row-reverse"
      )}>
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center",
          isUser
            ? chatMode === 'general'
              ? "bg-blue-600 text-white"
              : "bg-primary text-primary-foreground"
            : chatMode === 'general'
              ? "bg-slate-100 text-slate-600"
              : "bg-zinc-800 text-zinc-400"
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
            "text-xs font-medium mb-1.5",
            isUser
              ? chatMode === 'general' ? "text-slate-600 text-right" : "text-zinc-400 text-right"
              : chatMode === 'general' ? "text-slate-600" : "text-zinc-400"
          )}>
            {isUser ? "Tú" : "Asistente"}
          </div>

          {/* Message bubble */}
          <div
            className={cn(
              "rounded-2xl px-4 py-3 transition-all",
              isUser
                ? chatMode === 'general'
                  ? "bg-blue-600 text-white rounded-tr-md"
                  : "bg-primary text-primary-foreground rounded-tr-md"
                : chatMode === 'general'
                  ? "bg-white border border-slate-200/80 shadow-sm rounded-tl-md"
                  : "bg-zinc-800/80 border border-zinc-700/50 rounded-tl-md"
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

          {/* Actions for assistant messages */}
          {!isUser && !isStreaming && (
            <div className={cn(
              "flex items-center gap-1 mt-2 opacity-0 hover:opacity-100 transition-opacity",
              "group-hover:opacity-100"
            )}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className={cn(
                  "h-7 gap-1.5 text-xs",
                  chatMode === 'general'
                    ? "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                )}
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copiar
                  </>
                )}
              </Button>

              {onRegenerate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerate}
                  className={cn(
                    "h-7 gap-1.5 text-xs",
                    chatMode === 'general'
                      ? "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      : "text-zinc-500 hover:text-primary hover:bg-primary/10"
                  )}
                >
                  <RefreshCw className="h-3 w-3" />
                  Regenerar
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
