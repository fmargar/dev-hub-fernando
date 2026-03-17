"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, Copy, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TextEncryptorPage() {
    const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
    const [input, setInput] = useState("");
    const [password, setPassword] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Implementación simple de encriptación using Web Crypto API
    const encryptText = async () => {
        if (!input.trim() || !password) {
            setError("Ingresa texto y contraseña");
            return;
        }

        try {
            setError(null);

            // Generar key desde password
            const encoder = new TextEncoder();
            const data = encoder.encode(input);
            const passwordData = encoder.encode(password);

            // Hash de la contraseña
            const keyMaterial = await crypto.subtle.importKey(
                "raw",
                passwordData,
                "PBKDF2",
                false,
                ["deriveBits", "deriveKey"]
            );

            const salt = crypto.getRandomValues(new Uint8Array(16));

            const key = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: salt,
                    iterations: 100000,
                    hash: "SHA-256",
                },
                keyMaterial,
                { name: "AES-GCM", length: 256 },
                false,
                ["encrypt"]
            );

            const iv = crypto.getRandomValues(new Uint8Array(12));

            const encrypted = await crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                key,
                data
            );

            // Combinar salt + iv + encrypted data
            const resultArray = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
            resultArray.set(salt, 0);
            resultArray.set(iv, salt.length);
            resultArray.set(new Uint8Array(encrypted), salt.length + iv.length);

            // Convertir a Base64
            const base64 = btoa(String.fromCharCode(...resultArray));
            setOutput(base64);
        } catch (e) {
            setError("Error al encriptar");
            console.error(e);
        }
    };

    const decryptText = async () => {
        if (!input.trim() || !password) {
            setError("Ingresa texto cifrado y contraseña");
            return;
        }

        try {
            setError(null);

            // Decodificar Base64
            const encrypted = Uint8Array.from(atob(input), (c) => c.charCodeAt(0));

            // Extraer salt, iv, y data
            const salt = encrypted.slice(0, 16);
            const iv = encrypted.slice(16, 28);
            const data = encrypted.slice(28);

            const encoder = new TextEncoder();
            const passwordData = encoder.encode(password);

            const keyMaterial = await crypto.subtle.importKey(
                "raw",
                passwordData,
                "PBKDF2",
                false,
                ["deriveBits", "deriveKey"]
            );

            const key = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: salt,
                    iterations: 100000,
                    hash: "SHA-256",
                },
                keyMaterial,
                { name: "AES-GCM", length: 256 },
                false,
                ["decrypt"]
            );

            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                data
            );

            const decoder = new TextDecoder();
            const result = decoder.decode(decrypted);
            setOutput(result);
        } catch (e) {
            setError("Error al desencriptar. Verifica la contraseña.");
            setOutput("");
            console.error(e);
        }
    };

    const handleProcess = () => {
        if (mode === "encrypt") {
            encryptText();
        } else {
            decryptText();
        }
    };

    const handleCopy = async () => {
        if (!output) return;
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-rose-500/10 rounded-lg">
                        <Lock className="w-6 h-6 text-rose-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Encriptador de Texto</h1>
                </div>
                <p className="text-muted-foreground">
                    Encripta mensajes con AES-256 usando una contraseña. Perfecto para compartir información sensible.
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
                    variant={mode === "encrypt" ? "default" : "outline"}
                    className={`${mode === "encrypt" ? "bg-rose-600 hover:bg-rose-700 text-white" : ""}`}
                    onClick={() => {
                        setMode("encrypt");
                        setInput("");
                        setOutput("");
                        setError(null);
                    }}
                >
                    <Lock className="w-4 h-4 mr-2" />
                    Encriptar
                </Button>

                <Button
                    variant={mode === "decrypt" ? "default" : "outline"}
                    className={`${mode === "decrypt" ? "bg-rose-600 hover:bg-rose-700 text-white" : ""}`}
                    onClick={() => {
                        setMode("decrypt");
                        setInput("");
                        setOutput("");
                        setError(null);
                    }}
                >
                    <Unlock className="w-4 h-4 mr-2" />
                    Desencriptar
                </Button>
            </motion.div>

            <div className="space-y-6">
                {/* Contraseña */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Contraseña de Encriptación</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-base font-mono"
                                placeholder="Ingresa una contraseña segura..."
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Input y Output */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-border/50 shadow-sm h-[400px] flex flex-col">
                            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/20">
                                <CardTitle className="text-sm font-medium">
                                    {mode === "encrypt" ? "Texto Original" : "Texto Encriptado"}
                                </CardTitle>
                                <Button
                                    size="sm"
                                    className="h-8 bg-rose-600 hover:bg-rose-700 text-white"
                                    onClick={handleProcess}
                                    disabled={!password || !input}
                                >
                                    {mode === "encrypt" ? "Encriptar" : "Desencriptar"}
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 relative">
                                <textarea
                                    className="w-full h-full p-4 bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-sm leading-relaxed"
                                    placeholder={
                                        mode === "encrypt"
                                            ? "Escribe el mensaje que deseas encriptar..."
                                            : "Pega el texto encriptado aquí..."
                                    }
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    spellCheck={false}
                                />
                                {error && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-destructive/10 border-t border-destructive/20 text-destructive text-sm px-4 py-3">
                                        <strong>Error:</strong> {error}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Output */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="border-border/50 shadow-sm bg-muted/10 h-[400px] flex flex-col">
                            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/40">
                                <CardTitle className="text-sm font-medium text-rose-500">
                                    {mode === "encrypt" ? "Texto Encriptado" : "Texto Desencriptado"}
                                </CardTitle>
                                <Button
                                    size="sm"
                                    variant={copied ? "default" : "outline"}
                                    className={`h-8 gap-1.5 ${copied ? "bg-rose-600 hover:bg-rose-700 text-white" : ""}`}
                                    onClick={handleCopy}
                                    disabled={!output}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" /> ¡Copiado!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" /> Copiar
                                        </>
                                    )}
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 overflow-auto">
                                {output ? (
                                    <div className="p-4 text-sm leading-relaxed break-all text-rose-400/90 font-mono">
                                        {output}
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
                                        {mode === "encrypt" ? (
                                            <Lock className="w-16 h-16 mb-4 opacity-20" />
                                        ) : (
                                            <Unlock className="w-16 h-16 mb-4 opacity-20" />
                                        )}
                                        <p className="text-sm">El resultado aparecerá aquí</p>
                                    </div>
                                )}
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
                        <strong className="text-foreground">🔒 Seguridad:</strong> Utiliza encriptación AES-256-GCM
                        con derivación de claves PBKDF2 (100,000 iteraciones). Todo el procesamiento ocurre localmente
                        en tu navegador. Nunca compartas tu contraseña por canales inseguros.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
