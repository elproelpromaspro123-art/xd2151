import { X, Copy, Check, Code2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

interface ArtifactPanelProps {
  content: string;
  language: string;
  onClose: () => void;
  title?: string;
}

export function ArtifactPanel({ content, language, onClose, title }: ArtifactPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `artifact.${language === "luau" ? "lua" : language || "txt"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-l border-border/40 animate-in slide-in-from-right-5 duration-300 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#252526]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded bg-blue-500/10 text-blue-400">
            <Code2 className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">
              {title || "Código Generado"}
            </span>
            <span className="text-xs text-slate-400 capitalize">
              {language || "Texto"}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-white/10"
            onClick={handleCopy}
            title="Copiar código"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-white/10"
            onClick={handleDownload}
            title="Descargar"
          >
            <Download className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-white/10"
            onClick={onClose}
            title="Cerrar panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative bg-[#1e1e1e]">
        <ScrollArea className="h-full">
          <div className="p-4 min-w-full">
            <SyntaxHighlighter
              language={language === "luau" ? "lua" : language}
              style={vscDarkPlus}
              customStyle={{
                background: "transparent",
                margin: 0,
                padding: 0,
                fontSize: "14px",
                lineHeight: "1.6",
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
              }}
              showLineNumbers={true}
              wrapLines={true}
            >
              {content}
            </SyntaxHighlighter>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
