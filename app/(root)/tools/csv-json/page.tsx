"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileJson2, Copy, CheckCircle2, ArrowRightLeft, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CsvJsonPage() {
    const [mode, setMode] = useState<"csvToJson" | "jsonToCsv">("csvToJson");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const csvToJson = (csv: string): string => {
        const lines = csv.trim().split("\n");
        if (lines.length === 0) return "[]";

        const headers = lines[0].split(",").map((h) => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.trim());
            const obj: Record<string, string> = {};

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = values[j] || "";
            }

            data.push(obj);
        }

        return JSON.stringify(data, null, 2);
    };

    const jsonToCsv = (json: string): string => {
        const parsed = JSON.parse(json);

        if (!Array.isArray(parsed) || parsed.length === 0) {
            throw new Error("El JSON debe ser un array de objetos no vacío");
        }

        const headers = Object.keys(parsed[0]);
        const rows = [headers.join(",")];

        for (const obj of parsed) {
            const values = headers.map((header) => {
                const value = obj[header] || "";
                // Escapar comas y comillas
                return typeof value === "string" && (value.includes(",") || value.includes('"'))
                    ? `"${value.replace(/"/g, '""')}"`
                    : value;
            });
            rows.push(values.join(","));
        }

        return rows.join("\n");
    };

    const handleConvert = () => {
        if (!input.trim()) {
            setOutput("");
            setError(null);
            return;
        }

        try {
            if (mode === "csvToJson") {
                const json = csvToJson(input);
                setOutput(json);
            } else {
                const csv = jsonToCsv(input);
                setOutput(csv);
            }
            setError(null);
        } catch (e: unknown) {
            const err = e as Error;
            setError(err.message || "Error al convertir");
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

    const handleSwap = () => {
        setMode(mode === "csvToJson" ? "jsonToCsv" : "csvToJson");
        setInput(output);
        setOutput("");
        setError(null);
    };

    const handleDownload = () => {
        if (!output) return;

        const blob = new Blob([output], { type: mode === "csvToJson" ? "application/json" : "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = mode === "csvToJson" ? "output.json" : "output.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                        <FileJson2 className="w-6 h-6 text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">CSV ↔ JSON Converter</h1>
                </div>
                <p className="text-muted-foreground">
                    Convierte archivos CSV a JSON y viceversa. Ideal para migración de datos y APIs.
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
                    variant={mode === "csvToJson" ? "default" : "outline"}
                    className={`${mode === "csvToJson" ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}`}
                    onClick={() => {
                        setMode("csvToJson");
                        setInput("");
                        setOutput("");
                        setError(null);
                    }}
                >
                    CSV → JSON
                </Button>

                <Button variant="ghost" size="icon" onClick={handleSwap} disabled={!output}>
                    <ArrowRightLeft className="w-5 h-5" />
                </Button>

                <Button
                    variant={mode === "jsonToCsv" ? "default" : "outline"}
                    className={`${mode === "jsonToCsv" ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}`}
                    onClick={() => {
                        setMode("jsonToCsv");
                        setInput("");
                        setOutput("");
                        setError(null);
                    }}
                >
                    JSON → CSV
                </Button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-350px)] min-h-[600px]">
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
                                <FileJson2 className="w-4 h-4 text-orange-500" />
                                {mode === "csvToJson" ? "CSV Input" : "JSON Input"}
                            </CardTitle>
                            <Button
                                size="sm"
                                className="h-8 bg-orange-600 hover:bg-orange-700 text-white"
                                onClick={handleConvert}
                            >
                                Convertir
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 relative">
                            <textarea
                                className="w-full h-full p-4 bg-transparent border-none resize-none focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed"
                                placeholder={
                                    mode === "csvToJson"
                                        ? "name,age,city\nJohn,25,Madrid\nJane,30,Barcelona"
                                        : '[{"name":"John","age":"25","city":"Madrid"}]'
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
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-500">
                                <FileJson2 className="w-4 h-4" />
                                {mode === "csvToJson" ? "JSON Output" : "CSV Output"}
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 gap-1.5"
                                    onClick={handleDownload}
                                    disabled={!output}
                                >
                                    <Download className="w-4 h-4" /> Descargar
                                </Button>
                                <Button
                                    size="sm"
                                    variant={copied ? "default" : "outline"}
                                    className={`h-8 gap-1.5 ${copied ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}`}
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
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-auto">
                            {output ? (
                                <div className="p-4 font-mono text-sm leading-relaxed text-orange-400/90 whitespace-pre-wrap">
                                    {output}
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
                                    <FileJson2 className="w-16 h-16 mb-4 opacity-20" />
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
