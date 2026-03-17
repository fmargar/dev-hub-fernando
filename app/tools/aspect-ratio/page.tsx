"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Monitor, Copy, Check, ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const COMMON_RATIOS = [
    { label: "16:9", w: 16, h: 9, uses: "HD Video, Monitors, YouTube" },
    { label: "4:3", w: 4, h: 3, uses: "Old TV, iPad" },
    { label: "21:9", w: 21, h: 9, uses: "Ultrawide, Cinematic" },
    { label: "1:1", w: 1, h: 1, uses: "Instagram, Square" },
    { label: "9:16", w: 9, h: 16, uses: "Reels, Stories, TikTok" },
    { label: "3:2", w: 3, h: 2, uses: "DSLR Cameras, 35mm" },
    { label: "2:3", w: 2, h: 3, uses: "Portrait photos" },
    { label: "4:5", w: 4, h: 5, uses: "Instagram Portrait" },
    { label: "5:4", w: 5, h: 4, uses: "Large Format Camera" },
];

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

function simplifyRatio(w: number, h: number): [number, number] {
    const d = gcd(Math.round(w), Math.round(h));
    return [Math.round(w / d), Math.round(h / d)];
}

export default function AspectRatioPage() {
    const [width, setWidth] = useState("1920");
    const [height, setHeight] = useState("1080");
    const [newWidth, setNewWidth] = useState("1280");
    const [newHeight, setNewHeight] = useState("");
    const [copied, setCopied] = useState<string | null>(null);

    const ratio = useMemo(() => {
        const w = parseFloat(width), h = parseFloat(height);
        if (!w || !h || isNaN(w) || isNaN(h)) return null;
        const [rw, rh] = simplifyRatio(w, h);
        return { w: rw, h: rh, decimal: w / h, label: `${rw}:${rh}` };
    }, [width, height]);

    const scaled = useMemo(() => {
        if (!ratio) return null;
        const nw = parseFloat(newWidth), nh = parseFloat(newHeight);
        if (nw && !isNaN(nw)) return { w: nw, h: Math.round(nw / ratio.decimal) };
        if (nh && !isNaN(nh)) return { w: Math.round(nh * ratio.decimal), h: nh };
        return null;
    }, [ratio, newWidth, newHeight]);

    const copy = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
    };

    const loadPreset = (pw: number, ph: number) => {
        setWidth(String(pw * 100));
        setHeight(String(ph * 100));
        setNewWidth("1280");
        setNewHeight("");
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-sky-500/10 rounded-lg">
                        <Monitor className="w-6 h-6 text-sky-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Calculadora de Aspect Ratio</h1>
                </div>
                <p className="text-muted-foreground">Calcula y escala dimensiones manteniendo la proporción. Ideal para imágenes, vídeos y diseño responsive.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main calculator */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-4">
                    {/* Input dimensions */}
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Dimensiones originales</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-muted-foreground mb-1 block">Ancho (px)</label>
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={e => setWidth(e.target.value)}
                                        className="w-full px-3 py-2 bg-muted/20 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm"
                                    />
                                </div>
                                <div className="flex flex-col items-center justify-center pt-5">
                                    <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-muted-foreground mb-1 block">Alto (px)</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={e => setHeight(e.target.value)}
                                        className="w-full px-3 py-2 bg-muted/20 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm"
                                    />
                                </div>
                            </div>

                            {ratio && (
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <div className="flex-1 bg-sky-500/10 border border-sky-500/30 rounded-xl p-4 text-center">
                                        <div className="text-3xl font-bold text-sky-400 font-mono">{ratio.label}</div>
                                        <div className="text-xs text-muted-foreground mt-1">Ratio simplificado</div>
                                    </div>
                                    <div className="flex-1 bg-muted/20 border border-border/30 rounded-xl p-4 text-center">
                                        <div className="text-3xl font-bold font-mono">{ratio.decimal.toFixed(4)}</div>
                                        <div className="text-xs text-muted-foreground mt-1">Ratio decimal (w/h)</div>
                                    </div>
                                    <div className="flex-1 bg-muted/20 border border-border/30 rounded-xl p-4 text-center">
                                        <div className="text-3xl font-bold font-mono">{(1 / ratio.decimal).toFixed(4)}</div>
                                        <div className="text-xs text-muted-foreground mt-1">Ratio inverso (h/w)</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Visual representation */}
                    {ratio && (
                        <Card className="border-border/50">
                            <CardHeader className="py-3 px-4 border-b bg-muted/20">
                                <CardTitle className="text-sm font-medium">Visualización</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 flex items-center justify-center">
                                <div className="relative" style={{
                                    width: `${Math.min(400, 400 * ratio.decimal > 300 ? 400 : 400 * ratio.decimal)}px`,
                                    height: `${Math.min(300, 400 / ratio.decimal > 300 ? 300 : 400 / ratio.decimal)}px`,
                                    maxWidth: "100%",
                                }}>
                                    <div className="absolute inset-0 border-2 border-sky-500/60 rounded-lg bg-sky-500/10">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-sky-400 font-bold text-lg font-mono">{ratio.label}</div>
                                                <div className="text-muted-foreground text-xs">{width} × {height}</div>
                                            </div>
                                        </div>
                                        {/* Grid lines */}
                                        <div className="absolute inset-0 opacity-20" style={{
                                            backgroundImage: "linear-gradient(to right, #0ea5e9 1px, transparent 1px), linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)",
                                            backgroundSize: "33.33% 33.33%"
                                        }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Scale tool */}
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Escalar manteniendo proporción</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-muted-foreground mb-1 block">Nuevo ancho</label>
                                    <input
                                        type="number"
                                        value={newWidth}
                                        onChange={e => { setNewWidth(e.target.value); setNewHeight(""); }}
                                        placeholder="ej: 1280"
                                        className="w-full px-3 py-2 bg-muted/20 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm"
                                    />
                                </div>
                                <div className="flex flex-col items-center justify-center pt-5 text-muted-foreground text-sm">o</div>
                                <div className="flex-1">
                                    <label className="text-xs text-muted-foreground mb-1 block">Nuevo alto</label>
                                    <input
                                        type="number"
                                        value={newHeight}
                                        onChange={e => { setNewHeight(e.target.value); setNewWidth(""); }}
                                        placeholder="ej: 720"
                                        className="w-full px-3 py-2 bg-muted/20 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm"
                                    />
                                </div>
                            </div>
                            {scaled && (
                                <div className="mt-4 bg-sky-500/10 border border-sky-500/30 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <div className="text-sky-400 font-mono font-bold text-xl">{scaled.w} × {scaled.h}</div>
                                        <div className="text-xs text-muted-foreground">Resultado escalado</div>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => copy(`${scaled.w}x${scaled.h}`, "scaled")}>
                                        {copied === "scaled" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Presets */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Formatos comunes</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                            <div className="space-y-2">
                                {COMMON_RATIOS.map(preset => {
                                    const isActive = ratio?.label === `${preset.w}:${preset.h}` || ratio?.label === `${preset.h}:${preset.w}`;
                                    return (
                                        <button
                                            key={preset.label}
                                            onClick={() => loadPreset(preset.w, preset.h)}
                                            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all border ${
                                                isActive
                                                    ? "bg-sky-500/10 border-sky-500/40 text-sky-400"
                                                    : "border-transparent hover:bg-muted/40"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Mini ratio visual */}
                                                <div
                                                    className={`flex-shrink-0 border-2 rounded ${isActive ? "border-sky-500/60" : "border-border/50"}`}
                                                    style={{
                                                        width: `${Math.min(32, 32 * preset.w / preset.h)}px`,
                                                        height: `${Math.min(24, 24 * preset.h / preset.w)}px`,
                                                        minWidth: "12px",
                                                        minHeight: "8px",
                                                    }}
                                                />
                                                <div>
                                                    <div className="font-mono text-sm font-bold">{preset.label}</div>
                                                    <div className="text-xs text-muted-foreground">{preset.uses}</div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
