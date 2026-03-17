"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, MapPin, Calendar, Aperture } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExifData {
    make?: string;
    model?: string;
    dateTime?: string;
    orientation?: number;
    software?: string;
    exposureTime?: string;
    fNumber?: string;
    iso?: number;
    focalLength?: string;
    flash?: boolean;
    latitude?: number;
    longitude?: number;
    altitude?: number;
}

export default function ExifReaderPage() {
    const [image, setImage] = useState<string | null>(null);
    const [exifData, setExifData] = useState<ExifData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            setImage(result);

            // Aquí se debería usar una librería como exifr o exif-js
            // Por ahora simulamos la extracción de metadatos
            setTimeout(() => {
                setExifData({
                    make: "Apple",
                    model: "iPhone 14 Pro",
                    dateTime: new Date().toLocaleString(),
                    orientation: 1,
                    software: "iOS 17.0",
                    exposureTime: "1/120",
                    fNumber: "f/1.8",
                    iso: 400,
                    focalLength: "26mm",
                    flash: false,
                    latitude: 36.5095,
                    longitude: -4.8824,
                    altitude: 10,
                });
                setLoading(false);
            }, 500);
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Camera className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Extractor de Metadatos EXIF</h1>
                </div>
                <p className="text-muted-foreground">
                    Lee información EXIF de tus fotos: modelo de cámara, fecha, ubicación GPS y más.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload y preview */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Subir Imagen</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <div className="flex flex-col items-center justify-center p-12 bg-muted/30 border-2 border-dashed border-border/50 rounded-lg hover:bg-muted/50 transition-colors">
                                    <Upload className="w-16 h-16 text-indigo-500 mb-3" />
                                    <p className="text-base font-medium">Seleccionar Foto</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Solo imágenes JPG con datos EXIF
                                    </p>
                                </div>
                            </label>
                        </CardContent>
                    </Card>

                    {image && (
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="py-3 px-4 border-b bg-muted/20">
                                <CardTitle className="text-sm font-medium">Vista Previa</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="w-full rounded-lg shadow-md"
                                />
                            </CardContent>
                        </Card>
                    )}

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground">
                            <strong className="text-foreground">⚠️ Nota:</strong> Esta es una demostración.
                            Para leer EXIF real, integra librerías como <code className="text-indigo-500">exifr</code> o{" "}
                            <code className="text-indigo-500">exif-js</code>. Los datos mostrados son simulados.
                        </p>
                    </div>
                </motion.div>

                {/* Metadatos */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-border/50 shadow-sm h-auto">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium text-indigo-500">
                                Metadatos EXIF
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {loading ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>Leyendo metadatos...</p>
                                </div>
                            ) : exifData ? (
                                <div className="space-y-6">
                                    {/* Cámara */}
                                    <div>
                                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <Camera className="w-4 h-4 text-indigo-500" />
                                            Información de Cámara
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="bg-muted/30 p-3 rounded">
                                                <p className="text-xs text-muted-foreground">Marca</p>
                                                <p className="font-medium">{exifData.make || "N/A"}</p>
                                            </div>
                                            <div className="bg-muted/30 p-3 rounded">
                                                <p className="text-xs text-muted-foreground">Modelo</p>
                                                <p className="font-medium">{exifData.model || "N/A"}</p>
                                            </div>
                                            <div className="bg-muted/30 p-3 rounded">
                                                <p className="text-xs text-muted-foreground">Software</p>
                                                <p className="font-medium">{exifData.software || "N/A"}</p>
                                            </div>
                                            <div className="bg-muted/30 p-3 rounded">
                                                <p className="text-xs text-muted-foreground">Fecha</p>
                                                <p className="font-medium">{exifData.dateTime || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Configuración de foto */}
                                    <div>
                                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <Aperture className="w-4 h-4 text-indigo-500" />
                                            Configuración de Captura
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="bg-muted/30 p-3 rounded">
                                                <p className="text-xs text-muted-foreground">Tiempo de exposición</p>
                                                <p className="font-medium">{exifData.exposureTime || "N/A"}</p>
                                            </div>
                                            <div className="bg-muted/30 p-3 rounded">
                                                <p className="text-xs text-muted-foreground">Apertura</p>
                                                <p className="font-medium">{exifData.fNumber || "N/A"}</p>
                                            </div>
                                            <div className="bg-muted/30 p-3 rounded">
                                                <p className="text-xs text-muted-foreground">ISO</p>
                                                <p className="font-medium">{exifData.iso || "N/A"}</p>
                                            </div>
                                            <div className="bg-muted/30 p-3 rounded">
                                                <p className="text-xs text-muted-foreground">Distancia focal</p>
                                                <p className="font-medium">{exifData.focalLength || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* GPS */}
                                    {exifData.latitude && exifData.longitude && (
                                        <div>
                                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-indigo-500" />
                                                Ubicación GPS
                                            </h3>
                                            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-lg border border-border/30">
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Latitud:</span>
                                                        <span className="font-mono">{exifData.latitude}°</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Longitud:</span>
                                                        <span className="font-mono">{exifData.longitude}°</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Altitud:</span>
                                                        <span className="font-mono">{exifData.altitude}m</span>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="w-full mt-2"
                                                        onClick={() =>
                                                            window.open(
                                                                `https://www.google.com/maps?q=${exifData.latitude},${exifData.longitude}`,
                                                                "_blank"
                                                            )
                                                        }
                                                    >
                                                        <MapPin className="w-3 h-3 mr-2" />
                                                        Ver en Google Maps
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground/50">
                                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p className="text-sm">Sube una foto para ver sus metadatos EXIF</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
