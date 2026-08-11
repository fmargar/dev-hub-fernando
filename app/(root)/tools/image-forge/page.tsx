"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Type, Download, Settings, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Types
type ImageFormat = "image/png" | "image/jpeg" | "image/webp" | "image/avif";

export default function ImageForgePage() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Settings state
    const [format, setFormat] = useState<ImageFormat>("image/webp");
    const [quality, setQuality] = useState<number>(85);
    const [scale, setScale] = useState<number>(100);

    // Processing state
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const [processedSize, setProcessedSize] = useState<number | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Clean up Object URLs to prevent memory leaks
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

        if (selectedFile) {
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setPreviewUrl(null);
        }
    };

    const processImage = async () => {
        if (!file || !previewUrl) return;

        setIsProcessing(true);

        try {
            // Create an image element to read dimensions and draw
            const img = new Image();
            img.src = previewUrl;

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const canvas = canvasRef.current;
            if (!canvas) throw new Error("Canvas reference not found");

            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Could not get 2D context");

            // Calculate new dimensions
            const scaleFactor = scale / 100;
            canvas.width = img.width * scaleFactor;
            canvas.height = img.height * scaleFactor;

            // Draw and scale on canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Convert to requested format
            const blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob(
                    (b) => resolve(b),
                    format,
                    quality / 100
                );
            });

            if (blob) {
                if (processedUrl) URL.revokeObjectURL(processedUrl);
                const newUrl = URL.createObjectURL(blob);
                setProcessedUrl(newUrl);
                setProcessedSize(blob.size);
            }
        } catch (error) {
            console.error("Error processing image:", error);
            // Ideally show a toast notification here
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!processedUrl || !file) return;

        const extension = format.split('/')[1];
        const originalName = file.name.split('.')[0];
        const newFilename = `${originalName}-forge.${extension}`;

        const a = document.createElement("a");
        a.href = processedUrl;
        a.download = newFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Helper formats
    const formatName = format.split('/')[1].toUpperCase();
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
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Type className="w-6 h-6 text-purple-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Image Forge</h1>
                </div>
                <p className="text-muted-foreground">
                    Convierte, comprime y redimensiona imágenes instantáneamente en tu navegador.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Upload & Settings */}
                <motion.div
                    className="lg:col-span-1 space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Imagen Original</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FileDropzone
                                onFileSelect={handleFileSelect}
                                selectedFile={file}
                                accept={{
                                    'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif']
                                }}
                                acceptLabel="Arrastra una imagen (PNG, JPG, WebP)"
                            />
                        </CardContent>
                    </Card>

                    <Card className={!file ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Settings className="w-4 h-4" />
                                Ajustes de Forja
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Format Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Formato de Salida</label>
                                <Select value={format} onValueChange={(v: string | null) => { if (v) setFormat(v as ImageFormat) }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona formato" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="image/webp">WebP (Recomendado)</SelectItem>
                                        <SelectItem value="image/avif">AVIF (Máxima Compresión)</SelectItem>
                                        <SelectItem value="image/jpeg">JPEG</SelectItem>
                                        <SelectItem value="image/png">PNG (Sin Pérdida)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Quality Slider (Not applicable for PNG usually, but kept for simplicity) */}
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium">Calidad ({quality}%)</label>
                                </div>
                                <Slider
                                    value={[quality]}
                                    onValueChange={(v: number | readonly number[]) => {
                                        const values = Array.isArray(v) ? v : (typeof v === 'number' ? [v] : []);
                                        if (values.length > 0) setQuality(values[0]);
                                    }}
                                    max={100}
                                    step={1}
                                    disabled={format === "image/png"}
                                />
                            </div>

                            {/* Scale Slider */}
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium">Escala ({scale}%)</label>
                                </div>
                                <Slider
                                    value={[scale]}
                                    onValueChange={(v: number | readonly number[]) => {
                                        const values = Array.isArray(v) ? v : (typeof v === 'number' ? [v] : []);
                                        if (values.length > 0) setScale(values[0]);
                                    }}
                                    min={10}
                                    max={100}
                                    step={5}
                                />
                            </div>

                            <Button
                                className="w-full gap-2"
                                onClick={processImage}
                                disabled={!file || isProcessing}
                            >
                                {isProcessing ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Type className="w-4 h-4" />
                                )}
                                {isProcessing ? "Procesando..." : "Forjar Imagen"}
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
                                    Descargar {formatName}
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="flex-1 flex items-center justify-center p-6 bg-grid-white/[0.02] relative">

                            {!file ? (
                                <div className="flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-2 border-dashed border-muted rounded-xl w-full h-full max-h-[400px]">
                                    <Type className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Sube una imagen para ver la vista previa</p>
                                </div>
                            ) : (
                                <div className="relative w-full flex items-center justify-center max-h-[500px]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={processedUrl || previewUrl || ""}
                                        alt="Preview"
                                        className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg border border-border/50"
                                    />

                                    {isProcessing && (
                                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                                            <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Hidden Canvas for processing */}
                            <canvas ref={canvasRef} className="hidden" />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
