"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileCode, Copy, CheckCircle2, ArrowRightLeft, Download, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Base64Page() {
    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleEncode = () => {
        try {
            const encoded = btoa(unescape(encodeURIComponent(input)));
            setOutput(encoded);
            setError(null);
        } catch (e) {
            setError("Error al codificar el texto");
            setOutput("");
        }
    };

    const handleDecode = () => {
        try {
            const decoded = decodeURIComponent(escape(atob(input)));
            setOutput(decoded);
            setError(null);
        } catch (e) {
            setError("Base64 inválido o corrupto");
            setOutput("");
        }
    };

    const handleProcess = () => {
        if (!input.trim()) {
            setOutput("");
            setError(null);
            return;
        }

        if (mode === "encode") {
            handleEncode();
        } else {
            handleDecode();
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

    const handleSwap = () => {
        setMode(mode === "encode" ? "decode" : "encode");
        setInput(output);
        setOutput("");
        setError(null);
    };

    const handleFileEncode = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(",")[1]; // Remove data:*/*;base64, prefix
            setInput("");
            setOutput(base64);
            setMode("decode");
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-teal-500/10 rounded-lg">
                        <FileCode className="w-6 h-6 text-teal-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Base64 Encoder/Decoder</h1>
                </div>
                <p className="text-muted-foreground">
                    Codifica y decodifica texto o archivos en Base64. Fundamental para desarrollo web y APIs.
                </p>
            </motion.div>

            {/* Selector de modo */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center gap-4 mb-6"
            >
                <Button
                    variant={mode === "encode" ? "default" : "outline"}
                    className={`${mode === "encode" ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}`}
                    onClick={() => {
                        setMode("encode");
                        setInput("");
                        setOutput("");
                        setError(null);
                    }}
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Codificar
                </Button>

                <Button variant="ghost" size="icon" onClick={handleSwap} disabled={!output}>
                    <ArrowRightLeft className="w-5 h-5" />
                </Button>

                <Button
                    variant={mode === "decode" ? "default" : "outline"}
                    className={`${mode === "decode" ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}`}
                    onClick={() => {
                        setMode("decode");
                        setInput("");
                        setOutput("");
                        setError(null);
                    }}
                >
                    <Download className="w-4 h-4 mr-2" />
                    Decodificar
                </Button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-350px)] min-h-[500px]">
                {/* Input */}
                <motion.div
                    className="h-full"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="h-full flex flex-col border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <FileCode className="w-4 h-4 text-teal-500" />
                                {mode === "encode" ? "Texto Original" : "Base64 Codificado"}
                            </CardTitle>
                            <div className="flex gap-2">
                                {mode === "encode" && (
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileEncode}
                                        />
                                        <Button size="sm" variant="outline" className="h-8" asChild>
                                            <span>
                                                <Upload className="w-4 h-4 mr-1" />
                                                Archivo
                                            </span>
                                        </Button>
                                    </label>
                                )}
                                <Button
                                    size="sm"
                                    className="h-8 bg-teal-600 hover:bg-teal-700 text-white"
                                    onClick={handleProcess}
                                >
                                    {mode === "encode" ? "Codificar" : "Decodificar"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 relative">
                            <textarea
                                className="w-full h-full p-4 bg-transparent border-none resize-none focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed"
                                placeholder={
                                    mode === "encode"
                                        ? "Escribe o pega el texto para codificar..."
                                        : "Pega el Base64 para decodificar..."
                                }
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                spellCheck={false}
                            />
                            {error && (
                                <div className="absolute bottom-0 left-0 right-0 bg-destructive/10 border-t border-destructive/20 text-destructive text-sm px-4 py-3">
                                    <strong>Error:</strong> {error}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Output */}
                <motion.div
                    className="h-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="h-full flex flex-col border-border/50 shadow-sm bg-muted/10">
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/40">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-teal-500">
                                <FileCode className="w-4 h-4" />
                                {mode === "encode" ? "Base64 Codificado" : "Texto Decodificado"}
                            </CardTitle>
                            <Button
                                size="sm"
                                variant={copied ? "default" : "outline"}
                                className={`h-8 gap-1.5 ${copied ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}`}
                                onClick={handleCopy}
                                disabled={!output}
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" /> ¡Copiado!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" /> Copiar
                                    </>
                                )}
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-auto">
                            {output ? (
                                <div className="p-4 font-mono text-sm leading-relaxed break-all text-teal-400/90">
                                    {output}
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
                                    <FileCode className="w-16 h-16 mb-4 opacity-20" />
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
