"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, Image as ImageIcon, Copy, CheckCircle2, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import html2canvas from "html2canvas";
import Prism from "prismjs";
import "prismjs/themes/prism-twilight.css"; // We'll use twilight as a starting base

// Need to import languages we want to support
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-rust";

type Theme = "twilight" | "dracula" | "oceanic";
type Language = "javascript" | "typescript" | "jsx" | "tsx" | "css" | "python" | "rust" | "html";

export default function SnippetGeneratorPage() {
    const [code, setCode] = useState(`function calculateFibonacci(n) {\n  if (n <= 1) return n;\n  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);\n}\n\n// Generate the 10th number\nconsole.log(calculateFibonacci(10));`);
    const [language, setLanguage] = useState<Language>("javascript");
    const [theme, setTheme] = useState<Theme>("twilight");
    const [padding, setPadding] = useState(32);
    const [isExporting, setIsExporting] = useState(false);
    const [copied, setCopied] = useState(false);

    const snippetRef = useRef<HTMLDivElement>(null);

    // Re-run syntax highlighting when code or language changes
    useEffect(() => {
        Prism.highlightAll();
    }, [code, language]);

    const getThemeStyles = () => {
        switch (theme) {
            case "dracula":
                return "bg-[#282a36] text-[#f8f8f2]";
            case "oceanic":
                return "bg-[#1B2B34] text-[#D8DEE9]";
            case "twilight":
            default:
                return "bg-[#141414] text-[#f8f8f2]";
        }
    };

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleExport = async () => {
        if (!snippetRef.current) return;
        setIsExporting(true);

        try {
            // Need to remove rounded corners from parent container before capture 
            // to avoid weird aliasing issues on the transparent areas, or capture just the inner.
            const canvas = await html2canvas(snippetRef.current, {
                backgroundColor: null, // Transparent background
                scale: 3, // High quality
                logging: false,
                useCORS: true,
            });

            const url = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = url;
            a.download = `snippet-${new Date().getTime()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error generating snippet image:", error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-pink-500/10 rounded-lg">
                        <Code2 className="w-6 h-6 text-pink-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Snippet Generator</h1>
                </div>
                <p className="text-muted-foreground">
                    Crea imágenes hermosas de tu código para compartir en redes sociales o incluir en documentación.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Settings */}
                <motion.div
                    className="lg:col-span-4 space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Settings className="w-4 h-4" /> Configuración Visual
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Lenguaje</label>
                                <Select value={language} onValueChange={(v) => { if (v) setLanguage(v as Language) }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona lenguaje" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="javascript">JavaScript</SelectItem>
                                        <SelectItem value="typescript">TypeScript</SelectItem>
                                        <SelectItem value="jsx">React (JSX)</SelectItem>
                                        <SelectItem value="tsx">React (TSX)</SelectItem>
                                        <SelectItem value="python">Python</SelectItem>
                                        <SelectItem value="rust">Rust</SelectItem>
                                        <SelectItem value="css">CSS</SelectItem>
                                        <SelectItem value="html">HTML</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tema Base (Fondo)</label>
                                <Select value={theme} onValueChange={(v) => { if (v) setTheme(v as Theme) }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona tema" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="twilight">Twilight (Oscuro)</SelectItem>
                                        <SelectItem value="dracula">Drácula</SelectItem>
                                        <SelectItem value="oceanic">Oceanic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium">Padding ({padding}px)</label>
                                </div>
                                <Slider
                                    value={[padding]}
                                    onValueChange={(v) => {
                                        const values = Array.isArray(v) ? v : (typeof v === 'number' ? [v] : []);
                                        if (values.length > 0) setPadding(values[0]);
                                    }}
                                    min={16}
                                    max={128}
                                    step={8}
                                />
                            </div>

                            <Button
                                className="w-full gap-2 bg-pink-600 hover:bg-pink-700 text-white"
                                onClick={handleExport}
                                disabled={isExporting}
                            >
                                <ImageIcon className="w-4 h-4" />
                                {isExporting ? "Generando..." : "Exportar PNG HD"}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Right Column: Editor & Preview */}
                <motion.div
                    className="lg:col-span-8 flex flex-col gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Textarea Input */}
                    <Card className="flex-1 min-h-[200px] border-border/50">
                        <CardHeader className="py-2 px-4 flex flex-row items-center justify-between border-b bg-muted/40">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Code2 className="w-4 h-4" /> Editor de Código
                            </CardTitle>
                            <Button size="sm" variant="ghost" className="h-8 gap-1" onClick={handleCopyCode}>
                                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? "Copiado" : "Copiar"}
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <textarea
                                className="w-full h-full min-h-[200px] p-4 bg-transparent border-none resize-y focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                spellCheck={false}
                                placeholder="Pega tu código aquí..."
                            />
                        </CardContent>
                    </Card>

                    {/* Visual Preview (What gets captured) */}
                    <Card className="overflow-hidden bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/5c/Image_checkerboard.png')] bg-repeat relative">
                        <div className="p-4 bg-muted/90 backdrop-blur-sm border-b flex items-center justify-between">
                            <span className="text-sm font-medium">Previsualización (Render)</span>
                        </div>

                        <div className="flex items-center justify-center p-8 overflow-auto min-h-[300px]">
                            {/* This is the container we actually capture */}
                            <div
                                ref={snippetRef}
                                className={`transition-all duration-300 ease-out bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500`}
                                style={{ padding: `${padding}px` }}
                            >
                                <div className={`relative shadow-2xl rounded-xl overflow-hidden ${getThemeStyles()} min-w-[300px] max-w-[800px]`}>

                                    {/* MacOS style window controls */}
                                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/20">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                    </div>

                                    <div className="p-6 overflow-hidden">
                                        <pre className={`language-${language} !bg-transparent !m-0 !p-0 !text-sm`}>
                                            <code className={`language-${language}`}>
                                                {code}
                                            </code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                </motion.div>
            </div>
        </div>
    );
}
