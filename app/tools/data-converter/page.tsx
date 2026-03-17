"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HardDrive, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Unit = "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "KiB" | "MiB" | "GiB" | "TiB" | "PiB";

const decimalUnits: Unit[] = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
const binaryUnits: Unit[] = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB"];

const unitMultipliers: Record<Unit, number> = {
    Bytes: 1,
    // Decimal (base 1000)
    KB: 1000,
    MB: 1000 ** 2,
    GB: 1000 ** 3,
    TB: 1000 ** 4,
    PB: 1000 ** 5,
    // Binary (base 1024)
    KiB: 1024,
    MiB: 1024 ** 2,
    GiB: 1024 ** 3,
    TiB: 1024 ** 4,
    PiB: 1024 ** 5,
};

export default function DataConverterPage() {
    const [value, setValue] = useState("1");
    const [fromUnit, setFromUnit] = useState<Unit>("GB");
    const [system, setSystem] = useState<"decimal" | "binary">("decimal");

    const parseValue = (str: string): number => {
        const num = parseFloat(str);
        return isNaN(num) ? 0 : num;
    };

    const convertToBytes = (val: number, unit: Unit): number => {
        return val * unitMultipliers[unit];
    };

    const convertFromBytes = (bytes: number, unit: Unit): number => {
        return bytes / unitMultipliers[unit];
    };

    const bytes = convertToBytes(parseValue(value), fromUnit);

    const availableUnits = system === "decimal" ? decimalUnits : binaryUnits;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-sky-500/10 rounded-lg">
                        <HardDrive className="w-6 h-6 text-sky-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Conversor de Unidades de Datos</h1>
                </div>
                <p className="text-muted-foreground">
                    Convierte entre Bytes, KB, MB, GB, TB con precisión binaria (KiB) y decimal (KB).
                </p>
            </motion.div>

            <div className="space-y-6">
                {/* Sistema de unidades */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center gap-4"
                >
                    <Button
                        variant={system === "decimal" ? "default" : "outline"}
                        className={`${system === "decimal" ? "bg-sky-600 hover:bg-sky-700 text-white" : ""}`}
                        onClick={() => setSystem("decimal")}
                    >
                        Decimal (KB, MB, GB)
                    </Button>
                    <Button
                        variant={system === "binary" ? "default" : "outline"}
                        className={`${system === "binary" ? "bg-sky-600 hover:bg-sky-700 text-white" : ""}`}
                        onClick={() => setSystem("binary")}
                    >
                        Binario (KiB, MiB, GiB)
                    </Button>
                </motion.div>

                {/* Input */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <ArrowRightLeft className="w-4 h-4 text-sky-500" />
                                Valor a convertir
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Cantidad</label>
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg font-mono"
                                        placeholder="1"
                                        step="any"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Unidad</label>
                                    <select
                                        value={fromUnit}
                                        onChange={(e) => setFromUnit(e.target.value as Unit)}
                                        className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg"
                                    >
                                        {availableUnits.map((unit) => (
                                            <option key={unit} value={unit}>
                                                {unit}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Resultados */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {availableUnits.map((unit, index) => {
                        const convertedValue = convertFromBytes(bytes, unit);
                        const displayValue = convertedValue.toExponential(3);
                        const normalValue = convertedValue.toLocaleString(undefined, {
                            maximumFractionDigits: 6,
                        });

                        return (
                            <motion.div
                                key={unit}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + index * 0.05 }}
                            >
                                <Card className={`border-border/50 hover:border-sky-500/50 transition-colors ${
                                    unit === fromUnit ? "bg-sky-500/10 border-sky-500/30" : ""
                                }`}>
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <HardDrive className="w-4 h-4 text-sky-500" />
                                            <h3 className="text-sm font-semibold text-muted-foreground">{unit}</h3>
                                        </div>
                                        <p className="text-2xl font-bold text-foreground mb-1 break-all">
                                            {convertedValue < 0.000001 || convertedValue > 999999
                                                ? displayValue
                                                : normalValue}
                                        </p>
                                        {unit === fromUnit && (
                                            <p className="text-xs text-sky-500 font-medium">(Unidad original)</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20"
                >
                    <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">💡 Diferencia:</strong> El sistema decimal (KB, MB, GB) usa base 1000,
                        mientras que el binario (KiB, MiB, GiB) usa base 1024. Los sistemas operativos suelen usar binario, mientras
                        que los fabricantes de discos usan decimal. Por ejemplo, 1 GB = 1,000,000,000 bytes, pero 1 GiB = 1,073,741,824 bytes.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
