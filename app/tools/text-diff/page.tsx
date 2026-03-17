"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { GitCompare, Copy, CheckCircle2, Trash2, FileText, ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type DiffType = "equal" | "added" | "removed";

interface DiffLine {
    type: DiffType;
    text: string;
    lineNumber?: number;
}

// Algoritmo simple de diff por líneas
function computeDiff(text1: string, text2: string): { left: DiffLine[]; right: DiffLine[] } {
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");

    const left: DiffLine[] = [];
    const right: DiffLine[] = [];

    let i = 0;
    let j = 0;
    let lineNum1 = 1;
    let lineNum2 = 1;

    while (i < lines1.length || j < lines2.length) {
        const line1 = lines1[i] || "";
        const line2 = lines2[j] || "";

        if (i >= lines1.length) {
            // Solo quedan líneas en text2 (añadidas)
            right.push({ type: "added", text: line2, lineNumber: lineNum2++ });
            left.push({ type: "equal", text: "", lineNumber: undefined });
            j++;
        } else if (j >= lines2.length) {
            // Solo quedan líneas en text1 (eliminadas)
            left.push({ type: "removed", text: line1, lineNumber: lineNum1++ });
            right.push({ type: "equal", text: "", lineNumber: undefined });
            i++;
        } else if (line1 === line2) {
            // Líneas iguales
            left.push({ type: "equal", text: line1, lineNumber: lineNum1++ });
            right.push({ type: "equal", text: line2, lineNumber: lineNum2++ });
            i++;
            j++;
        } else {
            // Buscar si la línea actual de text1 aparece más adelante en text2
            const foundInText2 = lines2.slice(j, j + 5).indexOf(line1);
            const foundInText1 = lines1.slice(i, i + 5).indexOf(line2);

            if (foundInText2 !== -1 && (foundInText1 === -1 || foundInText2 <= foundInText1)) {
                // line1 aparece en text2 más adelante, significa que hay líneas añadidas
                for (let k = 0; k < foundInText2; k++) {
                    right.push({ type: "added", text: lines2[j + k], lineNumber: lineNum2++ });
                    left.push({ type: "equal", text: "", lineNumber: undefined });
                }
                j += foundInText2;
            } else if (foundInText1 !== -1) {
                // line2 aparece en text1 más adelante, significa que hay líneas eliminadas
                for (let k = 0; k < foundInText1; k++) {
                    left.push({ type: "removed", text: lines1[i + k], lineNumber: lineNum1++ });
                    right.push({ type: "equal", text: "", lineNumber: undefined });
                }
                i += foundInText1;
            } else {
                // Líneas diferentes (modificadas)
                left.push({ type: "removed", text: line1, lineNumber: lineNum1++ });
                right.push({ type: "added", text: line2, lineNumber: lineNum2++ });
                i++;
                j++;
            }
        }
    }

    return { left, right };
}

