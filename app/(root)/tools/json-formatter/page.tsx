"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Braces, Copy, CheckCircle2, FileJson, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JsonFormatterPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleFormat = () => {
        if (!input.trim()) {
            setOutput("");
            setError(null);
            return;
        }

        try {
            // Validate and format
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2); // 2 spaces indentation
            setOutput(formatted);
            setError(null);
        } catch (e: unknown) {
            const error = e as Error;
            setError(error.message || "Invalid JSON format");
            setOutput("");
        }
    };

    const handleMinify = () => {
        if (!input.trim()) {
            setOutput("");
            setError(null);
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            setOutput(minified);
            setError(null);
        } catch (e: unknown) {
            const error = e as Error;
            setError(error.message || "Invalid JSON format");
            setOutput("");
        }
    };

    const handleCopy = async () => {
        if (!output) return;
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleClear = () => {
        setInput("");
        setOutput("");
        setError(null);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Braces className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">JSON Formatter</h1>
                </div>
                <p className="text-muted-foreground">
                    Valida, formatea o minifica tus estructuras JSON de forma rápida y segura en el navegador.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
                {/* Editor Column (Input) */}
                <motion.div
                    className="h-full"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="h-full flex flex-col border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <FileJson className="w-4 h-4 text-emerald-500" />
                                Entrada JSON
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="h-8 px-2 text-muted-foreground hover:text-foreground" onClick={handleClear}>
                                    <Trash2 className="w-4 h-4 mr-1" /> Limpiar
                                </Button>
                                <Button size="sm" variant="secondary" className="h-8" onClick={handleMinify}>
                                    Minificar
                                </Button>
                                <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleFormat}>
                                    Formatear
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 relative">
                            <textarea
                                className="w-full h-full p-4 bg-transparent border-none resize-none focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed"
                                placeholder="Pega tu JSON aquí..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                spellCheck={false}
                            />
                            {error && (
                                <div className="absolute bottom-0 left-0 right-0 bg-destructive/10 border-t border-destructive/20 text-destructive text-sm px-4 py-3 flex items-start gap-2 backdrop-blur-sm">
                                    <span className="font-bold shrink-0 mt-0.5">Error:</span>
                                    <span className="break-all">{error}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Viewer Column (Output) */}
                <motion.div
                    className="h-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="h-full flex flex-col border-border/50 shadow-sm bg-muted/10 relative overflow-hidden">

                        {/* Checkerboard background wrapper */}
                        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/40 z-10">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-emerald-500">
                                <Braces className="w-4 h-4" />
                                Salida Formateada
                            </CardTitle>
                            <Button
                                size="sm"
                                variant={copied ? "default" : "outline"}
                                className={`h-8 gap-1.5 transition-all ${copied ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600" : ""}`}
                                onClick={handleCopy}
                                disabled={!output}
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" /> ¡Copiado!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" /> Copiar Result.
                                    </>
                                )}
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 relative z-10 overflow-hidden">
                            {output ? (
                                <textarea
                                    className="w-full h-full p-4 bg-transparent border-none resize-none focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed text-emerald-400/90"
                                    value={output}
                                    readOnly
                                    spellCheck={false}
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
                                    <Braces className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-sm">El resultado aparecerá aquí</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
