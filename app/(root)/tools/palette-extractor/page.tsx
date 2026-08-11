"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Palette, Upload, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ColorItem {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
    count: number;
    percentage: number;
}

function rgbToHex(r: number, g: number, b: number) {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function quantizeColor(r: number, g: number, b: number, bits = 4) {
    const step = 1 << bits;
    return [Math.round(r / step) * step, Math.round(g / step) * step, Math.round(b / step) * step];
}

function extractPalette(imageData: ImageData, maxColors: number): ColorItem[] {
    const counts: Record<string, { r: number; g: number; b: number; count: number }> = {};
    const data = imageData.data;
    const total = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a < 128) continue;
        const [r, g, b] = quantizeColor(data[i], data[i+1], data[i+2]);
        const key = `${r},${g},${b}`;
        if (counts[key]) counts[key].count++;
        else counts[key] = { r, g, b, count: 1 };
    }

    return Object.values(counts)
        .sort((a, b) => b.count - a.count)
        .slice(0, maxColors)
        .map(({ r, g, b, count }) => ({
            hex: rgbToHex(r, g, b),
            rgb: { r, g, b },
            hsl: rgbToHsl(r, g, b),
            count,
            percentage: Math.round((count / total) * 100),
        }));
}

export default function PaletteExtractorPage() {
    const [palette, setPalette] = useState<ColorItem[]>([]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [maxColors, setMaxColors] = useState(8);
    const [copied, setCopied] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const processImage = useCallback((file: File) => {
        setProcessing(true);
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current!;
            const MAX = 400;
            let w = img.naturalWidth, h = img.naturalHeight;
            if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, w, h);
            const imageData = ctx.getImageData(0, 0, w, h);
            const colors = extractPalette(imageData, maxColors);
            setPalette(colors);
            setProcessing(false);
        };
        img.src = url;
    }, [maxColors]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file?.type.startsWith("image/")) processImage(file);
    };

    const copyToClipboard = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <canvas ref={canvasRef} className="hidden" />
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-pink-500/10 rounded-lg">
                        <Palette className="w-6 h-6 text-pink-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Extractor de Paleta</h1>
                </div>
                <p className="text-muted-foreground">Extrae los colores dominantes de cualquier imagen. Obtén los valores en HEX, RGB y HSL.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Upload + preview */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-4">
                    <div
                        onDrop={handleDrop}
                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                            isDragging ? "border-pink-500 bg-pink-500/10" : "border-border/50 hover:border-pink-500/50 hover:bg-pink-500/5"
                        }`}
                    >
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) processImage(f); }} />
                        {imageUrl ? (
                            <img src={imageUrl} alt="uploaded" className="max-h-48 mx-auto rounded-lg object-contain" />
                        ) : (
                            <>
                                <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                                <p className="font-medium">Sube una imagen</p>
                                <p className="text-sm text-muted-foreground">PNG, JPG, WebP, GIF</p>
                            </>
                        )}
                    </div>

                    <Card className="border-border/50">
                        <CardContent className="p-4">
                            <label className="text-sm font-medium block mb-2">
                                Número de colores: <span className="text-pink-500">{maxColors}</span>
                            </label>
                            <input type="range" min="3" max="16" value={maxColors}
                                onChange={e => setMaxColors(Number(e.target.value))}
                                className="w-full" />
                            {imageUrl && (
                                <Button className="w-full mt-3 bg-pink-600 hover:bg-pink-700 text-white" size="sm"
                                    onClick={() => fileInputRef.current?.click()} disabled={processing}>
                                    {processing ? "Procesando..." : "Cambiar imagen"}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Palette grid */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
                    {palette.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground border border-dashed border-border/30 rounded-xl p-12">
                            <div className="text-center">
                                <Palette className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>La paleta aparecerá aquí</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Color strip */}
                            <div className="flex rounded-xl overflow-hidden h-16 shadow-lg">
                                {palette.map(c => (
                                    <div key={c.hex} style={{ backgroundColor: c.hex, flex: c.count }} title={c.hex} />
                                ))}
                            </div>

                            {/* Color list */}
                            <div className="space-y-2">
                                {palette.map((color, i) => (
                                    <motion.div
                                        key={color.hex}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                    >
                                        <Card className="border-border/50">
                                            <CardContent className="p-3 flex items-center gap-3">
                                                <div
                                                    className="w-12 h-12 rounded-lg flex-shrink-0 shadow-md border border-border/20"
                                                    style={{ backgroundColor: color.hex }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-mono text-sm font-bold">{color.hex.toUpperCase()}</span>
                                                        <span className="text-xs text-muted-foreground">{color.percentage}%</span>
                                                    </div>
                                                    <div className="flex gap-3 text-xs text-muted-foreground font-mono">
                                                        <span>rgb({color.rgb.r},{color.rgb.g},{color.rgb.b})</span>
                                                        <span>hsl({color.hsl.h},{color.hsl.s}%,{color.hsl.l}%)</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    {[
                                                        { label: "HEX", value: color.hex.toUpperCase() },
                                                        { label: "RGB", value: `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})` },
                                                        { label: "HSL", value: `hsl(${color.hsl.h},${color.hsl.s}%,${color.hsl.l}%)` },
                                                    ].map(({ label, value }) => (
                                                        <button
                                                            key={label}
                                                            onClick={() => copyToClipboard(value, `${color.hex}-${label}`)}
                                                            className="px-2 py-1 text-xs rounded border border-border/50 hover:bg-muted/50 transition-colors flex items-center gap-1"
                                                        >
                                                            {copied === `${color.hex}-${label}` ? (
                                                                <Check className="w-3 h-3 text-green-500" />
                                                            ) : (
                                                                <Copy className="w-3 h-3" />
                                                            )}
                                                            {label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Export all */}
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => copyToClipboard(palette.map(c => c.hex.toUpperCase()).join(", "), "all")}
                            >
                                {copied === "all" ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                                Copiar todos los HEX
                            </Button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
