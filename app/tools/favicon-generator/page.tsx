"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Upload, Download, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SIZES = [
    { size: 16, label: "16×16", use: "Browser tab" },
    { size: 32, label: "32×32", use: "Desktop" },
    { size: 48, label: "48×48", use: "Windows" },
    { size: 64, label: "64×64", use: "General" },
    { size: 96, label: "96×96", use: "Android" },
    { size: 128, label: "128×128", use: "Chrome Web Store" },
    { size: 144, label: "144×144", use: "Windows 8+" },
    { size: 152, label: "152×152", use: "iPad" },
    { size: 180, label: "180×180", use: "iPhone / Apple Touch" },
    { size: 192, label: "192×192", use: "Android Home Screen" },
    { size: 256, label: "256×256", use: "Windows / macOS" },
    { size: 512, label: "512×512", use: "PWA / App Store" },
];

interface FaviconItem {
    size: number;
    dataUrl: string;
}

export default function FaviconGeneratorPage() {
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [favicons, setFavicons] = useState<FaviconItem[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<Set<number>>(new Set([16, 32, 48, 64, 180, 192, 512]));
    const [padding, setPadding] = useState(0);
    const [bg, setBg] = useState("#ffffff");
    const [transparent, setTransparent] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [generating, setGenerating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateFavicons = useCallback((imgSrc: string) => {
        setGenerating(true);
        const img = new Image();
        img.onload = () => {
            const results: FaviconItem[] = [];
            for (const { size } of SIZES) {
                if (!selectedSizes.has(size)) continue;
                const canvas = document.createElement("canvas");
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext("2d")!;
                if (!transparent) {
                    ctx.fillStyle = bg;
                    ctx.fillRect(0, 0, size, size);
                }
                const pad = Math.round(size * padding / 100);
                ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
                results.push({ size, dataUrl: canvas.toDataURL("image/png") });
            }
            setFavicons(results);
            setGenerating(false);
        };
        img.src = imgSrc;
    }, [selectedSizes, padding, bg, transparent]);

    const loadImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const src = e.target?.result as string;
            setSourceImage(src);
            generateFavicons(src);
        };
        reader.readAsDataURL(file);
    };

    const downloadSingle = (item: FaviconItem) => {
        const link = document.createElement("a");
        link.download = `favicon-${item.size}x${item.size}.png`;
        link.href = item.dataUrl;
        link.click();
    };

    const downloadAll = async () => {
        // Download all as individual files
        for (const item of favicons) {
            await new Promise<void>(res => {
                setTimeout(() => {
                    const link = document.createElement("a");
                    link.download = `favicon-${item.size}x${item.size}.png`;
                    link.href = item.dataUrl;
                    link.click();
                    res();
                }, 100);
            });
        }
    };

    const toggleSize = (size: number) => {
        setSelectedSizes(prev => {
            const next = new Set(prev);
            next.has(size) ? next.delete(size) : next.add(size);
            return next;
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-rose-500/10 rounded-lg">
                        <ImageIcon className="w-6 h-6 text-rose-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Favicon Generator</h1>
                </div>
                <p className="text-muted-foreground">Genera el pack completo de favicons en todos los tamaños estándar desde cualquier imagen.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Config */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
                    {/* Upload */}
                    <div
                        onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) loadImage(f); }}
                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragging ? "border-rose-500 bg-rose-500/10" : "border-border/50 hover:border-rose-500/50"}`}
                    >
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadImage(f); }} />
                        {sourceImage ? (
                            <img src={sourceImage} alt="source" className="w-20 h-20 mx-auto rounded-xl object-contain" />
                        ) : (
                            <>
                                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm font-medium">Sube tu logo</p>
                                <p className="text-xs text-muted-foreground">PNG, SVG, JPG recomendado</p>
                            </>
                        )}
                    </div>

                    {/* Options */}
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Opciones</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" checked={transparent} onChange={e => setTransparent(e.target.checked)} className="rounded" />
                                    Fondo transparente
                                </label>
                            </div>
                            {!transparent && (
                                <div>
                                    <label className="text-sm font-medium block mb-2">Color de fondo</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-10 h-10 rounded border border-border/30 cursor-pointer" />
                                        <span className="font-mono text-sm">{bg}</span>
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium block mb-2">
                                    Padding interno: <span className="text-rose-500">{padding}%</span>
                                </label>
                                <input type="range" min="0" max="30" value={padding} onChange={e => setPadding(Number(e.target.value))} className="w-full" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Size selector */}
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Tamaños a generar</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                            <div className="space-y-1">
                                {SIZES.map(({ size, label, use }) => (
                                    <label key={size} className="flex items-center gap-2 cursor-pointer hover:bg-muted/30 rounded px-2 py-1 transition-colors">
                                        <input type="checkbox" checked={selectedSizes.has(size)} onChange={() => toggleSize(size)} className="rounded" />
                                        <span className="font-mono text-xs flex-1">{label}</span>
                                        <span className="text-xs text-muted-foreground">{use}</span>
                                    </label>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {sourceImage && (
                        <Button
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                            onClick={() => generateFavicons(sourceImage)}
                            disabled={generating}
                        >
                            {generating ? "Generando..." : "Regenerar"}
                        </Button>
                    )}
                </motion.div>

                {/* Results */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
                    {favicons.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground border border-dashed border-border/30 rounded-xl p-12 min-h-[400px]">
                            <div className="text-center">
                                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>Sube una imagen para generar los favicons</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">{favicons.length} tamaños generados</p>
                                <Button size="sm" onClick={downloadAll} className="bg-rose-600 hover:bg-rose-700 text-white">
                                    <Package className="w-4 h-4 mr-2" /> Descargar todos
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {favicons.map(item => (
                                    <motion.div
                                        key={item.size}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <Card className="border-border/50 hover:border-rose-500/30 transition-all group">
                                            <CardContent className="p-4 flex flex-col items-center gap-3">
                                                <div className="relative w-16 h-16 flex items-center justify-center">
                                                    <div className="absolute inset-0 bg-[repeating-conic-gradient(#80808020_0%_25%,transparent_0%_50%)] bg-[length:10px_10px] rounded border border-border/20" />
                                                    <img
                                                        src={item.dataUrl}
                                                        alt={`${item.size}x${item.size}`}
                                                        style={{ width: Math.min(item.size, 56), height: Math.min(item.size, 56) }}
                                                        className="relative"
                                                    />
                                                </div>
                                                <span className="font-mono text-xs text-muted-foreground">{item.size}×{item.size}</span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => downloadSingle(item)}
                                                >
                                                    <Download className="w-3 h-3 mr-1" /> Descargar
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            {/* HTML snippet */}
                            <Card className="border-border/50">
                                <CardHeader className="py-3 px-4 border-b bg-muted/20">
                                    <CardTitle className="text-sm font-medium">HTML para tu &lt;head&gt;</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <pre className="text-xs font-mono bg-muted/20 rounded-lg p-3 overflow-x-auto text-muted-foreground">{
favicons.map(f => `<link rel="icon" type="image/png" sizes="${f.size}x${f.size}" href="/favicon-${f.size}x${f.size}.png">`).join("\n")
                                    }</pre>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
