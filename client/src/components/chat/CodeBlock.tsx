import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  language: string;
  code: string;
}

const customTheme = {
  ...oneDark,
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: "transparent",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: "13px",
    lineHeight: "1.6",
  },
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: "transparent",
    margin: 0,
    padding: 0,
  },
};

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const displayLanguage = language === "lua" || language === "luau" ? "Luau" : language.toUpperCase();

  return (
    <div className="group relative rounded-lg overflow-visible animated-border my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-card/80 border-b border-border/50 rounded-t-lg">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {displayLanguage}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="h-7 px-2 text-xs gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          data-testid="button-copy-code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copiar</span>
            </>
          )}
        </Button>
      </div>
      <div className="bg-[#1a1a1f] p-4 overflow-x-auto rounded-b-lg">
        <SyntaxHighlighter
          language={language === "luau" ? "lua" : language}
          style={customTheme}
          customStyle={{
            background: "transparent",
            margin: 0,
            padding: 0,
          }}
          showLineNumbers={code.split("\n").length > 3}
          lineNumberStyle={{
            color: "hsl(240 4% 35%)",
            fontSize: "12px",
            paddingRight: "16px",
            minWidth: "2.5em",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
