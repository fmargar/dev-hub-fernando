"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, User, MessageSquare, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <Badge variant="secondary" className="mb-4 px-4 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-none rounded-full">
                    <Sparkles className="w-3.5 h-3.5 mr-2" />
                    ¿Hablamos?
                </Badge>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-foreground">
                    Contacto
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    ¿Tienes una idea, un proyecto o simplemente quieres saludar? Estaré encantado de escucharte.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-8"
                >
                    <motion.div variants={item} className="space-y-4">
                        <h2 className="text-2xl font-bold">Información de Contacto</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Actualmente estoy disponible para nuevos retos y colaboraciones. Respondo normalmente en menos de 24 horas.
                        </p>
                    </motion.div>

                    <motion.div variants={item} className="grid gap-4">
                        <div className="flex items-center gap-4 p-5 rounded-2xl bg-muted/50 border border-muted-foreground/10 hover:border-orange-500/20 transition-colors">
                            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-600">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Vía Formulario</p>
                                <p className="font-semibold text-foreground">Respuesta rápida garantizada</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 p-5 rounded-2xl bg-muted/50 border border-muted-foreground/10 hover:border-orange-500/20 transition-colors">
                            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-600">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Proyectos Especiales</p>
                                <p className="font-semibold text-foreground">Let's build something epic</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full h-full"
                >
                    <Card className="border-muted-foreground/10 bg-background/50 backdrop-blur-xl shadow-2xl shadow-orange-500/5">
                        <CardContent className="p-8">
                            <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                    <motion.form
                                        key="form"
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center gap-2 px-1">
                                                <User className="w-4 h-4 text-orange-500" /> Nombre Completo
                                            </label>
                                            <input
                                                required
                                                placeholder="Tu nombre..."
                                                className="w-full h-12 px-4 rounded-xl bg-muted border-none focus:ring-2 focus:ring-orange-500/50 transition-all outline-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center gap-2 px-1">
                                                <Mail className="w-4 h-4 text-orange-500" /> Correo Electrónico
                                            </label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="tu@email.com"
                                                className="w-full h-12 px-4 rounded-xl bg-muted border-none focus:ring-2 focus:ring-orange-500/50 transition-all outline-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center gap-2 px-1">
                                                <MessageSquare className="w-4 h-4 text-orange-500" /> Mensaje
                                            </label>
                                            <textarea
                                                required
                                                rows={5}
                                                placeholder="¿En qué puedo ayudarte?"
                                                className="w-full p-4 rounded-xl bg-muted border-none focus:ring-2 focus:ring-orange-500/50 transition-all outline-none resize-none"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    Enviar Mensaje <Send className="w-4 h-4" />
                                                </div>
                                            )}
                                        </Button>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-12 space-y-6"
                                    >
                                        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">¡Mensaje Enviado!</h3>
                                            <p className="text-muted-foreground">Gracias por contactar. Te responderé lo antes posible.</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsSubmitted(false)}
                                            className="rounded-xl border-orange-500/20 hover:bg-orange-500/5"
                                        >
                                            Enviar otro mensaje
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
