import { memo } from "react";
import { cn } from "@/lib/utils";
import { Message } from "@shared/schema";
import { MessageContent } from "./MessageContent";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
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
      // Fallback to original content if parsing fails
      textContent = message.content;
    }
  }

  return (
    <div
      className={cn(
        "flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] lg:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm transition-all hover:shadow-md",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card border border-border/50 rounded-bl-none"
        )}
      >
        {isUser ? (
          <div className="flex flex-col gap-3">
             {imageUrl && (
               <div className="rounded-lg overflow-hidden bg-black/10 border border-white/10">
                 <img src={imageUrl} alt="Uploaded" className="max-w-full h-auto max-h-[300px] object-contain" />
               </div>
             )}
             <div className="whitespace-pre-wrap text-sm leading-relaxed">{textContent}</div>
          </div>
        ) : (
          <MessageContent content={textContent} />
        )}
      </div>
    </div>
  );
});
