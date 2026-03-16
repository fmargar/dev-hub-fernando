"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Cpu, Code2 } from "lucide-react";
import { useTheme } from "next-themes";
import { ActivityCalendar } from "react-activity-calendar";
import Link from "next/link";

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
                    
                    // Show only last 5 months so recent days hit the screen immediately
                    const fiveMonthsAgo = new Date();
                    fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
                    setContributions(flatData.filter((d: any) => new Date(d.date) >= fiveMonthsAgo));
                }
            } catch (err) {
                console.error("Error fetching contributions:", err);
            }
        }
        fetchContributions();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } }
    };

    return (
        <section className="py-24 relative overflow-hidden px-4 sm:px-6 lg:px-8">
            {/* Section Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 max-w-6xl mx-auto relative z-10"
            >
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-orange-500/60 mb-3">
                    Centro de Operaciones
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                    Actividad de <span className="hero-title-accent">Desarrollo</span>
                </h2>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10"
            >
                {/* 1. GitHub Pulse - Hero Card (Span 2) */}
                <motion.div variants={item} className="lg:col-span-2">
                    <div className="h-[380px] flex flex-col p-6 sm:p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl hover:bg-white/[0.03] transition-colors shadow-2xl relative overflow-hidden group">
                        
                        <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-500/10 blur-[60px] rounded-full group-hover:bg-orange-500/20 transition-colors duration-700" />
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10 gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl group-hover:border-orange-500/30 transition-colors">
                                        <Github className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold tracking-tight">GitHub Pulse</h3>
                                </div>
                                <p className="text-sm text-muted-foreground ml-[52px]">Flujo de contribuciones de los últimos 5 meses</p>
                            </div>
                            <a
                                href="https://github.com/fmargar"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-sm font-semibold text-white bg-white/5 hover:bg-orange-500 hover:text-white border border-white/10 hover:border-orange-500 transition-all px-4 py-2.5 rounded-xl shadow-sm"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Ver Perfil
                            </a>
                        </div>

                        <div className="flex-grow flex items-center justify-center relative z-10 w-full">
                            <div className="w-full bg-black/20 rounded-2xl border border-white/5 p-4 sm:p-6 overflow-hidden">
                                {contributions.length > 0 ? (
                                    <div className="w-full overflow-x-auto pb-2 scrollbar-hide flex justify-end">
                                        <div className="min-w-max pr-2">
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
                                                    totalCount: '{{count}} contribuciones en periodo actual',
                                                    legend: { less: 'Menos', more: 'Más' }
                                                }}
                                                blockSize={14}
                                                blockMargin={5}
                                                fontSize={12}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[120px] text-muted-foreground">
                                        <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}>
                                            <Github className="w-8 h-8 mb-3 text-orange-500/40" />
                                        </motion.div>
                                        <span className="text-sm font-medium tracking-wide">Analizando repositorio...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Current Focus / Status - Side Panel */}
                <motion.div variants={item}>
                    <div className="h-[380px] p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-orange-500/30 transition-colors flex flex-col justify-between">
                        <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                            <Cpu className="w-48 h-48 text-orange-500" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-pulse" />
                                    <span className="text-sm font-bold tracking-wider text-foreground/80 uppercase">Focus Actual</span>
                                </div>
                                <h3 className="text-3xl font-black leading-tight mb-3 text-foreground group-hover:text-orange-400 transition-colors">
                                    Marbella Fácil
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                    SaaS integral de turismo inteligente. Optimizando micro transacciones e integrando APIs climatológicas.
                                </p>
                            </div>
                            
                            <Link href="/projects" className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-orange-500/10 text-orange-500 font-bold hover:bg-orange-500 hover:text-white transition-all border border-orange-500/20 hover:border-orange-500">
                                <Code2 className="w-4 h-4" />
                                Ver Arquitectura
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Server Node Activity - Animated Console (Span 1) */}
                <motion.div variants={item}>
                    <div className="h-[300px] p-6 rounded-[2rem] bg-black border border-white/10 shadow-2xl relative overflow-hidden group flex flex-col">
                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                                <span className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-2 text-xs font-mono text-zinc-500">server@ubuntu:~/apps</span>
                            </div>
                            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest bg-green-400/10 px-2 py-1 rounded">Live Build</span>
                        </div>
                        <div className="flex-1 font-mono text-[11px] leading-snug overflow-hidden flex flex-col justify-end">
                            <AnimatedTerminalLines />
                        </div>
                    </div>
                </motion.div>

                {/* 4. Core Technologies - Span 2 */}
                <motion.div variants={item} className="lg:col-span-2">
                    <div className="h-[300px] p-6 sm:p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl relative overflow-hidden group">
                        
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                                    <Cpu className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">Motor de Desarrollo</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">Stack principal en producción</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 items-center justify-center mt-2 relative z-10">
                            {[
                                { name: "Next.js 15", icon: "⚛️" },
                                { name: "React", icon: "📘" },
                                { name: "Laravel 10", icon: "🌋" },
                                { name: "TypeScript", icon: "🛡️" },
                                { name: "Ubuntu Server", icon: "🐧" },
                                { name: "PostgreSQL", icon: "🐘" },
                                { name: "Tailwind CSS", icon: "🌬️" },
                                { name: "Docker", icon: "🐳" },
                            ].map((tech, i) => (
                                <motion.div
                                    key={tech.name}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ 
                                        delay: i * 0.1, 
                                        type: "spring", 
                                        stiffness: 150,
                                        damping: 10
                                    }}
                                    whileHover={{ 
                                        scale: 1.1, 
                                        y: -5,
                                        boxShadow: "0 10px 25px -5px rgba(249,115,22, 0.4)"
                                    }}
                                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 cursor-default transition-all duration-300"
                                >
                                    <span className="text-xl drop-shadow-md">{tech.icon}</span>
                                    <span className="text-sm font-bold text-foreground/80 tracking-tight">{tech.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </section>
    );
}

const mockConsoleLines = [
    { text: "> docker-compose up -d", color: "text-zinc-300" },
    { text: "[+] Building 0.2s (13/13) FINISHED", color: "text-blue-400" },
    { text: " => [internal] load build definition from Dockerfile", color: "text-zinc-500" },
    { text: " => => transferring dockerfile: 32B", color: "text-zinc-500" },
    { text: " => [production 1/4] RUN npm ci --omit=dev", color: "text-zinc-400" },
    { text: " ✔ Network dev-hub_default Created", color: "text-green-400" },
    { text: " ✔ Container app-mongodb-1 Started", color: "text-green-400" },
    { text: " ✔ Container app-web-1 Started", color: "text-green-400" },
    { text: "Server running on port 3000 🔥", color: "text-orange-400 font-bold" },
];

function AnimatedTerminalLines() {
    const [lines, setLines] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLines(prev => {
                if (prev >= mockConsoleLines.length) {
                    return 0; // reset animation loop
                }
                return prev + 1;
            });
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-1.5 flex flex-col justify-end">
            {mockConsoleLines.slice(0, lines).map((line, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className={line.color}
                >
                    {line.text}
                </motion.div>
            ))}
            {lines < mockConsoleLines.length && (
                <motion.div 
                    animate={{ opacity: [1, 0, 1] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-zinc-400 inline-block mt-2"
                />
            )}
        </div>
    );
}
