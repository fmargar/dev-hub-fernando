"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Download, Upload, Settings2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ImageCompressorPage() {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [compressedImage, setCompressedImage] = useState<string | null>(null);
    const [quality, setQuality] = useState(0.8);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setOriginalSize(file.size);
        const reader = new FileReader();

        reader.onload = (event) => {
            setOriginalImage(event.target?.result as string);
            setCompressedImage(null);
        };

        reader.readAsDataURL(file);
    };

    const compressImage = () => {
        if (!originalImage) return;

        setLoading(true);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    if (!blob) return;

                    setCompressedSize(blob.size);
                    const url = URL.createObjectURL(blob);
                    setCompressedImage(url);
                    setLoading(false);
                },
                "image/jpeg",
                quality
            );
        };

        img.src = originalImage;
    };

    const handleDownload = () => {
        if (!compressedImage) return;

        const link = document.createElement("a");
        link.download = "compressed-image.jpg";
        link.href = compressedImage;
        link.click();
    };

    const formatSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const savingsPercentage =
        originalSize > 0 ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-pink-500/10 rounded-lg">
                        <ImageIcon className="w-6 h-6 text-pink-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Compresor de Imágenes</h1>
                </div>
                <p className="text-muted-foreground">
                    Reduce el peso de tus imágenes manteniendo la calidad para optimizar tiempos de carga.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Configuración */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Settings2 className="w-4 h-4 text-pink-500" />
                                Configuración
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-6">
                            <div>
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <div className="flex flex-col items-center justify-center p-8 bg-muted/30 border-2 border-dashed border-border/50 rounded-lg hover:bg-muted/50 transition-colors">
                                        <Upload className="w-12 h-12 text-pink-500 mb-2" />
                                        <p className="text-sm font-medium">Subir Imagen</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            PNG, JPG, WebP
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {originalImage && (
                                <>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Calidad: <span className="text-pink-500">{Math.round(quality * 100)}%</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="1"
                                            step="0.05"
                                            value={quality}
                                            onChange={(e) => setQuality(parseFloat(e.target.value))}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                            <span>Baja</span>
                                            <span>Alta</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={compressImage}
                                        disabled={loading}
                                        className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                                    >
                                        {loading ? "Comprimiendo..." : "Comprimir Imagen"}
                                    </Button>
                                </>
                            )}

                            {compressedImage && (
                                <div className="space-y-3">
                                    <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg p-4 border border-border/30">
                                        <p className="text-xs text-muted-foreground mb-2">Resultado</p>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Original</p>
                                                <p className="text-sm font-bold">{formatSize(originalSize)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Comprimida</p>
                                                <p className="text-sm font-bold text-pink-500">
                                                    {formatSize(compressedSize)}
                                                </p>
                                            </div>
                                            <div className="pt-2 border-t border-border/30">
                                                <p className="text-xs text-muted-foreground">Ahorro</p>
                                                <p className="text-lg font-bold text-green-500">
                                                    {savingsPercentage}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button onClick={handleDownload} variant="outline" className="w-full">
                                        <Download className="w-4 h-4 mr-2" />
                                        Descargar
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Previsualización */}
                <motion.div
                    className="lg:col-span-3 space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Imagen Original */}
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="py-3 px-4 border-b bg-muted/20">
                                <CardTitle className="text-sm font-medium">Imagen Original</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 min-h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                                {originalImage ? (
                                    <img
                                        src={originalImage}
                                        alt="Original"
                                        className="max-w-full max-h-[400px] object-contain rounded"
                                    />
                                ) : (
                                    <div className="text-center text-muted-foreground/50">
                                        <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">Sube una imagen para comenzar</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Imagen Comprimida */}
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="py-3 px-4 border-b bg-muted/20">
                                <CardTitle className="text-sm font-medium text-pink-500">
                                    Imagen Comprimida
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 min-h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                                {compressedImage ? (
                                    <img
                                        src={compressedImage}
                                        alt="Compressed"
                                        className="max-w-full max-h-[400px] object-contain rounded"
                                    />
                                ) : (
                                    <div className="text-center text-muted-foreground/50">
                                        <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">La imagen comprimida aparecerá aquí</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
                        <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">💡 Tip:</strong> Para web, una calidad del 70-85%
                            suele ser óptima. Reduce el tamaño significativamente sin pérdida visible de calidad.
                            Las imágenes se procesan localmente en tu navegador, garantizando privacidad total.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
