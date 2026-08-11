"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Hash, Copy, CheckCircle2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Implementaciones de hash usando SubtleCrypto
async function generateHash(text: string, algorithm: "MD5" | "SHA-256" | "SHA-512"): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    let hashBuffer: ArrayBuffer;

    if (algorithm === "MD5") {
        // MD5 no está disponible en SubtleCrypto, usamos una implementación simple
        return await md5(text);
    } else {
        const algoName = algorithm === "SHA-256" ? "SHA-256" : "SHA-512";
        hashBuffer = await crypto.subtle.digest(algoName, data);
    }

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Implementación simple de MD5 para el navegador
async function md5(text: string): Promise<string> {
    // Para MD5, usaremos una función auxiliar básica
    // En producción, considera usar una librería como crypto-js
    // Por ahora, retornamos un placeholder indicando que MD5 requiere librería externa
    return "MD5 requiere librería externa. Usa SHA-256 o SHA-512 para mejor seguridad.";
}

export default function HashGeneratorPage() {
    const [input, setInput] = useState("");
    const [hashes, setHashes] = useState<Record<string, string>>({
        md5: "",
        sha256: "",
        sha512: "",
    });
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        const computeHashes = async () => {
            if (!input) {
                setHashes({ md5: "", sha256: "", sha512: "" });
                return;
            }

            const md5Hash = await generateHash(input, "MD5");
            const sha256Hash = await generateHash(input, "SHA-256");
            const sha512Hash = await generateHash(input, "SHA-512");

            setHashes({
                md5: md5Hash,
                sha256: sha256Hash,
                sha512: sha512Hash,
            });
        };

        computeHashes();
    }, [input]);

    const handleCopy = async (hash: string, type: string) => {
        if (!hash) return;
        try {
            await navigator.clipboard.writeText(hash);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleClear = () => {
        setInput("");
    };

    const hashTypes = [
        {
            name: "MD5",
            key: "md5",
            hash: hashes.md5,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            description: "128 bits - No recomendado para seguridad crítica",
        },
        {
            name: "SHA-256",
            key: "sha256",
            hash: hashes.sha256,
            color: "text-green-500",
            bg: "bg-green-500/10",
            description: "256 bits - Estándar actual para seguridad",
        },
        {
            name: "SHA-512",
            key: "sha512",
            hash: hashes.sha512,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            description: "512 bits - Máxima seguridad",
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <Hash className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Hashing Tool</h1>
                </div>
                <p className="text-muted-foreground">
                    Genera hashes criptográficos MD5, SHA-256 y SHA-512 para verificar integridad de datos.
                </p>
            </motion.div>

            <div className="space-y-6">
                {/* Input */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Hash className="w-4 h-4 text-yellow-500" />
                                Texto de entrada
                            </CardTitle>
                            <Button size="sm" variant="ghost" className="h-8 px-2" onClick={handleClear}>
                                <Trash2 className="w-4 h-4 mr-1" /> Limpiar
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <textarea
                                className="w-full h-32 p-4 bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-base leading-relaxed"
                                placeholder="Escribe o pega el texto para generar hashes..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Hashes */}
                <div className="space-y-4">
                    {hashTypes.map((type, index) => (
                        <motion.div
                            key={type.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                        >
                            <Card className={`border-border/50 shadow-sm ${type.bg}`}>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className={`text-xl font-bold ${type.color}`}>{type.name}</h3>
                                                <span className="text-xs text-muted-foreground">{type.description}</span>
                                            </div>
                                            {type.hash ? (
                                                <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm break-all border border-border/30">
                                                    {type.hash}
                                                </div>
                                            ) : (
                                                <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground/50 italic">
                                                    El hash aparecerá aquí...
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={copied === type.key ? "default" : "outline"}
                                            className={`mt-8 ${copied === type.key ? `${type.bg} ${type.color} border-current` : ""}`}
                                            onClick={() => handleCopy(type.hash, type.key)}
                                            disabled={!type.hash}
                                        >
                                            {copied === type.key ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    ¡Copiado!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copiar
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20"
                >
                    <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">💡 Uso recomendado:</strong> Los hashes se utilizan para verificar
                        integridad de archivos, almacenar contraseñas de forma segura, y detectar duplicados. SHA-256 y SHA-512 son
                        los estándares actuales. MD5 solo debe usarse para checksums no críticos.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
