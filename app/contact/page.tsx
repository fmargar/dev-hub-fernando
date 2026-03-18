"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, User, MessageSquare, CheckCircle2, Sparkles, MapPin, Clock } from "lucide-react";
import { AnimatedBackground } from "@/components/home/AnimatedBackground";
import { useI18n } from "@/i18n";

export default function ContactPage() {
    const { t } = useI18n();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string,
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error al enviar el mensaje');
            }

            setIsSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al enviar el mensaje');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendAnother = () => {
        setIsSubmitted(false);
        setError(null);
        // Resetear el formulario después de un pequeño delay para que AnimatePresence lo monte primero
        setTimeout(() => {
            formRef.current?.reset();
        }, 100);
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
                        {t.contact.info.availability}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
                        {t.contact.title}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {t.contact.subtitle} {t.contact.description}
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
                        <div className="p-8 rounded-[2rem] bg-white/60 dark:bg-white/[0.02] border border-black/10 dark:border-white/8 backdrop-blur-xl shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6">{t.contact.subtitle}</h2>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                {t.contact.description} {t.contact.info.response}
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-500/10 border border-orange-500/20 group-hover:bg-orange-500/20 group-hover:border-orange-500/40 transition-colors">
                                        <MapPin className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">{t.contact.info.locationLabel}</p>
                                        <p className="text-base font-semibold group-hover:text-orange-400 transition-colors">{t.contact.info.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-500/10 border border-orange-500/20 group-hover:bg-orange-500/20 group-hover:border-orange-500/40 transition-colors">
                                        <Clock className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">{t.contact.info.availabilityLabel}</p>
                                        <p className="text-base font-semibold group-hover:text-orange-400 transition-colors">{t.contact.info.availability}</p>
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
                        <div className="p-8 md:p-10 rounded-[2.5rem] bg-white/60 dark:bg-[oklch(1_0_0/0.03)] backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden">
                            {/* Subtle embedded glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                    <motion.form
                                        key="form"
                                        ref={formRef}
                                        onSubmit={handleSubmit}
                                        className="space-y-6 relative z-10"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {error && (
                                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                                {error}
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2 pl-1">
                                                    <User className="w-3.5 h-3.5 text-orange-500" /> {t.contact.form.name}
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    name="name"
                                                    placeholder={t.contact.form.namePlaceholder}
                                                    className="w-full h-14 px-5 rounded-2xl bg-muted/50 border border-border focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none text-foreground placeholder:text-muted-foreground/40 font-medium"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2 pl-1">
                                                    <Mail className="w-3.5 h-3.5 text-orange-500" /> {t.contact.form.email}
                                                </label>
                                                <input
                                                    required
                                                    type="email"
                                                    name="email"
                                                    placeholder={t.contact.form.emailPlaceholder}
                                                    className="w-full h-14 px-5 rounded-2xl bg-muted/50 border border-border focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none text-foreground placeholder:text-muted-foreground/40 font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2 pl-1">
                                                <MessageSquare className="w-3.5 h-3.5 text-orange-500" /> {t.contact.form.message}
                                            </label>
                                            <textarea
                                                required
                                                name="message"
                                                rows={5}
                                                placeholder={t.contact.form.messagePlaceholder}
                                                className="w-full p-5 rounded-2xl bg-muted/50 border border-border focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none resize-none text-foreground placeholder:text-muted-foreground/40 font-medium"
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
                                                    {t.contact.form.submit}
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
                                            <h3 className="text-3xl font-black mb-3 text-foreground">{t.contact.form.success}</h3>
                                            <p className="text-lg text-muted-foreground max-w-sm mx-auto">{t.contact.form.successDesc}</p>
                                        </div>
                                        <button
                                            onClick={handleSendAnother}
                                            className="mt-6 px-8 py-3 rounded-full border border-orange-500/30 hover:bg-orange-500/10 text-orange-400 font-bold transition-all"
                                        >
                                            {t.contact.form.sendAnother}
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
