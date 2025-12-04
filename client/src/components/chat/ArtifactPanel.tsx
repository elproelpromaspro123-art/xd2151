import { X, Copy, Check, Code2, Download, ChevronLeft } from "lucide-react";
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

    const displayLanguage = 
        language === "luau" ? "Luau" : 
        language === "lua" ? "Luau" :
        language.toUpperCase();

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-[#1e1e1e] to-[#1a1a1a] border-l border-border/40 animate-in slide-in-from-right-5 duration-300 shadow-2xl">
            {/* Header - Minimalist */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#252526]/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-md bg-blue-500/15 text-blue-400 flex-shrink-0">
                        <Code2 className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-semibold text-slate-100 truncate leading-tight">
                            {title || "Code"}
                        </span>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">
                            {displayLanguage}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-all"
                        onClick={handleCopy}
                        title="Copy code"
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-all"
                        onClick={handleDownload}
                        title="Download"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-5 bg-white/10 mx-1" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-all"
                        onClick={onClose}
                        title="Close"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content - Full screen code view */}
            <div className="flex-1 overflow-hidden relative bg-[#1e1e1e]">
                <ScrollArea className="h-full w-full">
                    <div className="p-4 min-w-full font-mono">
                        <SyntaxHighlighter
                            language={language === "luau" ? "lua" : language}
                            style={vscDarkPlus}
                            customStyle={{
                                background: "transparent",
                                margin: 0,
                                padding: 0,
                                fontSize: "13px",
                                lineHeight: "1.7",
                                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            }}
                            showLineNumbers={true}
                            wrapLines={true}
                            lineNumberStyle={{
                                color: "#6e7681",
                                paddingRight: "1.5rem",
                                opacity: 0.6,
                            }}
                        >
                            {content}
                        </SyntaxHighlighter>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
