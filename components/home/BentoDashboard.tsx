"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Cpu, Code2 } from "lucide-react";
import { useTheme } from "next-themes";
import { ActivityCalendar } from "react-activity-calendar";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/i18n";

export function BentoDashboard() {
    const { theme } = useTheme();
    const { t } = useI18n();
    const [contributions, setContributions] = useState<any[]>([]);
    const [allContributions, setAllContributions] = useState<any[]>([]);
    const [blockSize, setBlockSize] = useState(14);
    const [blockMargin, setBlockMargin] = useState(5);
    const [calendarFontSize, setCalendarFontSize] = useState(12);
    const [monthLabels, setMonthLabels] = useState([
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ]);
    const [visibleWeeks, setVisibleWeeks] = useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

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

                    setAllContributions(flatData);
                }
            } catch (err) {
                console.error("Error fetching contributions:", err);
            }
        }
        fetchContributions();
    }, []);

    // Dynamic calendar sizing based on actual container width
    useEffect(() => {
        function calculateOptimalCalendar() {
            if (!containerRef.current || allContributions.length === 0) return;

            const containerWidth = containerRef.current.clientWidth;
            const isMobile = window.innerWidth < 768;
            const isVerySmall = window.innerWidth < 420;
            const sortedContributions = [...allContributions].sort(
                (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            // Base block size depending on screen
            let baseBlockSize = isVerySmall ? 7 : isMobile ? 9 : 12;
            let baseMargin = isMobile ? 2 : 3;

            // One week uses one horizontal column in this calendar.
            const availableWidth = Math.max(220, containerWidth - (isMobile ? 28 : 40));
            const weekColumnWidth = baseBlockSize + baseMargin;
            const totalWeeksAvailable = Math.ceil(sortedContributions.length / 7);
            const weeksCanFit = Math.floor(availableWidth / weekColumnWidth);
            const fittedWeeks = Math.max(1, weeksCanFit - 1);
            const optimalWeeks = Math.max(8, Math.min(totalWeeksAvailable, fittedWeeks));
            const minBlock = isVerySmall ? 6 : isMobile ? 7 : 9;
            const maxBlock = isVerySmall ? 9 : isMobile ? 11 : 15;
            baseBlockSize = Math.max(minBlock, Math.min(maxBlock, Math.floor(availableWidth / optimalWeeks) - baseMargin));

            setBlockSize(baseBlockSize);
            setBlockMargin(baseMargin);
            setVisibleWeeks(optimalWeeks);

            setCalendarFontSize(isVerySmall ? 9 : isMobile ? 10 : 12);
            setMonthLabels(
                isVerySmall
                    ? ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
                    : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
            );

            // Keep only the latest weeks so the chart always shows recent activity.
            const daysToShow = optimalWeeks * 7;
            const startIndex = Math.max(0, sortedContributions.length - daysToShow);
            const filtered = sortedContributions.slice(startIndex);
            setContributions(filtered);
        }

        // Initial calculation
        calculateOptimalCalendar();

        // Recalculate on window and container resize with debounce
        let resizeTimeout: ReturnType<typeof setTimeout>;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(calculateOptimalCalendar, 150);
        }

        window.addEventListener('resize', handleResize);
        let observer: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
            observer = new ResizeObserver(handleResize);
            observer.observe(containerRef.current);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            observer?.disconnect();
            clearTimeout(resizeTimeout);
        };
    }, [allContributions]);

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
                    {t.bento.title}
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                    {t.bento.activity}
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
                    <div className="min-h-[380px] h-full flex flex-col p-6 sm:p-8 rounded-[2rem] bg-white/60 dark:bg-white/[0.02] border border-black/10 dark:border-white/10 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-white/[0.03] transition-colors shadow-2xl relative overflow-hidden group">

                        <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-500/10 blur-[60px] rounded-full group-hover:bg-orange-500/20 transition-colors duration-700" />

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10 gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl group-hover:border-orange-500/30 transition-colors">
                                        <Github className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold tracking-tight">{t.bento.github.title || "GitHub Pulse"}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground ml-[52px]">{t.bento.github.subtitle} ({visibleWeeks || 0} semanas)</p>
                            </div>
                            <a
                                href="https://github.com/fmargar"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-sm font-semibold text-foreground bg-orange-500/5 hover:bg-orange-500 hover:text-white border border-orange-500/20 hover:border-orange-500 transition-all px-4 py-2.5 rounded-xl shadow-sm"
                            >
                                <ExternalLink className="w-4 h-4" />
                                {t.bento.github.viewProfile}
                            </a>
                        </div>

                        <div className="flex-grow flex items-center justify-center relative z-10 w-full">
                            <div ref={containerRef} className="w-full bg-muted/50 rounded-2xl border border-border p-4 sm:p-6 overflow-hidden">
                                {contributions.length > 0 ? (
                                    <div className="w-full flex justify-start items-center">
                                        <ActivityCalendar
                                            data={contributions}
                                            colorScheme={theme === 'light' ? 'light' : 'dark'}
                                            theme={{
                                                light: ["#f1f5f9", "#fed7aa", "#f97316", "#ea580c", "#7c2d12"],
                                                dark: ["#1a1a2e", "#fed7aa", "#f97316", "#ea580c", "#7c2d12"],
                                            }}
                                            labels={{
                                                months: monthLabels,
                                                weekdays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                                                totalCount: `{{count}} ${t.bento.github.commits}`,
                                                legend: { less: 'Menos', more: 'Más' }
                                            }}
                                            blockSize={blockSize}
                                            blockMargin={blockMargin}
                                            fontSize={calendarFontSize}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[120px] text-muted-foreground">
                                        <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}>
                                            <Github className="w-8 h-8 mb-3 text-orange-500/40" />
                                        </motion.div>
                                        <span className="text-sm font-medium tracking-wide">{t.bento.github.analyzing}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Current Focus / Status - Side Panel */}
                <motion.div variants={item} className="h-full">
                    <div className="min-h-[380px] h-full p-8 rounded-[2rem] bg-white/60 dark:bg-white/[0.02] border border-black/10 dark:border-white/10 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-orange-500/30 transition-colors flex flex-col justify-between">
                        <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                            <Cpu className="w-48 h-48 text-orange-500" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-pulse" />
                                    <span className="text-sm font-bold tracking-wider text-foreground/80 uppercase">{t.bento.project.focus}</span>
                                </div>
                                <h3 className="text-3xl font-black leading-tight mb-3 text-foreground group-hover:text-orange-400 transition-colors">
                                    {t.bento.project.name}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                    {t.bento.project.description}
                                </p>
                            </div>

                            <Link href="/projects" className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-orange-500/10 text-orange-500 font-bold hover:bg-orange-500 hover:text-white transition-all border border-orange-500/20 hover:border-orange-500 lightsaber-orange">
                                <Code2 className="w-4 h-4" />
                                {t.bento.project.viewArchitecture}
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Core Technologies - Infinite Tech Marquee (Span 3) */}
                <motion.div variants={item} className="lg:col-span-3 h-full">
                    <div className="min-h-[250px] h-full p-6 sm:p-8 rounded-[2rem] bg-white/60 dark:bg-white/[0.02] border border-black/10 dark:border-white/10 backdrop-blur-xl shadow-xl relative overflow-hidden group flex flex-col justify-between">

                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl group-hover:border-orange-500/40 transition-colors">
                                    <Cpu className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">{t.bento.techEngine.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">{t.bento.techEngine.subtitle}</p>
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
                                {[...coreTechRow1, ...coreTechRow1, ...coreTechRow1].map((tech, i) => {
                                    const iconSize = tech.name === "Framer Motion" ? 14 : 24;
                                    return (
                                    <div key={`${tech.name}-${i}`} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-orange-500/5 to-transparent dark:from-white/5 dark:to-white/0 border border-orange-500/20 dark:border-white/10 whitespace-nowrap">
                                        {tech.iconLight && tech.iconDark ? (
                                            <>
                                                <Image src={tech.iconLight} alt={tech.name} width={iconSize} height={iconSize} className="dark:hidden flex-shrink-0" unoptimized />
                                                <Image src={tech.iconDark} alt={tech.name} width={iconSize} height={iconSize} className="hidden dark:block flex-shrink-0" unoptimized />
                                            </>
                                        ) : tech.icon ? (
                                            <Image src={tech.icon} alt={tech.name} width={24} height={24} className="flex-shrink-0" unoptimized />
                                        ) : null}
                                        <span className="text-sm font-bold text-foreground/80">{tech.name}</span>
                                    </div>
                                );
                                })}
                            </motion.div>

                            {/* Row 2: Moving right */}
                            <motion.div
                                className="flex gap-4 w-fit"
                                initial={{ x: -1000 }}
                                animate={{ x: 0 }}
                                transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
                            >
                                {[...coreTechRow2, ...coreTechRow2, ...coreTechRow2].map((tech, i) => {
                                    const iconSize = tech.name === "Framer Motion" ? 14 : 24;
                                    return (
                                    <div key={`${tech.name}-${i}`} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-bl from-orange-500/5 to-transparent dark:from-white/5 dark:to-white/0 border border-orange-500/20 dark:border-white/10 whitespace-nowrap">
                                        {tech.iconLight && tech.iconDark ? (
                                            <>
                                                <Image src={tech.iconLight} alt={tech.name} width={iconSize} height={iconSize} className="dark:hidden flex-shrink-0" unoptimized />
                                                <Image src={tech.iconDark} alt={tech.name} width={iconSize} height={iconSize} className="hidden dark:block flex-shrink-0" unoptimized />
                                            </>
                                        ) : tech.icon ? (
                                            <Image src={tech.icon} alt={tech.name} width={24} height={24} className="flex-shrink-0" unoptimized />
                                        ) : null}
                                        <span className="text-sm font-bold text-foreground/80">{tech.name}</span>
                                    </div>
                                );
                                })}
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
interface Tech {
    name: string;
    icon?: string;
    iconLight?: string;
    iconDark?: string;
}

const coreTechRow1: Tech[] = [
    { name: "Next.js 15", iconLight: "/nextnegro.svg", iconDark: "/nextblanco.svg" },
    { name: "React", icon: "/react.svg" },
    { name: "TypeScript", icon: "/typescript.svg" },
    { name: "Tailwind CSS", icon: "/tailwind.svg" },
    { name: "Framer Motion", iconLight: "/framer_negro.svg", iconDark: "/framer_blanco.svg" },
];
const coreTechRow2: Tech[] = [
    { name: "Laravel 11", icon: "/laravel.svg" },
    { name: "Ubuntu Server", icon: "/ubuntu.svg" },
    { name: "PostgreSQL", icon: "/postgresql.svg" },
    { name: "Docker", icon: "/docker.svg" },
    { name: "Nginx", icon: "/nginx.svg" },
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

