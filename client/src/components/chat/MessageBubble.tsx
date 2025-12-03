import { useState } from "react";
import { Check, Copy, RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageContent } from "./MessageContent";

interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}

export function MessageBubble({ message, isStreaming = false, onRegenerate }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={`group flex gap-3 px-4 py-4 message-fade-in ${
        isUser ? "justify-end" : "justify-start"
      }`}
      data-testid={`message-bubble-${message.role}-${message.id}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 animated-border-pulse">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5 text-primary"
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
      )}

      <div
        className={`flex flex-col gap-2 ${
          isUser ? "items-end max-w-[70%]" : "items-start max-w-[85%]"
        }`}
      >
        <div
          className={`relative rounded-lg px-4 py-3 ${
            isUser
              ? "bg-primary text-primary-foreground animated-border"
              : "bg-card animated-border"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MessageContent content={message.content} isStreaming={isStreaming} />
          )}
        </div>

        {!isUser && !isStreaming && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-7 px-2 text-xs gap-1"
              data-testid="button-copy-message"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copiar</span>
                </>
              )}
            </Button>
            {onRegenerate && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onRegenerate}
                className="h-7 px-2 text-xs gap-1"
                data-testid="button-regenerate"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Regenerar</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1 animated-border">
          <User className="w-4 h-4 text-foreground" />
        </div>
      )}
    </div>
  );
}
