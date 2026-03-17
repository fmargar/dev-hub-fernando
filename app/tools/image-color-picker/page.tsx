"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Pipette, Upload, Copy, Check, ZoomIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PickedColor {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
    x: number;
    y: number;
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

export default function ImageColorPickerPage() {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [hoveredColor, setHoveredColor] = useState<PickedColor | null>(null);
    const [pickedColors, setPickedColors] = useState<PickedColor[]>([]);
    const [copied, setCopied] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [zoom, setZoom] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const loadImage = (file: File) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            imageRef.current = img;
            const canvas = canvasRef.current!;
            const MAX = 900;
            let w = img.naturalWidth, h = img.naturalHeight;
            if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, w, h);
            setImageLoaded(true);
            setPickedColors([]);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    const getColorAtPoint = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = Math.round((e.clientX - rect.left) * scaleX);
        const y = Math.round((e.clientY - rect.top) * scaleY);
        const ctx = canvas.getContext("2d")!;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const [r, g, b] = [pixel[0], pixel[1], pixel[2]];
        return { hex: rgbToHex(r, g, b), rgb: { r, g, b }, hsl: rgbToHsl(r, g, b), x, y };
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        setHoveredColor(getColorAtPoint(e));
    }, [getColorAtPoint]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const color = getColorAtPoint(e);
        setPickedColors(prev => [color, ...prev.filter(c => c.hex !== color.hex)].slice(0, 12));
    }, [getColorAtPoint]);

    const copyToClipboard = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <Pipette className="w-6 h-6 text-cyan-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Color Picker desde Imagen</h1>
                </div>
                <p className="text-muted-foreground">Haz click en cualquier punto de la imagen para capturar su color en HEX, RGB y HSL.</p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Canvas */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="xl:col-span-3">
                    {!imageLoaded ? (
                        <div
                            onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) loadImage(f); }}
                            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-20 text-center cursor-pointer transition-all ${isDragging ? "border-cyan-500 bg-cyan-500/10" : "border-border/50 hover:border-cyan-500/50"}`}
                        >
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadImage(f); }} />
                            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-lg font-medium">Arrastra o sube una imagen</p>
                            <p className="text-sm text-muted-foreground mt-1">Luego haz clic en cualquier punto</p>
                        </div>
                    ) : (
                        <Card className="border-border/50 overflow-hidden">
                            <CardHeader className="py-2 px-4 border-b bg-muted/20 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Pipette className="w-4 h-4 text-cyan-500" />
                                    <span className="text-sm font-medium">Haz clic para capturar colores</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {hoveredColor && (
                                        <div className="flex items-center gap-2 text-xs font-mono">
                                            <div className="w-4 h-4 rounded border border-border/50" style={{ backgroundColor: hoveredColor.hex }} />
                                            <span>{hoveredColor.hex.toUpperCase()}</span>
                                        </div>
                                    )}
                                    <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="w-3 h-3 mr-1" /> Cambiar
                                    </Button>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadImage(f); }} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div ref={containerRef} className="relative">
                                    <canvas
                                        ref={canvasRef}
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={() => setHoveredColor(null)}
                                        onClick={handleClick}
                                        className="w-full h-auto rounded-lg cursor-crosshair max-h-[600px] object-contain"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>

                {/* Colores capturados */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
                    {/* Color hover actual */}
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Color bajo cursor</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div
                                className="w-full h-20 rounded-lg mb-3 border border-border/20 transition-all duration-100"
                                style={{ backgroundColor: hoveredColor?.hex ?? "#888888" }}
                            />
                            {hoveredColor ? (
                                <div className="space-y-1 text-xs font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">HEX</span>
                                        <span className="font-bold">{hoveredColor.hex.toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">RGB</span>
                                        <span>{hoveredColor.rgb.r},{hoveredColor.rgb.g},{hoveredColor.rgb.b}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">HSL</span>
                                        <span>{hoveredColor.hsl.h}°,{hoveredColor.hsl.s}%,{hoveredColor.hsl.l}%</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground text-center">Mueve el cursor sobre la imagen</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Historial */}
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">Colores capturados</CardTitle>
                            {pickedColors.length > 0 && (
                                <button onClick={() => setPickedColors([])} className="text-xs text-muted-foreground hover:text-foreground">Limpiar</button>
                            )}
                        </CardHeader>
                        <CardContent className="p-3">
                            {pickedColors.length === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-4">Haz clic en la imagen para capturar colores</p>
                            ) : (
                                <div className="space-y-1.5">
                                    {pickedColors.map((color, i) => (
                                        <div key={`${color.hex}-${i}`} className="flex items-center gap-2 group">
                                            <div className="w-8 h-8 rounded border border-border/20 flex-shrink-0" style={{ backgroundColor: color.hex }} />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-mono text-xs font-bold">{color.hex.toUpperCase()}</div>
                                                <div className="font-mono text-[10px] text-muted-foreground">
                                                    rgb({color.rgb.r},{color.rgb.g},{color.rgb.b})
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(color.hex.toUpperCase(), color.hex)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                            >
                                                {copied === color.hex ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
