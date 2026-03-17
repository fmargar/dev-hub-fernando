"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Copy, Check, AlertCircle, Clock, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface JWTParts {
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
    signature: string;
    isExpired: boolean;
    expiresAt: Date | null;
}

function base64UrlDecode(str: string): string {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    const pad = str.length % 4;
    if (pad) str += "=".repeat(4 - pad);
    try {
        return decodeURIComponent(
            atob(str).split("").map(c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")
        );
    } catch {
        return atob(str);
    }
}

function decodeJWT(token: string): JWTParts | null {
    try {
        const parts = token.trim().split(".");
        if (parts.length !== 3) return null;
        const header = JSON.parse(base64UrlDecode(parts[0]));
        const payload = JSON.parse(base64UrlDecode(parts[1]));
        const exp = payload.exp ? new Date(payload.exp * 1000) : null;
        return {
            header,
            payload,
            signature: parts[2],
            isExpired: exp ? exp < new Date() : false,
            expiresAt: exp,
        };
    } catch {
        return null;
    }
}

function JsonView({ data }: { data: Record<string, unknown> }) {
    return (
        <div className="font-mono text-xs space-y-1 p-3 bg-muted/20 rounded-lg">
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex gap-2 flex-wrap">
                    <span className="text-blue-400">"{key}"</span>
                    <span className="text-muted-foreground">:</span>
                    <span className={typeof value === "string" ? "text-green-400" : typeof value === "number" ? "text-orange-400" : "text-purple-400"}>
                        {typeof value === "string" ? `"${value}"` : String(value)}
                    </span>
                    {key === "exp" && typeof value === "number" && (
                        <span className="text-muted-foreground">({new Date(value * 1000).toLocaleString()})</span>
                    )}
                    {key === "iat" && typeof value === "number" && (
                        <span className="text-muted-foreground">({new Date(value * 1000).toLocaleString()})</span>
                    )}
                </div>
            ))}
        </div>
    );
}

const EXAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZlcm5hbmRvIE1hcnTDrW5leiIsImlhdCI6MTcxNjIzOTAyMiwiZXhwIjo5OTk5OTk5OTk5fQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function JWTDecoderPage() {
    const [token, setToken] = useState("");
    const [decoded, setDecoded] = useState<JWTParts | null>(null);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const handleDecode = (value: string) => {
        setToken(value);
        if (!value.trim()) { setDecoded(null); setError(false); return; }
        const result = decodeJWT(value);
        setDecoded(result);
        setError(!result);
    };

    const copy = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
    };

    const parts = token.trim().split(".");

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-amber-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">JWT Decoder</h1>
                </div>
                <p className="text-muted-foreground">Decodifica y analiza tokens JWT. Visualiza header, payload, firma y fechas de expiración.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">Token JWT</CardTitle>
                            <Button size="sm" variant="outline" onClick={() => handleDecode(EXAMPLE_JWT)}>
                                Usar ejemplo
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4">
                            <textarea
                                value={token}
                                onChange={e => handleDecode(e.target.value)}
                                placeholder="Pega tu token JWT aquí..."
                                className="w-full h-40 px-3 py-2 bg-muted/20 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs resize-none"
                            />
                            {token && (
                                <div className="mt-3 flex gap-1 flex-wrap">
                                    {parts.length >= 1 && (
                                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-mono truncate max-w-[30%]">{parts[0]}</span>
                                    )}
                                    {parts.length >= 2 && <span className="text-muted-foreground">.</span>}
                                    {parts.length >= 2 && (
                                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-mono truncate max-w-[30%]">{parts[1]}</span>
                                    )}
                                    {parts.length >= 3 && <span className="text-muted-foreground">.</span>}
                                    {parts.length >= 3 && (
                                        <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-xs font-mono truncate max-w-[30%]">{parts[2]}</span>
                                    )}
                                </div>
                            )}
                            {error && (
                                <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    Token JWT inválido o malformado
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Signature info */}
                    {decoded && (
                        <Card className="border-border/50">
                            <CardHeader className="py-3 px-4 border-b bg-muted/20 flex flex-row items-center gap-2">
                                <Hash className="w-4 h-4 text-cyan-500" />
                                <CardTitle className="text-sm font-medium text-cyan-400">Firma (Signature)</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <p className="font-mono text-xs text-cyan-400/80 break-all bg-muted/20 p-3 rounded-lg">{decoded.signature}</p>
                                <p className="text-xs text-muted-foreground mt-2">La firma no puede verificarse sin la clave secreta.</p>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>

                {/* Decoded */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
                    {decoded ? (
                        <>
                            {/* Status */}
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                                decoded.isExpired
                                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                                    : "bg-green-500/10 border-green-500/30 text-green-400"
                            }`}>
                                <Clock className="w-5 h-5" />
                                <div>
                                    <p className="font-semibold text-sm">
                                        {decoded.isExpired ? "Token EXPIRADO" : "Token VÁLIDO"}
                                    </p>
                                    {decoded.expiresAt && (
                                        <p className="text-xs opacity-80">
                                            {decoded.isExpired ? "Expiró" : "Expira"}: {decoded.expiresAt.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Header */}
                            <Card className="border-red-500/20">
                                <CardHeader className="py-3 px-4 border-b bg-red-500/5 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-red-400">Header</CardTitle>
                                    <button onClick={() => copy(JSON.stringify(decoded.header, null, 2), "header")}>
                                        {copied === "header" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <JsonView data={decoded.header as Record<string, unknown>} />
                                </CardContent>
                            </Card>

                            {/* Payload */}
                            <Card className="border-purple-500/20">
                                <CardHeader className="py-3 px-4 border-b bg-purple-500/5 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-purple-400">Payload</CardTitle>
                                    <button onClick={() => copy(JSON.stringify(decoded.payload, null, 2), "payload")}>
                                        {copied === "payload" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <JsonView data={decoded.payload as Record<string, unknown>} />
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground border border-dashed border-border/30 rounded-xl p-12 min-h-[300px]">
                            <div className="text-center">
                                <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>El token decodificado aparecerá aquí</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
