import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, Terminal, LayoutTemplate, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  language: string;
  code: string;
  chatMode?: "roblox" | "general";
  onOpenArtifact?: (code: string, language: string) => void;
  isArtifactOpen?: boolean;
}

const customTheme = {
  ...vscDarkPlus,
  'code[class*="language-"]': {
    ...vscDarkPlus['code[class*="language-"]'],
    background: "transparent",
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  'pre[class*="language-"]': {
    ...vscDarkPlus['pre[class*="language-"]'],
    background: "transparent",
    margin: 0,
    padding: 0,
  },
};

export function CodeBlock({ language, code, chatMode = "roblox", onOpenArtifact, isArtifactOpen }: CodeBlockProps) {
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

  const displayLanguage = language === "lua" || language === "luau" ? "Luau" : language;

  if (isArtifactOpen) {
    return (
      <div className="rounded-xl border border-border/40 bg-[#1e1e1e] my-4 shadow-sm group flex items-center justify-between p-3 cursor-pointer hover:bg-[#2d2d2d] transition-colors" onClick={() => onOpenArtifact?.(code, language)}>
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Code className="h-4 w-4 text-blue-400" />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-200">Artefacto creado</span>
                <span className="text-xs text-gray-500">Click para ver código</span>
            </div>
        </div>
        <Button
            size="sm"
            variant="ghost"
            className="h-8 px-3 text-xs gap-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
        >
            <LayoutTemplate className="h-3.5 w-3.5" />
            Ver Artefacto
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border/40 bg-[#1e1e1e] my-4 shadow-sm group">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#2d2d2d] border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400 lowercase font-mono">
            {displayLanguage}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onOpenArtifact && (
             <Button
               size="sm"
               variant="ghost"
               onClick={() => onOpenArtifact(code, language)}
               className="h-7 px-2 text-xs gap-1.5 text-gray-400 hover:text-white hover:bg-white/10"
               title="Open in Side View"
             >
               <LayoutTemplate className="h-3.5 w-3.5" />
               <span className="hidden sm:inline">Artifact</span>
             </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 px-2 text-xs gap-1.5 text-gray-400 hover:text-white hover:bg-white/10"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto relative">
        <SyntaxHighlighter
          language={language === "luau" ? "lua" : language}
          style={customTheme}
          customStyle={{
            background: "transparent",
            margin: 0,
            padding: 0,
          }}
          showLineNumbers={false}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
