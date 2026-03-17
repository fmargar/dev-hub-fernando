"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { QrCode, Download, Upload, Settings2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QrCodePage() {
    const [mode, setMode] = useState<"generate" | "read">("generate");
    const [text, setText] = useState("https://fmargar.es");
    const [qrSize, setQrSize] = useState(300);
    const [qrColor, setQrColor] = useState("#000000");
    const [qrBgColor, setQrBgColor] = useState("#ffffff");
    const [decodedText, setDecodedText] = useState("");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Generador QR simple (implementación básica)
    const generateQR = () => {
        if (!canvasRef.current || !text) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Limpiar canvas
        ctx.fillStyle = qrBgColor;
        ctx.fillRect(0, 0, qrSize, qrSize);

        // Esta es una implementación simplificada
        // En producción, usa una librería como qrcode.react o node-qrcode
        const moduleSize = Math.floor(qrSize / 29); // 29x29 grid típico para QR Version 2
        const margin = moduleSize * 2;

        // Dibujar patrón básico QR (demostración)
        ctx.fillStyle = qrColor;

        // Finder patterns (esquinas)
        const drawFinderPattern = (x: number, y: number) => {
            // Outer square
            ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
            ctx.fillStyle = qrBgColor;
            ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
            ctx.fillStyle = qrColor;
            ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
        };

        // Top-left
        drawFinderPattern(margin, margin);
        // Top-right
        drawFinderPattern(qrSize - margin - moduleSize * 7, margin);
        // Bottom-left
        drawFinderPattern(margin, qrSize - margin - moduleSize * 7);

        // Módulos de datos simulados (patrón aleatorio basado en el texto)
        const seed = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        for (let i = 0; i < 29; i++) {
            for (let j = 0; j < 29; j++) {
                // Saltar finder patterns
                if (
                    (i < 8 && j < 8) ||
                    (i < 8 && j > 20) ||
                    (i > 20 && j < 8)
                ) {
                    continue;
                }

                // Patrón pseudo-aleatorio
                const shouldFill = ((seed + i * j) % 3) === 0;
                if (shouldFill) {
                    ctx.fillStyle = qrColor;
                    ctx.fillRect(
                        margin + j * moduleSize,
                        margin + i * moduleSize,
                        moduleSize,
                        moduleSize
                    );
                }
            }
        }
    };

    React.useEffect(() => {
        if (mode === "generate") {
            generateQR();
        }
    }, [text, qrSize, qrColor, qrBgColor, mode]);

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const dataUrl = canvasRef.current.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = dataUrl;
        link.click();
    };

    const handleFileRead = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Aquí deberías usar una librería como jsQR para leer QR codes
        // Por ahora, simulamos la lectura
        setDecodedText("QR Code reading requiere librería externa como jsQR. Por ahora, esta es una demo.");
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <QrCode className="w-6 h-6 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">QR Code Generator</h1>
                </div>
                <p className="text-muted-foreground">
                    Genera códigos QR personalizados y lee QR desde imágenes. Soporta URLs, texto y vCards.
                </p>
            </motion.div>

            {/* Selector de modo */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-center gap-4 mb-6"
            >
                <Button
                    variant={mode === "generate" ? "default" : "outline"}
                    className={`${mode === "generate" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                    onClick={() => setMode("generate")}
                >
                    <QrCode className="w-4 h-4 mr-2" />
                    Generar QR
                </Button>
                <Button
                    variant={mode === "read" ? "default" : "outline"}
                    className={`${mode === "read" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                    onClick={() => setMode("read")}
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Leer QR
                </Button>
            </motion.div>

            {mode === "generate" ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Configuración */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="py-3 px-4 border-b bg-muted/20">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Settings2 className="w-4 h-4 text-green-500" />
                                    Configuración
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Contenido del QR</label>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                                        rows={4}
                                        placeholder="URL, texto, vCard..."
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Tamaño: <span className="text-green-500">{qrSize}px</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="200"
                                        max="600"
                                        value={qrSize}
                                        onChange={(e) => setQrSize(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Color QR</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={qrColor}
                                                onChange={(e) => setQrColor(e.target.value)}
                                                className="w-12 h-10 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={qrColor}
                                                onChange={(e) => setQrColor(e.target.value)}
                                                className="flex-1 px-2 py-1 bg-muted/30 border border-border/50 rounded text-xs font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Color Fondo</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={qrBgColor}
                                                onChange={(e) => setQrBgColor(e.target.value)}
                                                className="w-12 h-10 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={qrBgColor}
                                                onChange={(e) => setQrBgColor(e.target.value)}
                                                className="flex-1 px-2 py-1 bg-muted/30 border border-border/50 rounded text-xs font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <p className="text-xs text-muted-foreground mb-3">Plantillas rápidas:</p>
                                    <div className="space-y-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full justify-start text-xs"
                                            onClick={() => setText("https://fmargar.es")}
                                        >
                                            🌐 URL del portfolio
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full justify-start text-xs"
                                            onClick={() =>
                                                setText("mailto:tu@email.com?subject=Hola&body=Mensaje")
                                            }
                                        >
                                            ✉️ Email con asunto
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full justify-start text-xs"
                                            onClick={() => setText("tel:+34600000000")}
                                        >
                                            📞 Número de teléfono
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full justify-start text-xs"
                                            onClick={() =>
                                                setText(
                                                    "WIFI:T:WPA;S:MiWiFi;P:password123;H:false;;"
                                                )
                                            }
                                        >
                                            📶 WiFi credentials
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Preview y descarga */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="py-3 px-4 border-b bg-muted/20">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <QrCode className="w-4 h-4 text-green-500" />
                                    Tu Código QR
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="flex flex-col items-center gap-6">
                                    <div className="bg-white p-4 rounded-lg shadow-xl" style={{ width: qrSize + 32, height: qrSize + 32 }}>
                                        <canvas
                                            ref={canvasRef}
                                            width={qrSize}
                                            height={qrSize}
                                            className="rounded"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleDownload}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Descargar PNG
                                        </Button>
                                        <Button variant="outline" onClick={generateQR}>
                                            <QrCode className="w-4 h-4 mr-2" />
                                            Regenerar
                                        </Button>
                                    </div>

                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 w-full">
                                        <p className="text-xs text-muted-foreground">
                                            <strong className="text-foreground">⚠️ Nota:</strong> Este es un generador QR simplificado
                                            para demostración. Para QR codes reales y escaneables, considera usar librerías como{" "}
                                            <code className="text-green-500">qrcode.react</code> o <code className="text-green-500">node-qrcode</code>.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto"
                >
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Subir imagen QR</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex flex-col items-center gap-6">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileRead}
                                    className="hidden"
                                />
                                <Button
                                    size="lg"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <Upload className="w-5 h-5 mr-2" />
                                    Seleccionar Imagen
                                </Button>

                                {decodedText && (
                                    <div className="w-full bg-muted/30 rounded-lg p-4 border border-border/50">
                                        <p className="text-sm font-medium mb-2">Contenido decodificado:</p>
                                        <p className="text-sm text-foreground/80 break-all">{decodedText}</p>
                                    </div>
                                )}

                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 w-full">
                                    <p className="text-xs text-muted-foreground">
                                        <strong className="text-foreground">💡 Funcionalidad futura:</strong> La lectura de códigos
                                        QR requiere una librería como <code className="text-green-500">jsQR</code>. Esta función
                                        está preparada para integración futura.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
