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
                    <div className="min-h-[380px] h-full flex flex-col p-6 sm:p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl hover:bg-white/[0.03] transition-colors shadow-2xl relative overflow-hidden group">
                        
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
                <motion.div variants={item} className="h-full">
                    <div className="min-h-[380px] h-full p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-orange-500/30 transition-colors flex flex-col justify-between">
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
                            
                            <Link href="/projects" className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-orange-500/10 text-orange-500 font-bold hover:bg-orange-500 hover:text-white transition-all border border-orange-500/20 hover:border-orange-500 lightsaber-orange">
                                <Code2 className="w-4 h-4" />
                                Ver Arquitectura
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Server Node Activity - Animated Console (Span 1) */}
                <motion.div variants={item} className="h-full">
                    <div className="min-h-[300px] h-full p-6 rounded-[2rem] bg-black border border-white/10 shadow-2xl relative overflow-hidden group flex flex-col">
                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                                <span className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-2 text-xs font-mono text-zinc-500">fmartinez@overlord:~/</span>
                            </div>
                            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest bg-green-400/10 px-2 py-1 rounded">SysLog</span>
                        </div>
                        <div className="flex-1 font-mono text-[11px] leading-snug overflow-hidden flex flex-col justify-end">
                            <AnimatedTerminalLines />
                        </div>
                    </div>
                </motion.div>

                {/* 4. Core Technologies - Infinite Tech Marquee (Span 2) */}
                <motion.div variants={item} className="lg:col-span-2 h-full">
                    <div className="min-h-[300px] h-full p-6 sm:p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl relative overflow-hidden group flex flex-col justify-between">
                        
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl group-hover:border-orange-500/40 transition-colors">
                                    <Cpu className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">Motor de Desarrollo</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">Ecosistema principal de producción</p>
                                </div>
                            </div>
                        </div>

                        {/* Animated Tech Orbits / Marquee */}
                        <div className="relative w-full overflow-hidden flex-1 mask-linear-fade flex flex-col justify-center gap-4 py-4">
                            {/* Row 1: Moving left */}
                            <motion.div 
                                className="flex gap-4 w-fit"
                                animate={{ x: [0, -1000] }}
                                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                            >
                                {[...coreTechRow1, ...coreTechRow1, ...coreTechRow1].map((tech, i) => (
                                    <div key={`${tech.name}-${i}`} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 whitespace-nowrap">
                                        <span className="text-xl">{tech.icon}</span>
                                        <span className="text-sm font-bold text-foreground/80">{tech.name}</span>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Row 2: Moving right */}
                            <motion.div 
                                className="flex gap-4 w-fit"
                                initial={{ x: -1000 }}
                                animate={{ x: 0 }}
                                transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
                            >
                                {[...coreTechRow2, ...coreTechRow2, ...coreTechRow2].map((tech, i) => (
                                    <div key={`${tech.name}-${i}`} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-bl from-white/5 to-white/0 border border-white/10 whitespace-nowrap">
                                        <span className="text-xl">{tech.icon}</span>
                                        <span className="text-sm font-bold text-foreground/80">{tech.name}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </section>
    );
}

// ----------------------------------------------------
// Core Technologies Data
// ----------------------------------------------------
const coreTechRow1 = [
    { name: "Next.js 15", icon: "⚛️" },
    { name: "React", icon: "📘" },
    { name: "TypeScript", icon: "🛡️" },
    { name: "Tailwind CSS", icon: "🌬️" },
    { name: "Framer Motion", icon: "✨" },
];
const coreTechRow2 = [
    { name: "Laravel 11", icon: "🌋" },
    { name: "Ubuntu Server", icon: "🐧" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "Docker", icon: "🐳" },
    { name: "Nginx", icon: "🟢" },
];

// ----------------------------------------------------
// Animated Terminal Sequences
// ----------------------------------------------------
const megaSequence = [
    // Scenario 1: Docker Build
    { text: "> docker-compose up -d --build", color: "text-zinc-300", delay: 1000 },
    { text: "[+] Building 0.2s (13/13) FINISHED", color: "text-orange-400", delay: 200 },
    { text: " => [internal] load build definition", color: "text-zinc-500", delay: 150 },
    { text: " => => transferring dockerfile: 32B", color: "text-zinc-500", delay: 100 },
    { text: " => [production 1/4] RUN npm ci --omit=dev", color: "text-zinc-400", delay: 800 },
    { text: " ✔ Network dev-hub_default Created", color: "text-green-400", delay: 100 },
    { text: " ✔ Container app-mongodb-1 Started", color: "text-green-400", delay: 100 },
    { text: " ✔ Container app-web-1 Started", color: "text-green-400", delay: 100 },
    { text: "Server running on port 3000 🔥", color: "text-orange-400 font-bold", delay: 2500 },
    
    // Scenario 2: Clear & Easter Egg
    { text: "clear", color: "text-zinc-300", delay: 500, clear: true },
    { text: "Scanning security protocols...", color: "text-zinc-400", delay: 1000 },
    { text: "Bypassing mainframe firewalls [==== 50% ====]", color: "text-zinc-500", delay: 600 },
    { text: "Bypassing mainframe firewalls [==========100%]", color: "text-zinc-500", delay: 600 },
    { text: "ACCESS GRANTED. Welcome to the Matrix, Fernando.", color: "text-green-400 font-bold", delay: 3000 },

    // Scenario 3: Clear & Deployment
    { text: "clear", color: "text-zinc-300", delay: 500, clear: true },
    { text: "> git pull origin main", color: "text-zinc-300", delay: 800 },
    { text: "From github.com:fmargar/portfolio", color: "text-orange-400", delay: 300 },
    { text: " * branch            main       -> FETCH_HEAD", color: "text-zinc-500", delay: 200 },
    { text: "Updating 4d9e9e1..a1b2c3d", color: "text-zinc-500", delay: 300 },
    { text: "Fast-forward", color: "text-zinc-400", delay: 100 },
    { text: " components/home/BentoDashboard.tsx | 150 +++++++---", color: "text-zinc-500", delay: 400 },
    { text: " 1 file changed, 115 insertions(+), 35 deletions(-)", color: "text-zinc-300", delay: 300 },
    { text: "> npm run deploy:prod", color: "text-zinc-300", delay: 800 },
    { text: "Optimizing assets... Done.", color: "text-orange-400", delay: 900 },
    { text: "Production deployment successful 🚀", color: "text-green-400 font-bold", delay: 3000 },
    
    // Scenario 4: Clear & SSH
    { text: "clear", color: "text-zinc-300", delay: 500, clear: true },
    { text: "> ssh root@100.65.1.78", color: "text-zinc-300", delay: 1200 },
    { text: "root@100.65.1.78's password: ****", color: "text-zinc-500", delay: 800 },
    { text: "Welcome to Ubuntu 22.04 LTS (GNU/Linux 5.15.0-generic x86_64)", color: "text-zinc-400", delay: 400 },
    { text: "System load:  0.18               Processes:           152", color: "text-zinc-500", delay: 100 },
    { text: "Usage of /:   42.1% of 50GB      Users logged in:     1", color: "text-zinc-500", delay: 100 },
    { text: "Memory usage: 32%                IP address for eth0: 100.65.1.78", color: "text-zinc-500", delay: 100 },
    { text: "root@ubuntu-server:~# ./check_status.sh", color: "text-zinc-300", delay: 1000 },
    { text: "ALL SYSTEMS NOMINAL. UPTIME: 42 DAYS.", color: "text-green-400 font-bold", delay: 3000 },
    { text: "clear", color: "text-zinc-300", delay: 500, clear: true }
];

function AnimatedTerminalLines() {
    const [currentStep, setCurrentStep] = useState(0);
    const [visibleLines, setVisibleLines] = useState<any[]>([]);

    useEffect(() => {
        let isMounted = true;
        
        const executeNextStep = () => {
            if (!isMounted) return;
            
            const step = megaSequence[currentStep];
            
            if (step.clear) {
                setVisibleLines([]);
            } else {
                setVisibleLines(prev => [...prev.slice(-8), step]); // Keep max 9 lines to prevent overflow
            }

            const nextStep = (currentStep + 1) % megaSequence.length;
            
            setTimeout(() => {
                if (isMounted) setCurrentStep(nextStep);
            }, step.delay);
        };

        executeNextStep();
        
        return () => { isMounted = false; };
    }, [currentStep]);

    return (
        <div className="space-y-1.5 flex flex-col justify-end h-full w-full">
            {visibleLines.map((line, i) => (
                <motion.div 
                    key={`${currentStep}-${i}`} 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className={line.color}
                >
                    {line.text}
                </motion.div>
            ))}
            <motion.div 
                animate={{ opacity: [1, 0, 1] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-3.5 bg-zinc-400 inline-block mt-1"
            />
        </div>
    );
}
