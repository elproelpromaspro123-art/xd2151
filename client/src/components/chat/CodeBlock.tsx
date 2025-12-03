import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  language: string;
  code: string;
  chatMode?: "roblox" | "general";
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

export function CodeBlock({ language, code, chatMode = "roblox" }: CodeBlockProps) {
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
    <div className={`group relative rounded-lg overflow-visible my-3 transition-colors ${
      chatMode === 'general' ? 'animated-border-general' : 'animated-border'
    }`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b rounded-t-lg transition-colors ${
        chatMode === 'general'
          ? 'bg-indigo-50/60 border-indigo-200/30'
          : 'bg-card/80 border-border/50'
      }`}>
        <span className={`text-xs font-medium uppercase tracking-wider transition-colors ${
          chatMode === 'general'
            ? 'text-indigo-700'
            : 'text-muted-foreground'
        }`}>
          {displayLanguage}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className={`h-7 px-2 text-xs gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${
            chatMode === 'general'
              ? 'text-indigo-600 hover:bg-indigo-100/40'
              : ''
          }`}
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
      <div className={`p-4 overflow-x-auto rounded-b-lg transition-colors ${
        chatMode === 'general'
          ? 'bg-slate-900/80 border border-t-0 border-indigo-200/20'
          : 'bg-[#1a1a1f]'
      }`}>
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
