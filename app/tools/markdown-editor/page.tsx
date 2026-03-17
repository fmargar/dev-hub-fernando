"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Eye, Code2, Copy, Check, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EXAMPLE = `# Mi Proyecto

## Descripción

Un proyecto de ejemplo para mostrar el **editor Markdown** en vivo.

## Características

- Renderizado en tiempo real
- Soporte para *cursiva* y **negrita**
- Bloques de código

\`\`\`javascript
const saludo = "Hola Mundo";
console.log(saludo);
\`\`\`

## Tabla de ejemplo

| Nombre | Rol | Estado |
|--------|-----|--------|
| Fernando | Dev | Activo |
| Ana | Design | Activo |

## Lista de tareas

- [x] Instalar dependencias
- [x] Configurar proyecto
- [ ] Desplegar en producción

> **Nota:** Este editor funciona 100% en el navegador.

---

## Links

[Portfolio](https://fmargar.es) · [GitHub](https://github.com)
`;

function parseMarkdown(md: string): string {
    let html = md
        // Escape HTML
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        // Code blocks
        .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
            `<pre class="code-block"><code class="${lang ? `language-${lang}` : ''}">${code.trim()}</code></pre>`)
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
        // Headers
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Blockquote
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        // Bold + Italic
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // ~~strikethrough~~
        .replace(/~~(.+?)~~/g, '<del>$1</del>')
        // Horizontal rule
        .replace(/^---$/gm, '<hr />')
        // Tables
        .replace(/^(\|.+\|)\n\|[-| :]+\|\n((?:\|.+\|\n?)+)/gm, (_, header, rows) => {
            const ths = header.split("|").filter((c: string) => c.trim()).map((c: string) => `<th>${c.trim()}</th>`).join("");
            const trs = rows.trim().split("\n").map((row: string) => {
                const tds = row.split("|").filter((c: string) => c.trim()).map((c: string) => `<td>${c.trim()}</td>`).join("");
                return `<tr>${tds}</tr>`;
            }).join("");
            return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
        })
        // Task lists
        .replace(/^- \[x\] (.+)$/gm, '<li class="task done"><span class="checkbox checked">✓</span> $1</li>')
        .replace(/^- \[ \] (.+)$/gm, '<li class="task"><span class="checkbox">○</span> $1</li>')
        // Unordered lists
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        // Wrap consecutive <li> in <ul>
        .replace(/(<li.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        // Paragraphs (double newline)
        .replace(/\n\n(?!<[uh]|<pre|<block|<hr|<table)/g, '</p><p>')
        // Single newlines to <br> within paragraphs
        .replace(/\n(?!<)/g, '<br />');

    return `<p>${html}</p>`;
}

export default function MarkdownEditorPage() {
    const [markdown, setMarkdown] = useState(EXAMPLE);
    const [view, setView] = useState<"split" | "edit" | "preview">("split");
    const [copied, setCopied] = useState(false);

    const html = parseMarkdown(markdown);
    const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
    const charCount = markdown.length;

    const copy = async () => {
        await navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const download = () => {
        const blob = new Blob([markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "document.md"; a.click();
        URL.revokeObjectURL(url);
    };

    const downloadHtml = () => {
        const full = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.7; }
  h1,h2,h3 { margin-top: 2rem; } pre { background: #f4f4f4; padding: 1rem; border-radius: 8px; overflow-x: auto; }
  code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
  blockquote { border-left: 4px solid #f97316; margin: 0; padding: 0.5rem 1rem; background: #fff7ed; }
  table { border-collapse: collapse; width: 100%; } th,td { border: 1px solid #e2e8f0; padding: 0.5rem 1rem; }
  th { background: #f8fafc; } a { color: #f97316; }
</style>
</head><body>${html}</body></html>`;
        const blob = new Blob([full], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "document.html"; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <FileText className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Editor Markdown</h1>
                </div>
                <p className="text-muted-foreground">Escribe Markdown y ve el resultado en tiempo real. Exporta a .md o .html.</p>
            </motion.div>

            {/* Toolbar */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex gap-2">
                    <Button size="sm" variant={view === "edit" ? "default" : "outline"}
                        className={view === "edit" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
                        onClick={() => setView("edit")}>
                        <Code2 className="w-4 h-4 mr-1" /> Editar
                    </Button>
                    <Button size="sm" variant={view === "split" ? "default" : "outline"}
                        className={view === "split" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
                        onClick={() => setView("split")}>
                        División
                    </Button>
                    <Button size="sm" variant={view === "preview" ? "default" : "outline"}
                        className={view === "preview" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
                        onClick={() => setView("preview")}>
                        <Eye className="w-4 h-4 mr-1" /> Preview
                    </Button>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{wordCount} palabras · {charCount} caracteres</span>
                    <Button size="sm" variant="outline" onClick={copy}>
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={download}>
                        <Download className="w-4 h-4 mr-1" /> .md
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadHtml}>
                        <Download className="w-4 h-4 mr-1" /> .html
                    </Button>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className={`grid gap-4 ${view === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
                {/* Editor */}
                {(view === "edit" || view === "split") && (
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-emerald-500" /> Markdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <textarea
                                value={markdown}
                                onChange={e => setMarkdown(e.target.value)}
                                className="w-full h-[600px] px-4 py-3 bg-transparent focus:outline-none font-mono text-sm resize-none leading-relaxed"
                                spellCheck={false}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Preview */}
                {(view === "preview" || view === "split") && (
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Eye className="w-4 h-4 text-emerald-500" /> Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 overflow-auto h-[600px]">
                            <div
                                className="prose prose-sm max-w-none dark:prose-invert markdown-preview"
                                dangerouslySetInnerHTML={{ __html: html }}
                                style={{
                                    lineHeight: "1.7",
                                }}
                            />
                            <style>{`
                                .markdown-preview h1 { font-size: 2rem; font-weight: 800; margin: 1.5rem 0 1rem; border-bottom: 2px solid #f97316; padding-bottom: 0.5rem; }
                                .markdown-preview h2 { font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
                                .markdown-preview h3 { font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem; }
                                .markdown-preview strong { font-weight: 700; }
                                .markdown-preview em { font-style: italic; }
                                .markdown-preview del { text-decoration: line-through; opacity: 0.6; }
                                .markdown-preview a { color: #f97316; text-decoration: underline; }
                                .markdown-preview code.inline-code { background: rgba(255,255,255,0.1); padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.85em; font-family: monospace; }
                                .markdown-preview pre.code-block { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
                                .markdown-preview pre.code-block code { background: none; padding: 0; font-size: 0.85rem; font-family: monospace; }
                                .markdown-preview blockquote { border-left: 4px solid #f97316; margin: 1rem 0; padding: 0.5rem 1rem; background: rgba(249,115,22,0.05); border-radius: 0 8px 8px 0; }
                                .markdown-preview ul { padding-left: 1.5rem; margin: 0.5rem 0; list-style-type: disc; }
                                .markdown-preview li { margin: 0.25rem 0; }
                                .markdown-preview li.task { list-style: none; margin-left: -1rem; }
                                .markdown-preview .checkbox { margin-right: 0.5rem; font-size: 0.8em; }
                                .markdown-preview .checkbox.checked { color: #22c55e; }
                                .markdown-preview table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
                                .markdown-preview th, .markdown-preview td { border: 1px solid rgba(255,255,255,0.1); padding: 0.5rem 1rem; text-align: left; }
                                .markdown-preview th { background: rgba(255,255,255,0.05); font-weight: 600; }
                                .markdown-preview hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 2rem 0; }
                                .markdown-preview p { margin: 0.75rem 0; }
                            `}</style>
                        </CardContent>
                    </Card>
                )}
            </motion.div>
        </div>
    );
}
