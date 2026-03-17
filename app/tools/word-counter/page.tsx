"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Copy, CheckCircle2, Trash2, BookOpen, Clock, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/context";

export default function WordCounterPage() {
    const { t } = useI18n();
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

    // Métricas básicas
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;

    // Tiempo estimado de lectura (promedio: 200 palabras por minuto)
    const readingTimeMinutes = Math.ceil(words / 200);
    const readingTimeText = t.tools_content.wordCounter.minutes.replace("{count}", readingTimeMinutes.toString()).replace("{count, plural, =1 {1 minuto} other {# minutos}}", readingTimeMinutes === 1 ? (t.locale === 'es' ? '1 minuto' : t.locale === 'en' ? '1 minute' : '1 Minute') : (t.locale === 'es' ? `${readingTimeMinutes} minutos` : t.locale === 'en' ? `${readingTimeMinutes} minutes` : `${readingTimeMinutes} Minuten`));
    // Implementation note: Simple replacement for now as we don't have a full ICU message parser. 
    // In a real app we'd use something like react-intl or a custom parser.
    const finalReadingTime = t.tools_content.wordCounter.minutes.includes("{count, plural") 
        ? (readingTimeMinutes === 1 
            ? t.tools_content.wordCounter.minutes.match(/=1 {([^}]+)}/)?.[1] || "1 min" 
            : t.tools_content.wordCounter.minutes.match(/other {([^}]+)}/)?.[1]?.replace("#", readingTimeMinutes.toString()) || `${readingTimeMinutes} min`)
        : readingTimeText;

    // Índice de legibilidad (Flesch Reading Ease simplificado)
    // Fórmula simplificada: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    // Como aproximación, usaremos palabras promedio por oración
    const avgWordsPerSentence = sentences > 0 ? (words / sentences).toFixed(1) : 0;
    const avgCharsPerWord = words > 0 ? (charactersNoSpaces / words).toFixed(1) : 0;

    // Estimación de nivel de lectura basado en palabras por oración
    let readabilityLevel = t.tools_content.wordCounter.analysis.levels.na;
    let readabilityColor = "text-gray-500";
    if (sentences > 0 && words > 10) {
        const wordsPerSentence = words / sentences;
        if (wordsPerSentence < 10) {
            readabilityLevel = t.tools_content.wordCounter.analysis.levels.veryEasy;
            readabilityColor = "text-green-500";
        } else if (wordsPerSentence < 15) {
            readabilityLevel = t.tools_content.wordCounter.analysis.levels.easy;
            readabilityColor = "text-lime-500";
        } else if (wordsPerSentence < 20) {
            readabilityLevel = t.tools_content.wordCounter.analysis.levels.moderate;
            readabilityColor = "text-yellow-500";
        } else if (wordsPerSentence < 25) {
            readabilityLevel = t.tools_content.wordCounter.analysis.levels.hard;
            readabilityColor = "text-orange-500";
        } else {
            readabilityLevel = t.tools_content.wordCounter.analysis.levels.veryHard;
            readabilityColor = "text-red-500";
        }
    }

    const handleCopy = async () => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleClear = () => {
        setText("");
    };

    const stats = [
        { icon: FileText, label: t.tools_content.wordCounter.stats.words, value: words, color: "text-cyan-500", bg: "bg-cyan-500/10" },
        { icon: BookOpen, label: t.tools_content.wordCounter.stats.characters, value: characters, color: "text-purple-500", bg: "bg-purple-500/10" },
        { icon: Eye, label: t.tools_content.wordCounter.stats.noSpaces, value: charactersNoSpaces, color: "text-blue-500", bg: "bg-blue-500/10" },
        { icon: FileText, label: t.tools_content.wordCounter.stats.sentences, value: sentences, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { icon: BookOpen, label: t.tools_content.wordCounter.stats.paragraphs, value: paragraphs, color: "text-orange-500", bg: "bg-orange-500/10" },
        { icon: Clock, label: t.tools_content.wordCounter.stats.readingTime, value: finalReadingTime, color: "text-pink-500", bg: "bg-pink-500/10" },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <FileText className="w-6 h-6 text-cyan-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{t.tools_content.wordCounter.title}</h1>
                </div>
                <p className="text-muted-foreground">
                    {t.tools_content.wordCounter.description}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Editor Column */}
                <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="h-[600px] flex flex-col border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <FileText className="w-4 h-4 text-cyan-500" />
                                {t.tools_content.wordCounter.placeholder.split('...')[0]}
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="h-8 px-2 text-muted-foreground hover:text-foreground" onClick={handleClear}>
                                    <Trash2 className="w-4 h-4 mr-1" /> {t.common.clear}
                                </Button>
                                <Button
                                    size="sm"
                                    variant={copied ? "default" : "outline"}
                                    className={`h-8 gap-1.5 transition-all ${copied ? "bg-cyan-600 hover:bg-cyan-700 text-white" : ""}`}
                                    onClick={handleCopy}
                                    disabled={!text}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" /> {t.common.copied}
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" /> {t.common.copy}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            <textarea
                                className="w-full h-full p-4 bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-base leading-relaxed"
                                placeholder={t.tools_content.wordCounter.placeholder}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Stats Column */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Estadísticas básicas */}
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                        >
                            <Card className="border-border/50 hover:border-border transition-colors">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    {/* Análisis avanzado */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card className="border-border/50 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-cyan-500" />
                                    {t.tools_content.wordCounter.analysis.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{t.tools_content.wordCounter.analysis.readability}</p>
                                    <p className={`text-xl font-bold ${readabilityColor}`}>{readabilityLevel}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/30">
                                    <div>
                                        <p className="text-xs text-muted-foreground">{t.tools_content.wordCounter.analysis.wordsPerSentence}</p>
                                        <p className="text-lg font-semibold text-foreground">{avgWordsPerSentence}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">{t.tools_content.wordCounter.analysis.charsPerWord}</p>
                                        <p className="text-lg font-semibold text-foreground">{avgCharsPerWord}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
