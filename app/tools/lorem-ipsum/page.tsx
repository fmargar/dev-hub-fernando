"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Copy, CheckCircle2, Settings2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Lorem Ipsum en latín (clásico)
const loremLatin = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    "Totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
    "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur adipisci velit.",
];

// Texto profesional en español
const loremSpanish = [
    "El desarrollo de aplicaciones web modernas requiere un profundo conocimiento de las tecnologías actuales y las mejores prácticas de la industria.",
    "La optimización del rendimiento es fundamental para garantizar una experiencia de usuario fluida y satisfactoria en todos los dispositivos.",
    "La seguridad de los datos debe ser una prioridad en cada etapa del desarrollo, implementando medidas robustas de protección.",
    "La escalabilidad de la arquitectura permite que el sistema crezca de manera eficiente según aumenta la demanda de usuarios.",
    "La integración continua y el despliegue automatizado mejoran significativamente la calidad del código y reducen errores en producción.",
    "El diseño responsivo garantiza que la interfaz se adapte correctamente a diferentes tamaños de pantalla y dispositivos.",
    "La accesibilidad web es esencial para asegurar que todas las personas puedan utilizar el sistema sin barreras tecnológicas.",
    "La documentación técnica clara facilita el mantenimiento del código y la colaboración entre desarrolladores del equipo.",
];

// Palabras sueltas para generar texto personalizado
const wordsLatin = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat".split(" ");
const wordsSpanish = "desarrollo aplicaciones web modernas tecnologías arquitectura sistema usuarios interfaz código datos seguridad rendimiento optimización diseño funcionalidad implementación proceso metodología estrategia solución proyecto equipo cliente servidor base".split(" ");

export default function LoremIpsumPage() {
    const [mode, setMode] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
    const [count, setCount] = useState(3);
    const [language, setLanguage] = useState<"latin" | "spanish">("latin");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    const generateText = () => {
        const source = language === "latin" ? loremLatin : loremSpanish;
        const words = language === "latin" ? wordsLatin : wordsSpanish;
        let result = "";

        if (mode === "paragraphs") {
            const paragraphs: string[] = [];
            for (let i = 0; i < count; i++) {
                const sentenceCount = Math.floor(Math.random() * 3) + 3; // 3-5 oraciones
                const sentences: string[] = [];
                for (let j = 0; j < sentenceCount; j++) {
                    sentences.push(source[Math.floor(Math.random() * source.length)]);
                }
                paragraphs.push(sentences.join(" "));
            }
            result = paragraphs.join("\n\n");
        } else if (mode === "sentences") {
            const sentences: string[] = [];
            for (let i = 0; i < count; i++) {
                sentences.push(source[Math.floor(Math.random() * source.length)]);
            }
            result = sentences.join(" ");
        } else {
            // words
            const selectedWords: string[] = [];
            for (let i = 0; i < count; i++) {
                selectedWords.push(words[Math.floor(Math.random() * words.length)]);
            }
            result = selectedWords.join(" ");
        }

        setOutput(result);
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
                    <div className="p-2 bg-lime-500/10 rounded-lg">
                        <MessageSquare className="w-6 h-6 text-lime-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Lorem Ipsum Generator</h1>
                </div>
                <p className="text-muted-foreground">
                    Genera texto placeholder profesional en latín o español para tus diseños y mockups.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel de configuración */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="border-b bg-muted/20">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                <Settings2 className="w-4 h-4 text-lime-500" />
                                Configuración
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-6">
                            {/* Idioma */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Idioma</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setLanguage("latin")}
                                        className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                                            language === "latin"
                                                ? "bg-lime-500/20 text-lime-500 border border-lime-500/30"
                                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                        }`}
                                    >
                                        Latín
                                    </button>
                                    <button
                                        onClick={() => setLanguage("spanish")}
                                        className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                                            language === "spanish"
                                                ? "bg-lime-500/20 text-lime-500 border border-lime-500/30"
                                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                        }`}
                                    >
                                        Español
                                    </button>
                                </div>
                            </div>

                            {/* Modo */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Tipo de contenido</label>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setMode("paragraphs")}
                                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                                            mode === "paragraphs"
                                                ? "bg-lime-500/20 text-lime-500 border border-lime-500/30"
                                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                        }`}
                                    >
                                        Párrafos
                                    </button>
                                    <button
                                        onClick={() => setMode("sentences")}
                                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                                            mode === "sentences"
                                                ? "bg-lime-500/20 text-lime-500 border border-lime-500/30"
                                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                        }`}
                                    >
                                        Oraciones
                                    </button>
                                    <button
                                        onClick={() => setMode("words")}
                                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                                            mode === "words"
                                                ? "bg-lime-500/20 text-lime-500 border border-lime-500/30"
                                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                        }`}
                                    >
                                        Palabras
                                    </button>
                                </div>
                            </div>

                            {/* Cantidad */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Cantidad: <span className="text-lime-500">{count}</span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max={mode === "words" ? 200 : mode === "sentences" ? 20 : 10}
                                    value={count}
                                    onChange={(e) => setCount(Number(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>1</span>
                                    <span>{mode === "words" ? 200 : mode === "sentences" ? 20 : 10}</span>
                                </div>
                            </div>

                            {/* Botón generar */}
                            <Button
                                onClick={generateText}
                                className="w-full bg-lime-600 hover:bg-lime-700 text-white"
                            >
                                Generar Texto
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Panel de salida */}
                <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="h-[50vh] min-h-[300px] flex flex-col border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-lime-500" />
                                Texto Generado
                            </CardTitle>
                            <Button
                                size="sm"
                                variant={copied ? "default" : "outline"}
                                className={`h-8 gap-1.5 transition-all ${copied ? "bg-lime-600 hover:bg-lime-700 text-white" : ""}`}
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
                                <div className="p-6 text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                    {output}
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
                                    <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-sm">Configura las opciones y genera tu texto</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
