"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { 
    Github, 
    Code2, 
    Sparkles, 
    Terminal, 
    Cpu, 
    Zap, 
    Globe, 
    Award,
    Briefcase,
    Calendar,
    ExternalLink
} from "lucide-react";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ActivityCalendar } from "react-activity-calendar";

export function BentoDashboard() {
    const { theme } = useTheme();
    const [contributions, setContributions] = useState<any[]>([]);

    useEffect(() => {
        async function fetchContributions() {
            try {
                const res = await fetch("https://github-contributions-api.deno.dev/fmargar.json");
                if (!res.ok) return;
                const data = await res.json();
                
                if (data && data.contributions) {
                    const flatData = data.contributions.flat().map((day: any) => {
                        let level = 0;
                        if (day.contributionLevel === "FIRST_QUARTILE") level = 1;
                        if (day.contributionLevel === "SECOND_QUARTILE") level = 2;
                        if (day.contributionLevel === "THIRD_QUARTILE") level = 3;
                        if (day.contributionLevel === "FOURTH_QUARTILE") level = 4;
                        return { date: day.date, count: day.contributionCount, level };
                    });
                    
                    const sixMonthsAgo = new Date();
                    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                    setContributions(flatData.filter((d: any) => new Date(d.date) >= sixMonthsAgo));
                }
            } catch (err) {
                console.error("Error fetching contributions:", err);
            }
        }
        fetchContributions();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.94, y: 24 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 18 } }
    };

    return (
        <section className="py-28 relative overflow-hidden px-4 sm:px-6 lg:px-8">

            {/* Section header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 max-w-6xl mx-auto"
            >
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-orange-500/60 mb-3">
                    Centro de Operaciones
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                    Actividad &{" "}
                    <span className="hero-title-accent">Stack</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-base">
                    Actividad en tiempo real, stack principal y estado de desarrollo profesional.
                </p>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[720px] max-w-6xl mx-auto"
            >
                {/* GitHub Activity - Large (2x2) */}
                <motion.div variants={item} className="md:col-span-2 md:row-span-2">
                    <BentoCard className="h-full flex flex-col group">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-2.5 mb-1">
                                    <div className="p-1.5 bg-orange-500/10 rounded-lg">
                                        <Github className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <h3 className="font-bold text-lg">GitHub Pulse</h3>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium pl-0.5">Actividad reciente</p>
                            </div>
                            <a
                                href="https://github.com/fmargar"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-400 transition-colors px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/15"
                            >
                                <ExternalLink className="w-3 h-3" />
                                Ver perfil
                            </a>
                        </div>

                        <div className="flex-grow flex items-center justify-center">
                            <div className="w-full rounded-2xl bg-background/40 border border-white/5 p-4">
                                {contributions.length > 0 ? (
                                    <div className="w-full overflow-x-auto pb-2 scrollbar-hide flex justify-center">
                                        <div className="min-w-max">
                                            <ActivityCalendar
                                                data={contributions}
                                                colorScheme={theme === 'light' ? 'light' : 'dark'}
                                                theme={{
                                                    light: ["#f1f5f9", "#fed7aa", "#f97316", "#ea580c", "#7c2d12"],
                                                    dark: ["#1a1a2e", "#fed7aa", "#f97316", "#ea580c", "#7c2d12"],
                                                }}
                                                labels={{
                                                    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                                                    weekdays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                                                    totalCount: '{{count}} contribuciones en el último año',
                                                    legend: { less: 'Menos', more: 'Más' }
                                                }}
                                                blockSize={13}
                                                blockMargin={4}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                        <motion.div
                                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                            <Github className="w-10 h-10 mb-3 text-orange-500/40" />
                                        </motion.div>
                                        <span className="text-sm font-medium">Cargando actividad...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </BentoCard>
                </motion.div>

                {/* Status - Small (1x1) */}
                <motion.div variants={item} className="md:col-span-1 md:row-span-1">
                    <BentoCard className="h-full flex flex-col justify-between group overflow-hidden">
                        <div className="absolute top-4 right-4 opacity-[0.07] group-hover:opacity-[0.14] transition-opacity duration-500">
                            <Cpu className="w-20 h-20 text-orange-500" />
                        </div>
                        <div>
                            <h3 className="font-bold flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse" />
                                Online
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">Actualmente en</p>
                        </div>
                        <div>
                            <p className="text-base font-black tracking-tight leading-tight">
                                Marbella Fácil<br />
                                <span className="neon-orange text-sm">Refining UI</span>
                            </p>
                        </div>
                    </BentoCard>
                </motion.div>

                {/* Laboratorio Link - Small (1x1) */}
                <motion.div variants={item} className="md:col-span-1 md:row-span-1">
                    <Link href="/tools" className="h-full block">
                        <BentoCard className="h-full flex flex-col justify-between group cursor-pointer">
                            <motion.div
                                animate={{ rotate: [0, 10, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                            >
                                <Zap className="w-8 h-8 text-orange-500" />
                            </motion.div>
                            <div>
                                <h3 className="font-bold group-hover:text-orange-500 transition-colors text-sm">
                                    Laboratorio
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Tools de alto impacto →</p>
                            </div>
                        </BentoCard>
                    </Link>
                </motion.div>

                {/* Core Stack - Wide (2x1) */}
                <motion.div variants={item} className="md:col-span-2 md:row-span-1">
                    <BentoCard className="h-full flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-500/10 rounded-xl">
                                <Code2 className="w-4 h-4 text-orange-500" />
                            </div>
                            <h3 className="font-bold text-sm">Core Stack</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {["Next.js", "Laravel", "PostgreSQL", "Docker", "React", "TypeScript", "Node.js"].map((tech, i) => (
                                <motion.div
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.06 }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.08, y: -1 }}
                                >
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/5 border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/10 transition-all text-xs font-semibold px-3 py-1 cursor-default"
                                    >
                                        {tech}
                                    </Badge>
                                </motion.div>
                            ))}
                        </div>
                    </BentoCard>
                </motion.div>

                {/* AWS Certified - Small (1x1) */}
                <motion.div variants={item} className="md:col-span-1 md:row-span-1">
                    <BentoCard className="h-full flex flex-col items-center justify-center text-center group py-4">
                        <div className="relative mb-3">
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 5 }}
                            >
                                <Award className="w-11 h-11 text-orange-500 relative z-10" />
                            </motion.div>
                            <motion.div
                                className="absolute inset-0 bg-orange-500/25 blur-2xl rounded-full"
                                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                            />
                        </div>
                        <h3 className="font-bold text-sm">AWS Certified</h3>
                        <p className="text-[11px] text-muted-foreground mt-1 px-2 italic leading-tight">
                            Cloud production-grade
                        </p>
                    </BentoCard>
                </motion.div>

                {/* English B2 - Small (1x1) */}
                <motion.div variants={item} className="md:col-span-1 md:row-span-1">
                    <BentoCard className="h-full flex flex-col justify-between group overflow-hidden">
                        <div className="absolute -bottom-3 -right-3 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500">
                            <Globe className="w-20 h-20" />
                        </div>
                        <h3 className="text-4xl font-black text-foreground/90">B2</h3>
                        <div>
                            <p className="font-bold text-orange-500 text-sm">English Proficiency</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Certified · Cambridge</p>
                        </div>
                    </BentoCard>
                </motion.div>

                {/* Experience & Availability - Wide (2x1) */}
                <motion.div variants={item} className="md:col-span-2 md:row-span-1">
                    <BentoCard className="h-full flex items-center justify-between px-8 group">
                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <Briefcase className="w-7 h-7 text-orange-500 mx-auto mb-2" />
                                <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Experiencia</p>
                                <p className="text-2xl font-black mt-1">+2 años</p>
                            </div>
                            <div className="w-px h-14 bg-white/10" />
                            <div className="text-center">
                                <Calendar className="w-7 h-7 text-orange-500 mx-auto mb-2" />
                                <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Disponibilidad</p>
                                <p className="text-2xl font-black mt-1">Full Time</p>
                            </div>
                            <div className="w-px h-14 bg-white/10 hidden sm:block" />
                            <div className="text-center hidden sm:block">
                                <Terminal className="w-7 h-7 text-orange-500 mx-auto mb-2" />
                                <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Proyectos</p>
                                <p className="text-2xl font-black mt-1">+10</p>
                            </div>
                        </div>
                        <p className="text-5xl font-black text-foreground/[0.04] group-hover:text-orange-500/10 transition-colors duration-500 hidden sm:block select-none">
                            2024
                        </p>
                    </BentoCard>
                </motion.div>
            </motion.div>
        </section>
    );
}

/** Glassmorphism Bento Card */
function BentoCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bento-card relative ${className}`}>
            {children}
        </div>
    );
}
