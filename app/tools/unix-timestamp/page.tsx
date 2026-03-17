"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UnixTimestampPage() {
    const [mode, setMode] = useState<"toUnix" | "fromUnix">("toUnix");
    const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0, 16));
    const [timestampInput, setTimestampInput] = useState(Math.floor(Date.now() / 1000).toString());

    const handleDateToUnix = () => {
        const date = new Date(dateInput);
        return Math.floor(date.getTime() / 1000);
    };

    const handleUnixToDate = () => {
        const timestamp = parseInt(timestampInput);
        if (isNaN(timestamp)) return new Date();

        // Detectar si es en milisegundos o segundos
        const date = timestamp > 10000000000 ? new Date(timestamp) : new Date(timestamp * 1000);
        return date;
    };

    const currentUnix = handleDateToUnix();
    const currentDate = handleUnixToDate();

    const formatDate = (date: Date) => {
        return {
            iso: date.toISOString(),
            local: date.toLocaleString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }),
            utc: date.toUTCString(),
        };
    };

    const formattedDate = formatDate(currentDate);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-fuchsia-500/10 rounded-lg">
                        <Clock className="w-6 h-6 text-fuchsia-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Unix Timestamp Converter</h1>
                </div>
                <p className="text-muted-foreground">
                    Convierte fechas normales a timestamp Unix y viceversa. Esencial para bases de datos y APIs.
                </p>
            </motion.div>

            <div className="space-y-6">
                {/* Selector de modo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center gap-4"
                >
                    <Button
                        variant={mode === "toUnix" ? "default" : "outline"}
                        className={`${mode === "toUnix" ? "bg-fuchsia-600 hover:bg-fuchsia-700 text-white" : ""}`}
                        onClick={() => setMode("toUnix")}
                    >
                        <Calendar className="w-4 h-4 mr-2" />
                        Fecha → Unix
                    </Button>
                    <Button
                        variant={mode === "fromUnix" ? "default" : "outline"}
                        className={`${mode === "fromUnix" ? "bg-fuchsia-600 hover:bg-fuchsia-700 text-white" : ""}`}
                        onClick={() => setMode("fromUnix")}
                    >
                        <Clock className="w-4 h-4 mr-2" />
                        Unix → Fecha
                    </Button>
                </motion.div>

                {/* Input según modo */}
                {mode === "toUnix" ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="border-b bg-muted/20">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-fuchsia-500" />
                                    Selecciona fecha y hora
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="text-sm font-medium mb-2 block">Fecha y hora local</label>
                                        <input
                                            type="datetime-local"
                                            value={dateInput}
                                            onChange={(e) => setDateInput(e.target.value)}
                                            className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-lg"
                                        />
                                    </div>
                                    <Button
                                        onClick={() => setDateInput(new Date().toISOString().slice(0, 16))}
                                        variant="outline"
                                    >
                                        Ahora
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="border-b bg-muted/20">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-fuchsia-500" />
                                    Ingresa timestamp Unix
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="text-sm font-medium mb-2 block">Timestamp (segundos desde 1970)</label>
                                        <input
                                            type="number"
                                            value={timestampInput}
                                            onChange={(e) => setTimestampInput(e.target.value)}
                                            className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-lg font-mono"
                                            placeholder="1234567890"
                                        />
                                    </div>
                                    <Button
                                        onClick={() => setTimestampInput(Math.floor(Date.now() / 1000).toString())}
                                        variant="outline"
                                    >
                                        Ahora
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Resultados */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Timestamp Unix */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-border/50 shadow-sm bg-gradient-to-br from-fuchsia-500/5 to-purple-500/5">
                            <CardHeader className="border-b bg-muted/20">
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-fuchsia-500" />
                                    Unix Timestamp
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Segundos</p>
                                    <div className="bg-muted/50 rounded-lg p-4 font-mono text-2xl font-bold break-all border border-border/30">
                                        {mode === "toUnix" ? currentUnix : timestampInput}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Milisegundos</p>
                                    <div className="bg-muted/50 rounded-lg p-4 font-mono text-lg font-semibold break-all border border-border/30">
                                        {mode === "toUnix" ? currentUnix * 1000 : parseInt(timestampInput) * 1000}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Fecha formateada */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="border-border/50 shadow-sm bg-gradient-to-br from-purple-500/5 to-pink-500/5">
                            <CardHeader className="border-b bg-muted/20">
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-purple-500" />
                                    Fecha Formateada
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Local</p>
                                    <div className="bg-muted/50 rounded-lg p-4 text-base font-medium border border-border/30">
                                        {formattedDate.local}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">ISO 8601</p>
                                    <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm break-all border border-border/30">
                                        {formattedDate.iso}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">UTC</p>
                                    <div className="bg-muted/50 rounded-lg p-4 text-sm border border-border/30">
                                        {formattedDate.utc}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20"
                >
                    <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">💡 ¿Qué es Unix Timestamp?</strong> Es el número de segundos
                        transcurridos desde el 1 de enero de 1970 a las 00:00:00 UTC (época Unix). Se usa ampliamente en
                        bases de datos, APIs y sistemas operativos para representar fechas de forma estándar.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
