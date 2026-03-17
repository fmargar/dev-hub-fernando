"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileType2, Copy, CheckCircle2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SvgToDataUriPage() {
    const [svgInput, setSvgInput] = useState("");
    const [dataUri, setDataUri] = useState("");
    const [copied, setCopied] = useState(false);

    const handleConvert = () => {
        if (!svgInput.trim()) {
            setDataUri("");
            return;
        }

        // Limpiar y optimizar el SVG
        let svg = svgInput.trim();

        // Si no tiene la etiqueta SVG, no es válido
        if (!svg.includes("<svg")) {
            setDataUri("Error: El contenido no parece ser un SVG válido");
            return;
        }

        // Codificar para Data URI
        const encoded = encodeURIComponent(svg)
            .replace(/'/g, "%27")
            .replace(/"/g, "%22");

        const uri = `data:image/svg+xml,${encoded}`;
        setDataUri(uri);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const text = await file.text();
        setSvgInput(text);
    };

    const handleCopy = async () => {
        if (!dataUri) return;
        try {
            await navigator.clipboard.writeText(dataUri);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    // Vista previa del SVG
    const renderPreview = () => {
        try {
            return (
                <div
                    className="w-full h-full flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-900 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: svgInput }}
                />
            );
        } catch {
            return (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Vista previa no disponible</p>
                </div>
            );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-violet-500/10 rounded-lg">
                        <FileType2 className="w-6 h-6 text-violet-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">SVG to Data URI</h1>
                </div>
                <p className="text-muted-foreground">
                    Convierte archivos SVG en cadenas URI para usar directamente en CSS o HTML.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input SVG */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <FileType2 className="w-4 h-4 text-violet-500" />
                                SVG Input
                            </CardTitle>
                            <div className="flex gap-2">
                                <label className="cursor-pointer">
                                    <input type="file" accept=".svg" className="hidden" onChange={handleFileUpload} />
                                    <Button size="sm" variant="outline" className="h-8">
                                        <Upload className="w-4 h-4 mr-1" />
                                        Subir SVG
                                    </Button>
                                </label>
                                <Button
                                    size="sm"
                                    className="h-8 bg-violet-600 hover:bg-violet-700 text-white"
                                    onClick={handleConvert}
                                >
                                    Convertir
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <textarea
                                className="w-full h-80 p-4 bg-transparent border-none resize-none focus:outline-none focus:ring-0 font-mono text-xs leading-relaxed"
                                placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#007bff" />
</svg>'
                                value={svgInput}
                                onChange={(e) => setSvgInput(e.target.value)}
                                spellCheck={false}
                            />
                        </CardContent>
                    </Card>

                    {/* Vista previa */}
                    {svgInput && (
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="py-3 px-4 border-b bg-muted/20">
                                <CardTitle className="text-sm font-medium">Vista Previa</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="h-60">{renderPreview()}</div>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>

                {/* Output Data URI */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-border/50 shadow-sm bg-muted/10 h-full max-h-[700px] flex flex-col">
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/40">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-violet-500">
                                <FileType2 className="w-4 h-4" />
                                Data URI Output
                            </CardTitle>
                            <Button
                                size="sm"
                                variant={copied ? "default" : "outline"}
                                className={`h-8 gap-1.5 ${copied ? "bg-violet-600 hover:bg-violet-700 text-white" : ""}`}
                                onClick={handleCopy}
                                disabled={!dataUri}
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
                            {dataUri ? (
                                <div className="p-4 font-mono text-xs leading-relaxed break-all text-violet-400/90">
                                    {dataUri}
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
                                    <FileType2 className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-sm">El Data URI aparecerá aquí</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Ejemplos de uso */}
                    {dataUri && !dataUri.startsWith("Error") && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6"
                        >
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader className="py-3 px-4 border-b bg-muted/20">
                                    <CardTitle className="text-sm font-medium">Ejemplos de uso</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-2">CSS Background:</p>
                                        <code className="block bg-muted/50 p-3 rounded text-xs break-all">
                                            background-image: url(&quot;{dataUri.slice(0, 80)}...&quot;);
                                        </code>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-2">HTML Image:</p>
                                        <code className="block bg-muted/50 p-3 rounded text-xs break-all">
                                            &lt;img src=&quot;{dataUri.slice(0, 80)}...&quot; alt=&quot;SVG&quot; /&gt;
                                        </code>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
