"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Copy, Check, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Lang = "html" | "css" | "javascript";

const LANG_COLORS: Record<Lang, string> = {
    html: "text-orange-500",
    css: "text-blue-500",
    javascript: "text-yellow-500",
};

const LANG_BG: Record<Lang, string> = {
    html: "bg-orange-500/10 border-orange-500/30",
    css: "bg-blue-500/10 border-blue-500/30",
    javascript: "bg-yellow-500/10 border-yellow-500/30",
};

const EXAMPLES: Record<Lang, string> = {
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Mi Página</title></head><body><div class="container"><h1>Hola Mundo</h1><p>Este es un párrafo de ejemplo con <strong>texto en negrita</strong> y <em>cursiva</em>.</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></div></body></html>`,
    css: `body{margin:0;padding:0;font-family:sans-serif;}.container{max-width:1200px;margin:0 auto;padding:0 20px;}.hero{background:linear-gradient(135deg,#f97316,#8b5cf6);color:white;padding:80px 0;text-align:center;}.hero h1{font-size:3rem;font-weight:800;margin-bottom:1rem;}@media(max-width:768px){.hero h1{font-size:2rem;}}`,
    javascript: `function fetchData(url,options={method:'GET',headers:{}}){return new Promise((resolve,reject)=>{fetch(url,options).then(response=>{if(!response.ok){throw new Error('HTTP error! status: '+response.status);}return response.json();}).then(data=>resolve(data)).catch(err=>reject(err));});}const processItems=(items)=>items.filter(item=>item.active).map(item=>({...item,name:item.name.trim(),updatedAt:new Date().toISOString()})).sort((a,b)=>a.name.localeCompare(b.name));`,
};

function beautifyHTML(code: string, indent = "  "): string {
    let result = "";
    let level = 0;
    const voidElements = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
    const inlineElements = new Set(["a","abbr","b","bdi","bdo","cite","code","data","dfn","em","i","kbd","mark","q","rp","rt","ruby","s","samp","small","span","strong","sub","sup","time","u","var","wbr"]);

    code = code.replace(/></g, ">\n<").replace(/\n\s*\n/g, "\n");
    const lines = code.split("\n").map(l => l.trim()).filter(Boolean);

    for (const line of lines) {
        const isClosing = /^<\//.test(line);
        const isOpening = /^<[^/!][^>]*[^/]>$/.test(line) || /^<[^/!][^>]*>$/.test(line);
        const isSelfClosing = /\/>$/.test(line) || voidElements.has((line.match(/^<([a-zA-Z]+)/) ?? [])[1]?.toLowerCase() ?? "");
        const tag = (line.match(/^<\/?([a-zA-Z]+)/) ?? [])[1]?.toLowerCase() ?? "";

        if (isClosing && !isSelfClosing) level = Math.max(0, level - 1);
        result += indent.repeat(level) + line + "\n";
        if (isOpening && !isSelfClosing && !inlineElements.has(tag)) level++;
    }
    return result.trim();
}

function beautifyCSS(code: string, indent = "  "): string {
    return code
        .replace(/\s*{\s*/g, " {\n")
        .replace(/;\s*/g, ";\n")
        .replace(/\s*}\s*/g, "\n}\n")
        .split("\n")
        .map(line => {
            const trimmed = line.trim();
            if (!trimmed) return "";
            if (trimmed.endsWith("{")) return trimmed;
            if (trimmed === "}") return "}";
            return indent + trimmed;
        })
        .filter((line, i, arr) => !(line === "" && (arr[i - 1] === "" || arr[i + 1] === "")))
        .join("\n")
        .trim();
}

function beautifyJS(code: string, indent = "  "): string {
    let result = "";
    let level = 0;
    let inString: string | null = null;
    let i = 0;

    while (i < code.length) {
        const char = code[i];
        const next = code[i + 1];

        if (inString) {
            result += char;
            if (char === "\\" && next) { result += next; i += 2; continue; }
            if (char === inString) inString = null;
            i++; continue;
        }

        if (char === '"' || char === "'" || char === "`") { inString = char; result += char; i++; continue; }

        if (char === "{" || char === "[" || char === "(") {
            result += char + "\n" + indent.repeat(++level);
        } else if (char === "}" || char === "]" || char === ")") {
            result = result.trimEnd() + "\n" + indent.repeat(--level < 0 ? (level = 0) : level) + char;
        } else if (char === ";") {
            result += ";\n" + indent.repeat(level);
        } else if (char === ",") {
            result += ",\n" + indent.repeat(level);
        } else if (char === " " && result.endsWith("\n" + indent.repeat(level))) {
            // skip leading spaces after newline
        } else {
            result += char;
        }
        i++;
    }
    return result.replace(/\n{3,}/g, "\n\n").trim();
}

function minify(code: string, lang: Lang): string {
    if (lang === "html") return code.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
    if (lang === "css") return code.replace(/\s+/g, " ").replace(/\s*([{:;,}])\s*/g, "$1").replace(/;}/g, "}").trim();
    return code.replace(/\/\/[^\n]*/g, "").replace(/\s+/g, " ").replace(/\s*([{(,;:+\-*/=&|!?<>])\s*/g, (_, c) => c).trim();
}

export default function CodeBeautifierPage() {
    const [lang, setLang] = useState<Lang>("html");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"beautify" | "minify">("beautify");
    const [copied, setCopied] = useState(false);

    const transform = (code = input, m = mode, l = lang) => {
        if (!code.trim()) { setOutput(""); return; }
        let result: string;
        if (m === "minify") {
            result = minify(code, l);
        } else {
            if (l === "html") result = beautifyHTML(code);
            else if (l === "css") result = beautifyCSS(code);
            else result = beautifyJS(code);
        }
        setOutput(result);
    };

    const copy = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const loadExample = () => {
        setInput(EXAMPLES[lang]);
        transform(EXAMPLES[lang], mode, lang);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Code2 className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Code Beautifier</h1>
                </div>
                <p className="text-muted-foreground">Embellece o minifica código HTML, CSS y JavaScript. Procesado instantáneamente en el navegador.</p>
            </motion.div>

            {/* Controls */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex gap-2">
                    {(["html", "css", "javascript"] as Lang[]).map(l => (
                        <Button key={l} size="sm"
                            variant={lang === l ? "default" : "outline"}
                            className={lang === l ? `${LANG_BG[l]} border ${LANG_COLORS[l]} uppercase text-xs` : "uppercase text-xs"}
                            onClick={() => { setLang(l); if (input) transform(input, mode, l); }}
                        >
                            {l}
                        </Button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant={mode === "beautify" ? "default" : "outline"}
                        className={mode === "beautify" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}
                        onClick={() => { setMode("beautify"); if (input) transform(input, "beautify", lang); }}
                    >
                        <Wand2 className="w-4 h-4 mr-1" /> Embellece
                    </Button>
                    <Button size="sm" variant={mode === "minify" ? "default" : "outline"}
                        className={mode === "minify" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}
                        onClick={() => { setMode("minify"); if (input) transform(input, "minify", lang); }}
                    >
                        Minifica
                    </Button>
                </div>
                <Button size="sm" variant="outline" onClick={loadExample}>Cargar ejemplo {lang.toUpperCase()}</Button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                    <Card className="border-border/50 h-full">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">Código de entrada</CardTitle>
                            <span className={`text-xs font-mono px-2 py-0.5 rounded ${LANG_BG[lang]} ${LANG_COLORS[lang]}`}>
                                {lang.toUpperCase()}
                            </span>
                        </CardHeader>
                        <CardContent className="p-0">
                            <textarea
                                value={input}
                                onChange={e => { setInput(e.target.value); transform(e.target.value); }}
                                placeholder={`Pega tu código ${lang.toUpperCase()} aquí...`}
                                className="w-full h-[50vh] min-h-[280px] px-4 py-3 bg-transparent focus:outline-none font-mono text-xs resize-none leading-relaxed"
                                spellCheck={false}
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Output */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-border/50 h-full">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                                {mode === "beautify" ? "Formateado" : "Minificado"}
                                {output && (
                                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                                        {output.length} chars
                                        {input && ` (${input.length > 0 ? Math.round((output.length / input.replace(/\s+/g, " ").length) * 100) : 100}%)`}
                                    </span>
                                )}
                            </CardTitle>
                            {output && (
                                <Button size="sm" variant="outline" onClick={copy}>
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="p-0">
                            <pre className="w-full h-[50vh] min-h-[280px] px-4 py-3 font-mono text-xs overflow-auto leading-relaxed whitespace-pre-wrap break-all">
                                {output || <span className="text-muted-foreground">El código formateado aparecerá aquí...</span>}
                            </pre>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
