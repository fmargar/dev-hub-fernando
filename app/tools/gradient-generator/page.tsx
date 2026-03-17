"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Layers, Copy, Check, Plus, Trash2, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type GradientType = "linear" | "radial" | "conic";
type GradientStop = { color: string; position: number; id: number };

let nextId = 3;

const PRESETS = [
    { name: "Sunset", type: "linear" as GradientType, angle: 135, stops: [{ color: "#f97316", position: 0, id: 1 }, { color: "#ec4899", position: 50, id: 2 }, { color: "#8b5cf6", position: 100, id: 3 }] },
    { name: "Ocean", type: "linear" as GradientType, angle: 180, stops: [{ color: "#0ea5e9", position: 0, id: 1 }, { color: "#6366f1", position: 100, id: 2 }] },
    { name: "Forest", type: "linear" as GradientType, angle: 45, stops: [{ color: "#22c55e", position: 0, id: 1 }, { color: "#10b981", position: 50, id: 2 }, { color: "#0d9488", position: 100, id: 3 }] },
    { name: "Fire", type: "linear" as GradientType, angle: 90, stops: [{ color: "#fbbf24", position: 0, id: 1 }, { color: "#f97316", position: 50, id: 2 }, { color: "#ef4444", position: 100, id: 3 }] },
    { name: "Neon", type: "linear" as GradientType, angle: 90, stops: [{ color: "#a855f7", position: 0, id: 1 }, { color: "#06b6d4", position: 100, id: 2 }] },
    { name: "Gold", type: "radial" as GradientType, angle: 0, stops: [{ color: "#fbbf24", position: 0, id: 1 }, { color: "#92400e", position: 100, id: 2 }] },
];

export default function GradientGeneratorPage() {
    const [type, setType] = useState<GradientType>("linear");
    const [angle, setAngle] = useState(135);
    const [stops, setStops] = useState<GradientStop[]>([
        { color: "#f97316", position: 0, id: 1 },
        { color: "#8b5cf6", position: 100, id: 2 },
    ]);
    const [copied, setCopied] = useState(false);

    const buildCSS = useCallback(() => {
        const sorted = [...stops].sort((a, b) => a.position - b.position);
        const stopsStr = sorted.map(s => `${s.color} ${s.position}%`).join(", ");
        if (type === "linear") return `linear-gradient(${angle}deg, ${stopsStr})`;
        if (type === "radial") return `radial-gradient(circle, ${stopsStr})`;
        return `conic-gradient(from ${angle}deg, ${stopsStr})`;
    }, [type, angle, stops]);

    const cssValue = buildCSS();
    const fullCSS = `background: ${cssValue};`;

    const addStop = () => {
        const mid = Math.round((stops[0].position + stops[stops.length - 1].position) / 2);
        setStops(prev => [...prev, { color: "#ffffff", position: mid, id: ++nextId }]);
    };

    const updateStop = (id: number, field: keyof GradientStop, value: string | number) => {
        setStops(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const removeStop = (id: number) => {
        if (stops.length <= 2) return;
        setStops(prev => prev.filter(s => s.id !== id));
    };

    const reverseStops = () => {
        const sorted = [...stops].sort((a, b) => a.position - b.position);
        const positions = sorted.map(s => s.position);
        const reversed = [...sorted].reverse().map((s, i) => ({ ...s, position: positions[i] }));
        setStops(reversed);
    };

    const copy = async () => {
        await navigator.clipboard.writeText(fullCSS);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const loadPreset = (preset: typeof PRESETS[0]) => {
        setType(preset.type);
        setAngle(preset.angle);
        setStops(preset.stops.map(s => ({ ...s })));
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-violet-500/10 rounded-lg">
                        <Layers className="w-6 h-6 text-violet-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Generador de Gradientes CSS</h1>
                </div>
                <p className="text-muted-foreground">Crea gradientes CSS visualmente y copia el código listo para usar.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Preview */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
                    <Card className="border-border/50 overflow-hidden">
                        <div
                            className="h-64 w-full transition-all duration-300"
                            style={{ background: cssValue }}
                        />
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-3 font-mono text-sm break-all">
                                <span className="flex-1 text-xs">{fullCSS}</span>
                                <Button size="sm" onClick={copy} className="flex-shrink-0 bg-violet-600 hover:bg-violet-700 text-white">
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Presets */}
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Presets</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="grid grid-cols-3 gap-2">
                                {PRESETS.map(preset => (
                                    <button
                                        key={preset.name}
                                        onClick={() => loadPreset(preset)}
                                        className="group relative rounded-lg overflow-hidden h-14 border border-border/30 hover:border-violet-500/50 transition-all"
                                        style={{ background: (() => {
                                            const sorted = [...preset.stops].sort((a, b) => a.position - b.position);
                                            const s = sorted.map(s => `${s.color} ${s.position}%`).join(", ");
                                            return preset.type === "radial" ? `radial-gradient(circle, ${s})` : `linear-gradient(${preset.angle}deg, ${s})`;
                                        })() }}
                                    >
                                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                            {preset.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Controls */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
                    {/* Type */}
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Tipo de gradiente</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex gap-2">
                                {(["linear", "radial", "conic"] as GradientType[]).map(t => (
                                    <Button
                                        key={t}
                                        size="sm"
                                        variant={type === t ? "default" : "outline"}
                                        className={type === t ? "bg-violet-600 hover:bg-violet-700 text-white capitalize" : "capitalize"}
                                        onClick={() => setType(t)}
                                    >
                                        {t}
                                    </Button>
                                ))}
                            </div>
                            {(type === "linear" || type === "conic") && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium block mb-2">
                                        Ángulo: <span className="text-violet-500">{angle}°</span>
                                    </label>
                                    <input type="range" min="0" max="360" value={angle}
                                        onChange={e => setAngle(Number(e.target.value))} className="w-full" />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stops */}
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">Color stops</CardTitle>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={reverseStops}>
                                    <ArrowUpDown className="w-3 h-3 mr-1" /> Invertir
                                </Button>
                                <Button size="sm" variant="outline" onClick={addStop}>
                                    <Plus className="w-3 h-3 mr-1" /> Añadir
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {/* Bar preview */}
                            <div className="h-6 rounded-full w-full border border-border/20" style={{ background: cssValue }} />

                            {[...stops].sort((a, b) => a.position - b.position).map(stop => (
                                <div key={stop.id} className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={stop.color}
                                        onChange={e => updateStop(stop.id, "color", e.target.value)}
                                        className="w-10 h-10 rounded-lg cursor-pointer border border-border/30 p-0.5"
                                    />
                                    <div className="flex-1">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={stop.position}
                                            onChange={e => updateStop(stop.id, "position", Number(e.target.value))}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span className="font-mono">{stop.color}</span>
                                            <span>{stop.position}%</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeStop(stop.id)}
                                        disabled={stops.length <= 2}
                                        className="p-1.5 hover:text-red-500 disabled:opacity-30 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
