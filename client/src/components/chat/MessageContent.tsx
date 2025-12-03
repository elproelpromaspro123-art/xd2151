import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

interface MessageContentProps {
  content: string;
  isStreaming?: boolean;
}

export function MessageContent({ content, isStreaming = false }: MessageContentProps) {
  return (
    <div className={`prose-chat ${isStreaming ? "cursor-blink" : ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");

            if (isInline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }

            const language = match ? match[1] : "text";
            const codeString = String(children).replace(/\n$/, "");

            return <CodeBlock language={language} code={codeString} />;
          },
          pre({ children }) {
            return <>{children}</>;
          },
          h1({ children }) {
            return <h1 className="text-xl font-semibold mt-4 mb-2 text-foreground">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg font-semibold mt-4 mb-2 text-foreground">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-base font-semibold mt-3 mb-2 text-foreground">{children}</h3>;
          },
          p({ children }) {
            return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-foreground">{children}</li>;
          },
          strong({ children }) {
            return <strong className="font-semibold text-foreground">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic">{children}</em>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-3">
                {children}
              </blockquote>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
              >
                {children}
              </a>
            );
          },
          hr() {
            return <hr className="my-4 border-border" />;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3">
                <table className="w-full border-collapse">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border border-border px-3 py-2 text-left bg-muted font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return <td className="border border-border px-3 py-2 text-left">{children}</td>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
