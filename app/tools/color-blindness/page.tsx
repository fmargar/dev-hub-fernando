"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Upload, Download, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FILTERS = [
    {
        id: "normal",
        label: "Normal",
        description: "Visión normal",
        matrix: [1,0,0,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0],
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
    {
        id: "deuteranopia",
        label: "Deuteranopia",
        description: "Ceguera al verde (8% hombres)",
        matrix: [0.625,0.375,0,0,0, 0.7,0.3,0,0,0, 0,0.3,0.7,0,0, 0,0,0,1,0],
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
    {
        id: "protanopia",
        label: "Protanopia",
        description: "Ceguera al rojo (1% hombres)",
        matrix: [0.567,0.433,0,0,0, 0.558,0.442,0,0,0, 0,0.242,0.758,0,0, 0,0,0,1,0],
        color: "text-red-500",
        bg: "bg-red-500/10",
    },
    {
        id: "tritanopia",
        label: "Tritanopia",
        description: "Ceguera al azul (raro)",
        matrix: [0.95,0.05,0,0,0, 0,0.433,0.567,0,0, 0,0.475,0.525,0,0, 0,0,0,1,0],
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        id: "achromatopsia",
        label: "Acromatopsia",
        description: "Sin percepción de color",
        matrix: [0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0,0,0,1,0],
        color: "text-gray-400",
        bg: "bg-gray-500/10",
    },
    {
        id: "deuteranomaly",
        label: "Deuteranomalía",
        description: "Visión débil al verde",
        matrix: [0.8,0.2,0,0,0, 0.258,0.742,0,0,0, 0,0.142,0.858,0,0, 0,0,0,1,0],
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
    },
    {
        id: "protanomaly",
        label: "Protanomalía",
        description: "Visión débil al rojo",
        matrix: [0.817,0.183,0,0,0, 0.333,0.667,0,0,0, 0,0.125,0.875,0,0, 0,0,0,1,0],
        color: "text-pink-500",
        bg: "bg-pink-500/10",
    },
    {
        id: "tritanomaly",
        label: "Tritanomalía",
        description: "Visión débil al azul",
        matrix: [0.967,0.033,0,0,0, 0,0.733,0.267,0,0, 0,0.183,0.817,0,0, 0,0,0,1,0],
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
    },
];

function applyColorMatrix(imageData: ImageData, matrix: number[]): ImageData {
    const data = imageData.data;
    const result = new ImageData(imageData.width, imageData.height);
    const out = result.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
        out[i]   = Math.min(255, Math.max(0, matrix[0]*r + matrix[1]*g + matrix[2]*b + matrix[3]*a + matrix[4]*255));
        out[i+1] = Math.min(255, Math.max(0, matrix[5]*r + matrix[6]*g + matrix[7]*b + matrix[8]*a + matrix[9]*255));
        out[i+2] = Math.min(255, Math.max(0, matrix[10]*r + matrix[11]*g + matrix[12]*b + matrix[13]*a + matrix[14]*255));
        out[i+3] = a;
    }
    return result;
}

