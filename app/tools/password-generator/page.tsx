"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, Copy, CheckCircle2, RefreshCw, Shield, AlertTriangle, Lock, Clock } from "lucide-react";
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

    // Calcular tiempo de descifrado por fuerza bruta
    const calculateBruteForceTime = () => {
        if (entropy === 0) return { online: "N/A", offline: "N/A" };

        // Número total de combinaciones posibles = 2^entropy
        const combinations = Math.pow(2, entropy);

        // Escenarios de ataque
        const onlineAttacksPerSecond = 1000; // ~1000 intentos/seg (límites de rate en servicios web)
        const offlineAttacksPerSecond = 100_000_000_000; // ~100 billones intentos/seg (GPU modernas)

        // Tiempo promedio para descifrar (la mitad de todas las combinaciones)
        const onlineSeconds = combinations / 2 / onlineAttacksPerSecond;
        const offlineSeconds = combinations / 2 / offlineAttacksPerSecond;

        const formatTime = (seconds: number) => {
            if (seconds < 1) return "Menos de 1 segundo";
            if (seconds < 60) return `${Math.round(seconds)} segundos`;
            if (seconds < 3600) return `${Math.round(seconds / 60)} minutos`;
            if (seconds < 86400) return `${Math.round(seconds / 3600)} horas`;
            if (seconds < 31536000) return `${Math.round(seconds / 86400)} días`;

            const years = seconds / 31536000;
            if (years < 1000) return `${Math.round(years)} años`;
            if (years < 1_000_000) return `${Math.round(years / 1000)} mil años`;
            if (years < 1_000_000_000) {
                const millions = Math.round(years / 1_000_000);
                return `${millions} ${millions === 1 ? 'millón' : 'millones'} de años`;
            }
            if (years < 1_000_000_000_000) {
                const billions = Math.round(years / 1_000_000_000);
                return `${billions} mil millones de años`;
            }
            if (years < 1_000_000_000_000_000) {
                const trillions = Math.round(years / 1_000_000_000_000);
                return `${trillions} ${trillions === 1 ? 'billón' : 'billones'} de años`;
            }
            if (years < 1_000_000_000_000_000_000) {
                const quadrillions = Math.round(years / 1_000_000_000_000_000);
                return `${quadrillions} ${quadrillions === 1 ? 'mil billones' : 'mil billones'} de años`;
            }

            // Para números incomprensiblemente grandes (más de 1 trillón de años)
            // El universo tiene ~14 mil millones de años, esto es inimaginablemente más grande
            return "Prácticamente infinito";
        };

        return {
            online: formatTime(onlineSeconds),
            offline: formatTime(offlineSeconds),
        };
    };

    const bruteForceTime = calculateBruteForceTime();

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
                <p className="text-muted-foreground mb-4">
                    Genera contraseñas seguras con configuración avanzada y medidor de entropía en tiempo real.
                </p>

                {/* Aviso de seguridad y privacidad */}
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 flex gap-3">
                    <Lock className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold text-green-600 dark:text-green-400 mb-1">
                            100% Privado y Seguro
                        </p>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Todas las contraseñas se generan localmente en tu navegador usando <code className="bg-muted px-1 py-0.5 rounded text-xs">crypto.getRandomValues()</code>,
                            una API criptográficamente segura. <strong>Nada se envía a ningún servidor</strong> — tu contraseña nunca sale de tu dispositivo.
                        </p>
                    </div>
                </div>
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
                            <div className="flex items-center gap-4 mb-6">
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

                            {/* Análisis visual debajo de la contraseña */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/30">
                                {/* Nivel de seguridad */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Shield className="w-4 h-4 text-red-500" />
                                        <p className="text-sm font-semibold text-foreground">Fortaleza</p>
                                    </div>
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
                                        <p className={`text-base font-bold ${strengthColor} min-w-[100px]`}>{strengthLevel}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Entropía: <span className="font-bold text-foreground">{entropy} bits</span>
                                    </p>
                                </div>

                                {/* Tiempo de descifrado */}
                                <div className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-lg p-3 border border-purple-500/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Clock className="w-4 h-4 text-purple-500" />
                                        <p className="text-sm font-semibold text-foreground">Tiempo de Fuerza Bruta</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-2 bg-background/50 rounded border border-border/30">
                                            <p className="text-[10px] text-muted-foreground mb-1">Ataque online:</p>
                                            <p className="text-sm font-bold text-foreground leading-tight">{bruteForceTime.online}</p>
                                        </div>
                                        <div className="p-2 bg-background/50 rounded border border-border/30">
                                            <p className="text-[10px] text-muted-foreground mb-1">Ataque offline:</p>
                                            <p className="text-sm font-bold text-foreground leading-tight">{bruteForceTime.offline}</p>
                                        </div>
                                    </div>
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
                        className="flex"
                    >
                        <Card className="border-border/50 shadow-sm flex-1 flex flex-col">
                            <CardHeader className="border-b bg-muted/20">
                                <CardTitle className="text-base font-medium">Configuración</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6 flex-1">
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
                                <div className="space-y-3 flex-1 flex flex-col justify-center">
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
                        className="flex"
                    >
                        <Card className="border-border/50 shadow-sm flex-1 flex flex-col">
                            <CardHeader className="border-b bg-muted/20">
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-blue-500" />
                                    Consejos de Seguridad
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                                {/* Explicación detallada */}
                                <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
                                    <div className="text-xs text-muted-foreground space-y-2">
                                        <p>• <strong>Usa contraseñas únicas</strong> para cada servicio</p>
                                        <p>• <strong>Considera un gestor de contraseñas</strong> como Bitwarden, 1Password o KeePass</p>
                                        <p>• <strong>Activa 2FA</strong> (autenticación de dos factores) cuando sea posible</p>
                                        <p>• <strong>Cambia contraseñas</strong> si sospechas que han sido comprometidas</p>
                                    </div>
                                </div>

                                {/* Información sobre los ataques */}
                                <div className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-lg p-4 border border-purple-500/20">
                                    <p className="text-xs font-semibold text-foreground mb-2">ℹ️ Sobre los tiempos de fuerza bruta:</p>
                                    <div className="text-[10px] text-muted-foreground space-y-1 leading-relaxed">
                                        <p>• <strong>Ataque online:</strong> ~1,000 intentos/seg (servicios web con rate limiting)</p>
                                        <p>• <strong>Ataque offline:</strong> ~100 billones intentos/seg (GPUs modernas con hash comprometido)</p>
                                        <p className="mt-2 pt-2 border-t border-border/30">Los tiempos son promedios. Una contraseña de 60+ bits de entropía se considera segura.</p>
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