export default function TextDiffPage() {
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");
    const [copiedLeft, setCopiedLeft] = useState(false);
    const [copiedRight, setCopiedRight] = useState(false);

    const diff = useMemo(() => computeDiff(text1, text2), [text1, text2]);

    const handleCopy = async (text: string, side: "left" | "right") => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            if (side === "left") {
                setCopiedLeft(true);
                setTimeout(() => setCopiedLeft(false), 2000);
            } else {
                setCopiedRight(true);
                setTimeout(() => setCopiedRight(false), 2000);
            }
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleSwap = () => {
        const temp = text1;
        setText1(text2);
        setText2(temp);
    };

    const stats = {
        added: diff.right.filter(l => l.type === "added").length,
        removed: diff.left.filter(l => l.type === "removed").length,
        unchanged: diff.left.filter(l => l.type === "equal" && l.text !== "").length,
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-[1800px]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <GitCompare className="w-6 h-6 text-amber-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Comparador de Textos</h1>
                </div>
                <p className="text-muted-foreground">
                    Compara dos textos lado a lado con resaltado de diferencias estilo Git diff.
                </p>
            </motion.div>

            {/* Estadísticas */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 flex items-center gap-4 flex-wrap"
            >
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium text-green-500">{stats.added} líneas añadidas</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-sm font-medium text-red-500">{stats.removed} líneas eliminadas</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-500/10 rounded-lg border border-gray-500/20">
                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                    <span className="text-sm font-medium text-gray-500">{stats.unchanged} líneas sin cambios</span>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-350px)] min-h-[600px]">
                {/* Texto Original (Izquierda) */}
                <motion.div
                    className="h-full"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="h-full flex flex-col border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <FileText className="w-4 h-4 text-red-500" />
                                Texto Original
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => setText1("")}>
                                    <Trash2 className="w-4 h-4 mr-1" /> Limpiar
                                </Button>
                                <Button
                                    size="sm"
                                    variant={copiedLeft ? "default" : "outline"}
                                    className={`h-8 gap-1.5 ${copiedLeft ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}`}
                                    onClick={() => handleCopy(text1, "left")}
                                    disabled={!text1}
                                >
                                    {copiedLeft ? <><CheckCircle2 className="w-4 h-4" /> ¡Copiado!</> : <><Copy className="w-4 h-4" /> Copiar</>}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-auto">
                            {!text1 && !text2 ? (
                                <textarea
                                    className="w-full h-full p-4 bg-transparent border-none resize-none focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed"
                                    placeholder="Pega el texto original aquí..."
                                    value={text1}
                                    onChange={(e) => setText1(e.target.value)}
                                    spellCheck={false}
                                />
                            ) : (
                                <div className="font-mono text-sm leading-relaxed">
                                    {diff.left.map((line, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-4 py-0.5 flex ${
                                                line.type === "removed" ? "bg-red-500/10 text-red-400" :
                                                line.type === "equal" && line.text === "" ? "bg-gray-500/5" :
                                                "text-muted-foreground"
                                            }`}
                                        >
                                            <span className="inline-block w-10 text-right mr-4 text-muted-foreground/50 select-none">
                                                {line.lineNumber || ""}
                                            </span>
                                            <span className="flex-1">
                                                {line.type === "removed" && <span className="text-red-500 mr-1">-</span>}
                                                {line.text || "\u00A0"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Texto Modificado (Derecha) */}
                <motion.div
                    className="h-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="h-full flex flex-col border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <FileText className="w-4 h-4 text-green-500" />
                                Texto Modificado
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="h-8 px-2" onClick={handleSwap}>
                                    <ArrowLeftRight className="w-4 h-4 mr-1" /> Intercambiar
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => setText2("")}>
                                    <Trash2 className="w-4 h-4 mr-1" /> Limpiar
                                </Button>
                                <Button
                                    size="sm"
                                    variant={copiedRight ? "default" : "outline"}
                                    className={`h-8 gap-1.5 ${copiedRight ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}`}
                                    onClick={() => handleCopy(text2, "right")}
                                    disabled={!text2}
                                >
                                    {copiedRight ? <><CheckCircle2 className="w-4 h-4" /> ¡Copiado!</> : <><Copy className="w-4 h-4" /> Copiar</>}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-auto">
                            {!text1 && !text2 ? (
                                <textarea
                                    className="w-full h-full p-4 bg-transparent border-none resize-none focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed"
                                    placeholder="Pega el texto modificado aquí..."
                                    value={text2}
                                    onChange={(e) => setText2(e.target.value)}
                                    spellCheck={false}
                                />
                            ) : (
                                <div className="font-mono text-sm leading-relaxed">
                                    {diff.right.map((line, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-4 py-0.5 flex ${
                                                line.type === "added" ? "bg-green-500/10 text-green-400" :
                                                line.type === "equal" && line.text === "" ? "bg-gray-500/5" :
                                                "text-muted-foreground"
                                            }`}
                                        >
                                            <span className="inline-block w-10 text-right mr-4 text-muted-foreground/50 select-none">
                                                {line.lineNumber || ""}
                                            </span>
                                            <span className="flex-1">
                                                {line.type === "added" && <span className="text-green-500 mr-1">+</span>}
                                                {line.text || "\u00A0"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