export default function ColorBlindnessPage() {
    const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [activeFilter, setActiveFilter] = useState("normal");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const offscreenRef = useRef<HTMLCanvasElement | null>(null);

    const renderFilter = useCallback((img: HTMLImageElement, filterId: string) => {
        const canvas = canvasRef.current;
        if (!canvas || !img) return;

        const MAX = 900;
        let w = img.naturalWidth, h = img.naturalHeight;
        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);

        const filter = FILTERS.find(f => f.id === filterId);
        if (!filter || filterId === "normal") return;

        const imageData = ctx.getImageData(0, 0, w, h);
        const processed = applyColorMatrix(imageData, filter.matrix);
        ctx.putImageData(processed, 0, 0);
    }, []);

    useEffect(() => {
        if (originalImage) renderFilter(originalImage, activeFilter);
    }, [activeFilter, originalImage, renderFilter]);

    const loadImage = (file: File) => {
        setOriginalFile(file);
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            setOriginalImage(img);
            renderFilter(img, activeFilter);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file?.type.startsWith("image/")) loadImage(file);
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        const filter = FILTERS.find(f => f.id === activeFilter);
        link.download = `${filter?.id ?? "filtered"}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    const currentFilter = FILTERS.find(f => f.id === activeFilter)!;

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Eye className="w-6 h-6 text-purple-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Simulador de Daltonismo</h1>
                </div>
                <p className="text-muted-foreground">
                    Sube una imagen y visualiza cómo la perciben personas con distintos tipos de daltonismo. Procesado 100% local.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Panel de filtros */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="xl:col-span-1 space-y-3"
                >
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Eye className="w-4 h-4 text-purple-500" />
                                Tipos de visión
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 space-y-1.5">
                            {FILTERS.map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                        activeFilter === filter.id
                                            ? `${filter.bg} border border-current/20 ${filter.color}`
                                            : "hover:bg-muted/40"
                                    }`}
                                >
                                    <div className={`font-medium text-sm ${activeFilter === filter.id ? filter.color : ""}`}>
                                        {filter.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        {filter.description}
                                    </div>
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Panel principal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="xl:col-span-3 space-y-4"
                >
                    {!originalImage ? (
                        <div
                            onDrop={handleDrop}
                            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all duration-300 ${
                                isDragging
                                    ? "border-purple-500 bg-purple-500/10"
                                    : "border-border/50 hover:border-purple-500/50 hover:bg-purple-500/5"
                            }`}
                        >
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadImage(f); }} />
                            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-lg font-medium mb-1">Arrastra tu imagen aquí</p>
                            <p className="text-sm text-muted-foreground">o haz clic para seleccionar (PNG, JPG, WebP)</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Cabecera con filter activo */}
                            <div className="flex items-center justify-between">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${currentFilter.bg} ${currentFilter.color}`}>
                                    <Eye className="w-4 h-4" />
                                    <span className="text-sm font-semibold">{currentFilter.label}</span>
                                    <span className="text-xs opacity-70">— {currentFilter.description}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => { setOriginalImage(null); setOriginalFile(null); }}>
                                        <RefreshCw className="w-4 h-4 mr-1" /> Nueva imagen
                                    </Button>
                                    <Button size="sm" onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700 text-white">
                                        <Download className="w-4 h-4 mr-1" /> Descargar
                                    </Button>
                                </div>
                            </div>

                            {/* Canvas resultado */}
                            <Card className="border-border/50 overflow-hidden">
                                <CardContent className="p-4 flex justify-center">
                                    <canvas
                                        ref={canvasRef}
                                        className="max-w-full max-h-[600px] rounded-lg object-contain"
                                        style={{ imageRendering: "crisp-edges" }}
                                    />
                                </CardContent>
                            </Card>

                            {/* Grid comparación: todos los filtros en miniatura */}
                            <Card className="border-border/50">
                                <CardHeader className="py-3 px-4 border-b bg-muted/20">
                                    <CardTitle className="text-sm font-medium">Comparación rápida — selecciona para ampliar</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-4 gap-3">
                                        {FILTERS.map(filter => (
                                            <ThumbnailCanvas
                                                key={filter.id}
                                                filter={filter}
                                                image={originalImage}
                                                isActive={activeFilter === filter.id}
                                                onClick={() => setActiveFilter(filter.id)}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

function ThumbnailCanvas({ filter, image, isActive, onClick }: {
    filter: typeof FILTERS[0];
    image: HTMLImageElement;
    isActive: boolean;
    onClick: () => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return;
        const SIZE = 200;
        let w = image.naturalWidth, h = image.naturalHeight;
        if (w > h) { h = Math.round(h * SIZE / w); w = SIZE; }
        else { w = Math.round(w * SIZE / h); h = SIZE; }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(image, 0, 0, w, h);
        if (filter.id !== "normal") {
            const imageData = ctx.getImageData(0, 0, w, h);
            const processed = applyColorMatrix(imageData, filter.matrix);
            ctx.putImageData(processed, 0, 0);
        }
    }, [filter, image]);

    return (
        <button
            onClick={onClick}
            className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                isActive ? `border-current ${filter.color}` : "border-border/30 hover:border-border"
            }`}
        >
            <canvas ref={canvasRef} className="w-full h-auto block" />
            <div className={`absolute bottom-0 left-0 right-0 py-1 px-1.5 text-[10px] font-semibold text-center ${filter.bg} ${filter.color} backdrop-blur-sm`}>
                {filter.label}
            </div>
        </button>
    );
}
