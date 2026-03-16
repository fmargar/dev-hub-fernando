"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, User, MessageSquare, CheckCircle2, Sparkles, MapPin, Clock } from "lucide-react";
import { AnimatedBackground } from "@/components/home/AnimatedBackground";

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

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center">
            <AnimatedBackground />

            <div className="relative z-10 container mx-auto px-4 py-16 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-bold mb-6">
                        <Sparkles className="w-4 h-4" />
                        Abierto a nuevas oportunidades
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
                        Ponte en <span className="hero-title-accent">Contacto</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        ¿Tienes un proyecto en mente o buscas fortalecer tu equipo de ingeniería? Hablemos sobre cómo puedo aportar valor.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-start">
                    {/* Info Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/8 backdrop-blur-xl shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6">Detalles de Contacto</h2>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                Mi bandeja de entrada está siempre abierta. Ya sea para una propuesta técnica, una oportunidad profesional o simplemente una consulta, intentaré responder en menos de 24 horas.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-colors">
                                        <Mail className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Email Directo</p>
                                        <p className="text-base font-semibold group-hover:text-orange-400 transition-colors">fernando.mar.gar9@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-colors">
                                        <MapPin className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Ubicación</p>
                                        <p className="text-base font-semibold group-hover:text-orange-400 transition-colors">Marbella, España (Remoto / Híbrido)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-colors">
                                        <Clock className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Disponibilidad</p>
                                        <p className="text-base font-semibold group-hover:text-orange-400 transition-colors">Full-time Inmediata</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <div className="p-8 md:p-10 rounded-[2.5rem] bg-[oklch(1_0_0/0.03)] backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden">
                            {/* Subtle embedded glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />
                            
                            <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                    <motion.form
                                        key="form"
                                        onSubmit={handleSubmit}
                                        className="space-y-6 relative z-10"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2 pl-1">
                                                    <User className="w-3.5 h-3.5 text-orange-500" /> Nombre
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Tu nombre..."
                                                    className="w-full h-14 px-5 rounded-2xl bg-black/20 border border-white/10 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none text-foreground placeholder:text-muted-foreground/40 font-medium"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2 pl-1">
                                                    <Mail className="w-3.5 h-3.5 text-orange-500" /> Email
                                                </label>
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="tu@email.com"
                                                    className="w-full h-14 px-5 rounded-2xl bg-black/20 border border-white/10 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none text-foreground placeholder:text-muted-foreground/40 font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2 pl-1">
                                                <MessageSquare className="w-3.5 h-3.5 text-orange-500" /> Mensaje
                                            </label>
                                            <textarea
                                                required
                                                rows={5}
                                                placeholder="¿En qué puedo aportar valor a tu equipo o proyecto?"
                                                className="w-full p-5 rounded-2xl bg-black/20 border border-white/10 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none resize-none text-foreground placeholder:text-muted-foreground/40 font-medium"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-lg transition-all disabled:opacity-50 shadow-[0_8px_30px_-5px_rgba(249,115,22,0.4)] flex items-center justify-center"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <div className="flex items-center gap-2 group">
                                                    Enviar Propuesta 
                                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </div>
                                            )}
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-16 space-y-6 flex flex-col items-center justify-center min-h-[400px]"
                                    >
                                        <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/5 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black mb-3 text-foreground">¡Transmisión Exitosa!</h3>
                                            <p className="text-lg text-muted-foreground max-w-sm mx-auto">He recibido tu mensaje correctamente. Analizaré la información y te responderé en breve.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsSubmitted(false)}
                                            className="mt-6 px-8 py-3 rounded-full border border-orange-500/30 hover:bg-orange-500/10 text-orange-400 font-bold transition-all"
                                        >
                                            Enviar otro mensaje
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
