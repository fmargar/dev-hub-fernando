"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Download, RefreshCw, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Config } from "@imgly/background-removal";
import imglyRemoveBackground from "@imgly/background-removal";

export default function BGRemoverPage() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const [processedSize, setProcessedSize] = useState<number | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [statusText, setStatusText] = useState<string>("");

    // Clean up Object URLs
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            if (processedUrl) URL.revokeObjectURL(processedUrl);
        };
    }, [previewUrl, processedUrl]);

    const handleFileSelect = (selectedFile: File | null) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (processedUrl) URL.revokeObjectURL(processedUrl);

        setFile(selectedFile);
        setProcessedUrl(null);
        setProcessedSize(null);
        setProgress(0);
        setStatusText("");

        if (selectedFile) {
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setPreviewUrl(null);
        }
    };

    const processImage = async () => {
        if (!file || !previewUrl) return;

        setIsProcessing(true);
        setStatusText("Iniciando motor de IA...");
        setProgress(0);

        try {
            const config: Config = {
                progress: (key, current, total) => {
                    // Update progress depending on the loading phase
                    if (key.includes("fetch")) {
                        setStatusText("Descargando modelo IA...");
                    } else if (key.includes("compute")) {
                        setStatusText("Procesando píxeles...");
                    }
                    if (total > 0) {
                        setProgress(Math.round((current / total) * 100));
                    }
                }
            };

            // @ts-expect-error - The library's types are incorrectly defined as non-callable but it works at runtime
            const imageBlob = await imglyRemoveBackground(previewUrl, config);

            if (imageBlob) {
                if (processedUrl) URL.revokeObjectURL(processedUrl);
                const newUrl = URL.createObjectURL(imageBlob);
                setProcessedUrl(newUrl);
                setProcessedSize(imageBlob.size);
                setStatusText("¡Completado!");
            }
        } catch (error) {
            console.error("Error al remover fondo:", error);
            setStatusText("Error durante el procesamiento");
        } finally {
            setIsProcessing(false);
            setProgress(100);

            // Clear status after a while
            setTimeout(() => {
                if (statusText === "¡Completado!") {
                    setStatusText("");
                }
            }, 3000);
        }
    };

    const handleDownload = () => {
        if (!processedUrl || !file) return;

        const originalName = file.name.split('.')[0];
        const newFilename = `${originalName}-no-bg.png`; // Result is always PNG from this lib

        const a = document.createElement("a");
        a.href = processedUrl;
        a.download = newFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const formatFileSize = (bytes: number) => {
        if (!+bytes) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Layers className="w-6 h-6 text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">BG-Remover</h1>
                </div>
                <p className="text-muted-foreground">
                    Elimina el fondo de cualquier imagen utilizando Inteligencia Artificial directamente en tu navegador.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Upload & Actions */}
                <motion.div
                    className="lg:col-span-1 space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Imagen Origen</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FileDropzone
                                onFileSelect={handleFileSelect}
                                selectedFile={file}
                                accept={{
                                    'image/*': ['.png', '.jpg', '.jpeg', '.webp']
                                }}
                                acceptLabel="Arrastra una imagen (PNG, JPG, WebP)"
                            />
                        </CardContent>
                    </Card>

                    <Card className={!file ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ImageIcon className="w-4 h-4" />
                                Opciones
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {isProcessing && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{statusText}</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-2 transition-all duration-300 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground/80 mt-2">
                                        * La primera vez puede tardar un poco mientras descarga el modelo (~40MB). Luego será instantáneo.
                                    </p>
                                </div>
                            )}

                            <Button
                                className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={processImage}
                                disabled={!file || isProcessing}
                            >
                                {isProcessing ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Layers className="w-4 h-4" />
                                )}
                                {isProcessing ? "Procesando..." : "Eliminar Fondo"}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Right Column: Preview & Result */}
                <motion.div
                    className="lg:col-span-2 space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="h-full min-h-[500px] flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between py-4 bg-muted/30 border-b">
                            <div>
                                <CardTitle className="text-lg">Resultado</CardTitle>
                                {file && (
                                    <CardDescription>
                                        Original: {formatFileSize(file.size)}
                                        {processedSize && ` → Final: ${formatFileSize(processedSize)}`}
                                    </CardDescription>
                                )}
                            </div>

                            {processedUrl && (
                                <Button onClick={handleDownload} variant="secondary" size="sm" className="gap-2">
                                    <Download className="w-4 h-4" />
                                    Descargar PNG Transparente
                                </Button>
                            )}
                        </CardHeader>

                        {/* Checkerboard background to show transparency */}
                        <CardContent className="flex-1 flex items-center justify-center p-6 bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/5c/Image_checkerboard.png')] bg-repeat relative">

                            <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-0" />

                            <div className="z-10 w-full h-full flex items-center justify-center">
                                {!file ? (
                                    <div className="flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-2 border-dashed border-muted rounded-xl w-full h-full max-h-[400px] bg-background/50">
                                        <Layers className="w-12 h-12 mb-4 opacity-20" />
                                        <p>Sube una imagen para ver la magia de la IA</p>
                                    </div>
                                ) : (
                                    <div className="relative w-full flex items-center justify-center max-h-[500px]">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={processedUrl || previewUrl || ""}
                                            alt="Preview"
                                            className="max-w-full max-h-[500px] object-contain rounded-lg shadow-xl"
                                        />

                                        {isProcessing && (
                                            <div className="absolute inset-0 bg-background/40 backdrop-blur-md flex flex-col items-center justify-center rounded-lg border border-border/50">
                                                <RefreshCw className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                                                <div className="text-center">
                                                    <p className="font-semibold">{statusText}</p>
                                                    <p className="text-sm text-muted-foreground">{progress}%</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
