"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, Copy, CheckCircle2, RefreshCw, Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PasswordGeneratorPage() {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [copied, setCopied] = useState(false);

    const generatePassword = () => {
        let charset = "";
        if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
        if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (includeNumbers) charset += "0123456789";
        if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

        if (charset === "") {
            setPassword("");
            return;
        }

        let newPassword = "";
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            newPassword += charset[array[i] % charset.length];
        }

        setPassword(newPassword);
    };

    useEffect(() => {
        generatePassword();
    }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

    // Calcular entropía (bits de seguridad)
    const calculateEntropy = () => {
        let charsetSize = 0;
        if (includeLowercase) charsetSize += 26;
        if (includeUppercase) charsetSize += 26;
        if (includeNumbers) charsetSize += 10;
        if (includeSymbols) charsetSize += 28;

        if (charsetSize === 0) return 0;

        return Math.floor(length * Math.log2(charsetSize));
    };

    const entropy = calculateEntropy();

    // Nivel de seguridad
    let strengthLevel = "";
    let strengthColor = "";
    let strengthBg = "";
    if (entropy < 28) {
        strengthLevel = "Muy débil";
        strengthColor = "text-red-500";
        strengthBg = "bg-red-500";
    } else if (entropy < 36) {
        strengthLevel = "Débil";
        strengthColor = "text-orange-500";
        strengthBg = "bg-orange-500";
    } else if (entropy < 60) {
        strengthLevel = "Moderada";
        strengthColor = "text-yellow-500";
        strengthBg = "bg-yellow-500";
    } else if (entropy < 128) {
        strengthLevel = "Fuerte";
        strengthColor = "text-lime-500";
        strengthBg = "bg-lime-500";
    } else {
        strengthLevel = "Muy fuerte";
        strengthColor = "text-green-500";
        strengthBg = "bg-green-500";
    }

    const handleCopy = async () => {
        if (!password) return;
        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                        <Key className="w-6 h-6 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Generador de Contraseñas</h1>
                </div>
                <p className="text-muted-foreground">
                    Genera contraseñas seguras con configuración avanzada y medidor de entropía en tiempo real.
                </p>
            </motion.div>

            <div className="space-y-6">
                {/* Contraseña generada */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-border/50 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 bg-muted/30 rounded-lg p-4 font-mono text-2xl font-bold break-all border border-border/30">
                                    {password || "Configura las opciones..."}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button
                                        size="lg"
                                        onClick={generatePassword}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        <RefreshCw className="w-5 h-5 mr-2" />
                                        Regenerar
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant={copied ? "default" : "outline"}
                                        className={`${copied ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                                        onClick={handleCopy}
                                        disabled={!password}
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                                ¡Copiado!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-5 h-5 mr-2" />
                                                Copiar
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Configuración */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="border-b bg-muted/20">
                                <CardTitle className="text-base font-medium">Configuración</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {/* Longitud */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Longitud: <span className="text-red-500 font-bold">{length}</span> caracteres
                                    </label>
                                    <input
                                        type="range"
                                        min="4"
                                        max="64"
                                        value={length}
                                        onChange={(e) => setLength(Number(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                        <span>4</span>
                                        <span>64</span>
                                    </div>
                                </div>

                                {/* Opciones */}
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                        <span className="text-sm font-medium">Mayúsculas (A-Z)</span>
                                        <input
                                            type="checkbox"
                                            checked={includeUppercase}
                                            onChange={(e) => setIncludeUppercase(e.target.checked)}
                                            className="w-5 h-5 rounded accent-red-500"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                        <span className="text-sm font-medium">Minúsculas (a-z)</span>
                                        <input
                                            type="checkbox"
                                            checked={includeLowercase}
                                            onChange={(e) => setIncludeLowercase(e.target.checked)}
                                            className="w-5 h-5 rounded accent-red-500"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                        <span className="text-sm font-medium">Números (0-9)</span>
                                        <input
                                            type="checkbox"
                                            checked={includeNumbers}
                                            onChange={(e) => setIncludeNumbers(e.target.checked)}
                                            className="w-5 h-5 rounded accent-red-500"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                        <span className="text-sm font-medium">Símbolos (!@#$%)</span>
                                        <input
                                            type="checkbox"
                                            checked={includeSymbols}
                                            onChange={(e) => setIncludeSymbols(e.target.checked)}
                                            className="w-5 h-5 rounded accent-red-500"
                                        />
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Métricas de seguridad */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="border-b bg-muted/20">
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-red-500" />
                                    Análisis de Seguridad
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {/* Nivel de seguridad */}
                                <div>
                                    <p className="text-sm text-muted-foreground mb-3">Nivel de seguridad</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full ${strengthBg}`}
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${entropy < 28 ? 20 : entropy < 36 ? 40 : entropy < 60 ? 60 : entropy < 128 ? 80 : 100}%`,
                                                }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                        <p className={`text-lg font-bold ${strengthColor} min-w-[120px]`}>{strengthLevel}</p>
                                    </div>
                                </div>

                                {/* Entropía */}
                                <div className="bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-lg p-4 border border-border/30">
                                    <p className="text-sm text-muted-foreground mb-2">Entropía</p>
                                    <p className="text-3xl font-bold text-foreground">
                                        {entropy} <span className="text-lg text-muted-foreground">bits</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {entropy >= 60
                                            ? "Excelente nivel de seguridad"
                                            : entropy >= 36
                                            ? "Aceptable para uso general"
                                            : "Considera aumentar la longitud"}
                                    </p>
                                </div>

                                {/* Consejos */}
                                <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
                                    <div className="flex gap-3">
                                        <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <div className="text-xs text-muted-foreground space-y-1">
                                            <p>• Usa contraseñas únicas para cada servicio</p>
                                            <p>• Considera usar un gestor de contraseñas</p>
                                            <p>• Activa autenticación de dos factores cuando sea posible</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
