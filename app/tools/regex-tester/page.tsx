"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Regex, Copy, Check, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Match {
    index: number;
    end: number;
    text: string;
    groups: string[];
}

const FLAG_OPTIONS = [
    { flag: "g", label: "global", description: "Todas las coincidencias" },
    { flag: "i", label: "insensitive", description: "Ignorar mayúsculas" },
    { flag: "m", label: "multiline", description: "Múltiples líneas" },
    { flag: "s", label: "dotAll", description: ". coincide con \\n" },
];

const EXAMPLES = [
    { label: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "gi", test: "Contacta en info@ejemplo.com o soporte@test.org" },
    { label: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_+.~#?&/=]*)", flags: "gi", test: "Visita https://fmargar.es o http://www.google.com" },
    { label: "IP v4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g", test: "El servidor está en 192.168.1.1 y la puerta de enlace en 10.0.0.1" },
    { label: "Fecha", pattern: "\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}", flags: "g", test: "Fecha de nacimiento: 15/03/1999, expiración: 12-2026" },
    { label: "Hex Color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", flags: "gi", test: "Los colores son #ff6600, #fff y #1a2b3c" },
    { label: "Teléfono ES", pattern: "(\\+34)?[\\s.-]?[679]\\d{2}[\\s.-]?\\d{3}[\\s.-]?\\d{3}", flags: "gi", test: "Llama al +34 612 345 678 o al 987-654-321" },
];

function highlightMatches(text: string, matches: Match[]): React.ReactNode[] {
    if (!matches.length) return [text];
    const result: React.ReactNode[] = [];
    let last = 0;
    for (const m of matches) {
        if (m.index > last) result.push(text.slice(last, m.index));
        result.push(
            <mark key={m.index} className="bg-orange-500/30 text-orange-300 rounded px-0.5 border border-orange-500/50">
                {m.text}
            </mark>
        );
        last = m.end;
    }
    if (last < text.length) result.push(text.slice(last));
    return result;
}

export default function RegexTesterPage() {
    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState("gi");
    const [testText, setTestText] = useState("Escribe aquí el texto de prueba para tu expresión regular...");
    const [copied, setCopied] = useState(false);

    const { matches, error, regex } = useMemo(() => {
        if (!pattern) return { matches: [], error: null, regex: null };
        try {
            const re = new RegExp(pattern, flags);
            const ms: Match[] = [];
            if (flags.includes("g")) {
                let m;
                while ((m = re.exec(testText)) !== null) {
                    ms.push({ index: m.index, end: m.index + m[0].length, text: m[0], groups: m.slice(1) });
                    if (m[0].length === 0) re.lastIndex++;
                }
            } else {
                const m = re.exec(testText);
                if (m) ms.push({ index: m.index, end: m.index + m[0].length, text: m[0], groups: m.slice(1) });
            }
            return { matches: ms, error: null, regex: re };
        } catch (e) {
            return { matches: [], error: (e as Error).message, regex: null };
        }
    }, [pattern, flags, testText]);

    const toggleFlag = (f: string) => {
        setFlags(prev => prev.includes(f) ? prev.replace(f, "") : prev + f);
    };

    const copy = async () => {
        await navigator.clipboard.writeText(`/${pattern}/${flags}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Regex className="w-6 h-6 text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Regex Tester</h1>
                </div>
                <p className="text-muted-foreground">Prueba expresiones regulares en tiempo real con resaltado de coincidencias y grupos de captura.</p>
            </motion.div>

            {/* Examples */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2 mb-6">
                {EXAMPLES.map(ex => (
                    <button
                        key={ex.label}
                        onClick={() => { setPattern(ex.pattern); setFlags(ex.flags); setTestText(ex.test); }}
                        className="px-3 py-1.5 text-xs rounded-full border border-border/50 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all"
                    >
                        {ex.label}
                    </button>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pattern + flags */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Expresión Regular</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center gap-1 bg-muted/20 border border-border/50 rounded-lg px-3 py-2 font-mono">
                                <span className="text-muted-foreground text-lg">/</span>
                                <input
                                    type="text"
                                    value={pattern}
                                    onChange={e => setPattern(e.target.value)}
                                    placeholder="patrón aquí..."
                                    className="flex-1 bg-transparent focus:outline-none text-sm"
                                />
                                <span className="text-muted-foreground text-lg">/</span>
                                <span className="text-orange-400 font-bold">{flags}</span>
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-medium mb-2">Flags:</p>
                                <div className="flex flex-wrap gap-2">
                                    {FLAG_OPTIONS.map(({ flag, label, description }) => (
                                        <button
                                            key={flag}
                                            onClick={() => toggleFlag(flag)}
                                            className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                                                flags.includes(flag)
                                                    ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                                                    : "border-border/50 hover:border-orange-500/30"
                                            }`}
                                            title={description}
                                        >
                                            <span className="font-mono font-bold">{flag}</span>
                                            <span className="ml-1 opacity-70">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button variant="outline" size="sm" onClick={copy} className="w-full">
                                {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                                Copiar regex: /{pattern || "..."}/{flags}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Match info */}
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    matches.length > 0 ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
                                }`}>
                                    {matches.length} coincidencia{matches.length !== 1 ? "s" : ""}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {matches.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">Sin coincidencias</p>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {matches.map((m, i) => (
                                        <div key={i} className="bg-muted/20 rounded-lg px-3 py-2 font-mono text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-orange-400 font-bold">"{m.text}"</span>
                                                <span className="text-xs text-muted-foreground">pos {m.index}–{m.end}</span>
                                            </div>
                                            {m.groups.length > 0 && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Grupos: {m.groups.map((g, j) => <span key={j} className="text-purple-400 mr-2">${j+1}="{g}"</span>)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Test text with highlighting */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Texto de prueba</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <textarea
                                value={testText}
                                onChange={e => setTestText(e.target.value)}
                                className="w-full h-48 px-3 py-2 bg-muted/20 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none font-mono"
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Info className="w-4 h-4 text-orange-500" />
                                Resultado con highlight
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="font-mono text-sm whitespace-pre-wrap break-all bg-muted/20 rounded-lg p-3 min-h-[96px] leading-relaxed">
                                {pattern && !error ? highlightMatches(testText, matches) : testText}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
