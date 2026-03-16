"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ActivityCalendar } from "react-activity-calendar";

export function BentoDashboard() {
    const [contributions, setContributions] = useState<any[]>([]);

    useEffect(() => {
        async function fetchContributions() {
            try {
                // Using a reliable Deno-based GitHub contributions API wrapper
                const res = await fetch("https://github-contributions-api.deno.dev/fmargar.json");
                if (!res.ok) return;
                const data = await res.json();
                
                if (data && data.contributions) {
                    // The API returns an array of weeks, where each week is an array of days
                    const flatData = data.contributions.flat().map((day: any) => {
                        let level = 0;
                        if (day.contributionLevel === "FIRST_QUARTILE") level = 1;
                        if (day.contributionLevel === "SECOND_QUARTILE") level = 2;
                        if (day.contributionLevel === "THIRD_QUARTILE") level = 3;
                        if (day.contributionLevel === "FOURTH_QUARTILE") level = 4;

                        return {
                            date: day.date,
                            count: day.contributionCount,
                            level: level
                        };
                    });
                    
                    // Filter for only the last ~6 months of data (to fit nicely)
                    const sixMonthsAgo = new Date();
                    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                    
                    const filtered = flatData.filter((d: any) => new Date(d.date) >= sixMonthsAgo);
                    setContributions(filtered);
                }
            } catch (err) {
                console.error("Error fetching contributions:", err);
            }
        }
        fetchContributions();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: { opacity: 1, scale: 1, y: 0 }
    };

    return (
        <section className="py-24 relative overflow-hidden px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                        Centro de <span className="text-orange-500">Operaciones</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Actividad en tiempo real, stack principal y estado de desarrollo profesional.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[700px]"
                >
                    {/* GitHub Activity Pulse - Large (2x2) */}
                    <motion.div variants={item} className="md:col-span-2 md:row-span-2">
                        <BentoCard className="h-full group">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Github className="w-5 h-5 text-orange-500" />
                                        <h3 className="font-bold text-xl">GitHub Pulse</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">Actividad reciente</p>
                                </div>
                                <a
                                    href="https://github.com/fmargar"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-400 transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Ver perfil
                                </a>
                            </div>
                            
                            <div className="w-full h-auto overflow-hidden rounded-xl bg-background/40 border border-muted/50 p-6 flex flex-col items-center justify-center min-h-[180px]">
                                {contributions.length > 0 ? (
                                    <div className="w-full overflow-x-auto pb-2 scrollbar-hide flex justify-center">
                                        <div className="min-w-max">
                                            <ActivityCalendar 
                                                data={contributions} 
                                                theme={{
                                                    light: ["#f1f5f9", "#fed7aa", "#f97316", "#ea580c", "#c2410c"],
                                                    dark: ["#1e293b", "#7c2d12", "#c2410c", "#ea580c", "#f97316"],
                                                }}
                                                labels={{
                                                    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                                                    weekdays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                                                    totalCount: '{{count}} contribuciones en el último año',
                                                    legend: {
                                                        less: 'Menos',
                                                        more: 'Más'
                                                    }
                                                }}
                                                blockSize={12}
                                                blockMargin={4}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-muted-foreground animate-pulse">
                                        <Github className="w-8 h-8 mb-3 opacity-50" />
                                        <span className="text-sm font-medium">Cargando mapa de actividad...</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex justify-end items-center text-xs text-muted-foreground font-medium">
                                <span>Menos</span>
                                <div className="flex gap-1 mx-2">
                                    <div className="w-3 h-3 bg-slate-800 dark:bg-slate-800 rounded-sm" />
                                    <div className="w-3 h-3 bg-orange-900 rounded-sm" />
                                    <div className="w-3 h-3 bg-orange-700 rounded-sm" />
                                    <div className="w-3 h-3 bg-orange-600 rounded-sm" />
                                    <div className="w-3 h-3 bg-orange-500 rounded-sm" />
                                </div>
                                <span>Más</span>
                            </div>
                        </BentoCard>
                    </motion.div>

                    {/* Current Status - Small (1x1) */}
                    <motion.div variants={item} className="md:col-span-1 md:row-span-1">
                        <BentoCard className="h-full flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Cpu className="w-16 h-16 text-orange-500 rotate-12" />
                            </div>
                            <div>
                                <h3 className="font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Status
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">Actualmente en</p>
                            </div>
                            <p className="text-lg font-black tracking-tight leading-tight mt-4">
                                Marbella Fácil <br />
                                <span className="text-orange-500">Refining UI</span>
                            </p>
                        </BentoCard>
                    </motion.div>

                    {/* Quick Link: Laboratorio - Small (1x1) */}
                    <motion.div variants={item} className="md:col-span-1 md:row-span-1">
                        <Link href="/tools" className="h-full block">
                            <BentoCard className="h-full flex flex-col justify-between group hover:border-orange-500/50 cursor-pointer">
                                <Zap className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
                                <div>
                                    <h3 className="font-bold group-hover:text-orange-500 transition-colors">Laboratorio</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Tools de alto impacto →</p>
                                </div>
                            </BentoCard>
                        </Link>
                    </motion.div>

                    {/* Main Stack - Wide (2x1) */}
                    <motion.div variants={item} className="md:col-span-2 md:row-span-1">
                        <BentoCard className="h-full flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <Code2 className="w-5 h-5 text-orange-500" />
                                </div>
                                <h3 className="font-bold">Core Stack</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {["Next.js", "Laravel", "PostgreSQL", "Docker", "React"].map((tech) => (
                                    <Badge key={tech} variant="secondary" className="bg-muted px-3 py-1 border-none font-semibold">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </BentoCard>
                    </motion.div>

                    {/* Certification Pulse - Tall (1x2) */}
                    <motion.div variants={item} className="md:col-span-1 md:row-span-2">
                        <BentoCard className="h-full flex flex-col items-center justify-center text-center group">
                            <div className="relative mb-6">
                                <Award className="w-16 h-16 text-orange-500 group-hover:scale-110 transition-transform duration-500" />
                                <motion.div 
                                    className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                />
                            </div>
                            <h3 className="font-bold text-lg">AWS Certified</h3>
                            <p className="text-sm text-muted-foreground mt-2 px-4 italic leading-relaxed">
                                "Nube escalable para entornos de producción"
                            </p>
                        </BentoCard>
                    </motion.div>

                    {/* English B2 - Small (1x1) */}
                    <motion.div variants={item} className="md:col-span-1 md:row-span-1">
                        <BentoCard className="h-full flex flex-col justify-between group overflow-hidden">
                            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Globe className="w-24 h-24" />
                            </div>
                            <h3 className="text-3xl font-black">B2</h3>
                            <div>
                                <p className="font-bold text-orange-500">English Proficiency</p>
                                <p className="text-xs text-muted-foreground">Certified by Cambridge</p>
                            </div>
                        </BentoCard>
                    </motion.div>

                    {/* Location & Experience - Wide (2x1) */}
                    <motion.div variants={item} className="md:col-span-2 md:row-span-1">
                        <BentoCard className="h-full flex items-center justify-between px-8 group">
                           <div className="flex items-center gap-6">
                               <div className="text-center">
                                   <Briefcase className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                                   <p className="text-xs font-bold text-muted-foreground">Experiencia</p>
                                   <p className="text-xl font-black">+2 años</p>
                               </div>
                               <div className="w-px h-12 bg-muted-foreground/20 mx-2" />
                               <div className="text-center">
                                   <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                                   <p className="text-xs font-bold text-muted-foreground">Disponibilidad</p>
                                   <p className="text-xl font-black">Full Time</p>
                               </div>
                           </div>
                           <div className="text-right hidden sm:block">
                               <p className="text-4xl font-black text-foreground/20 group-hover:text-orange-500/20 transition-colors">EST. 2024</p>
                           </div>
                        </BentoCard>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

function BentoCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`p-8 rounded-[2rem] bg-background/50 backdrop-blur-xl border border-muted-foreground/10 hover:border-orange-500/20 transition-all duration-300 shadow-xl shadow-orange-500/5 ${className}`}>
            {children}
        </div>
    );
}
