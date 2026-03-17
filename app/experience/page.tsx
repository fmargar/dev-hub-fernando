"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Calendar, Award, Languages, CheckCircle2 } from "lucide-react";
import { Experience, Certification } from "@/types/portfolio";
import { AnimatedBackground } from "@/components/home/AnimatedBackground";
import { useI18n } from "@/i18n";

export default function ExperiencePage() {
    const { t, locale } = useI18n();
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : 'en-US', { 
            month: 'short', 
            year: 'numeric' 
        }).format(date);
    };

    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />

            <div className="relative z-10 container mx-auto px-4 py-16 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20 text-center"
                >
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-orange-500/60 mb-3">
                        Trayectoria · Fernando Máximo
                    </p>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
                        {t.experience.title}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {t.experience.description}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 lg:gap-20">
                    {/* Main Experience Timeline */}
                    <div className="xl:col-span-2 space-y-12">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-1 bg-gradient-to-b from-orange-600 to-amber-500 rounded-full" />
                            <h2 className="text-2xl font-bold tracking-tight text-foreground/90">{t.experience.sections.history}</h2>
                        </div>

                        <div className="relative border-l-2 border-white/10 ml-6 md:ml-8 space-y-16 pb-8">
                            {t.experience.timeline.map((exp: any, i: number) => (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="relative pl-8 md:pl-16 group"
                                >
                                    {/* Timeline Node */}
                                    <div className="absolute -left-[45px] md:-left-[45px]">
                                        <div className={`
                                            w-14 h-14 rounded-2xl flex items-center justify-center relative shadow-xl z-10 transition-transform duration-500 group-hover:scale-110
                                            ${exp.current
                                                ? 'bg-gradient-to-br from-orange-500 to-orange-600 border ring-8 ring-background border-white/20'
                                                : 'bg-white/5 border border-white/10 ring-8 ring-background backdrop-blur-md'
                                            }
                                        `}>
                                            {exp.role.toLowerCase().includes('ies') || exp.role.includes('DAW') || exp.role.toLowerCase().includes('degree') ? (
                                                <GraduationCap className={`w-6 h-6 ${exp.current ? 'text-white' : 'text-orange-500/80'}`} />
                                            ) : (
                                                <Briefcase className={`w-6 h-6 ${exp.current ? 'text-white' : 'text-orange-500/80'}`} />
                                            )}
                                            {exp.current && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-2xl border-2 border-orange-500/50"
                                                    animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="p-6 md:p-8 rounded-[1.75rem] border border-white/8 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] hover:border-orange-500/20 transition-all duration-300 shadow-lg hover:shadow-2xl">
                                        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-4">
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">{exp.role}</h3>
                                                <h4 className="text-lg font-medium text-orange-500/90">{exp.company}</h4>
                                            </div>
                                            <div className="flex flex-shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/20 w-fit">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>
                                                    {formatDate(exp.start_date)} — {exp.current || !exp.end_date ? t.experience.current : formatDate(exp.end_date)}
                                                </span>
                                            </div>
                                        </div>

                                        {exp.description && (
                                            <p className="text-muted-foreground/90 leading-relaxed text-[15px]">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar: Certifications & Skills */}
                    <div className="space-y-16">
                        {/* Certifications Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-1 bg-gradient-to-b from-orange-600 to-amber-500 rounded-full" />
                                <h2 className="text-2xl font-bold tracking-tight text-foreground/90">{t.experience.sections.certifications}</h2>
                            </div>
                            <div className="space-y-5">
                                {t.experience.certifications.map((cert: any, i: number) => (
                                    <motion.div
                                        key={cert.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/8 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all duration-300 group"
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="p-3 bg-orange-500/10 rounded-2xl group-hover:bg-orange-500/20 transition-colors border border-orange-500/20">
                                                {cert.title.toLowerCase().includes('english') ? <Languages className="w-6 h-6 text-orange-500" /> : <Award className="w-6 h-6 text-orange-500" />}
                                            </div>
                                            <span className="text-[10px] font-bold text-orange-500/80 uppercase tracking-widest bg-orange-500/10 px-2.5 py-1 rounded-full">{cert.date}</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1.5 text-foreground/90">{cert.title}</h3>
                                        <p className="text-sm font-medium text-muted-foreground mb-3">{cert.issuer}</p>
                                        <p className="text-[13px] text-muted-foreground/70 leading-relaxed italic">{cert.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Soft Skills Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-1 bg-gradient-to-b from-orange-600 to-amber-500 rounded-full" />
                                <h2 className="text-2xl font-bold tracking-tight text-foreground/90">{t.experience.sections.skills}</h2>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {t.experience.softSkills.map((skill, i) => (
                                    <motion.span
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="px-4 py-2 bg-white/5 rounded-full text-sm font-medium flex items-center gap-2 border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/10 transition-colors text-muted-foreground hover:text-foreground cursor-default"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-orange-500" />
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
