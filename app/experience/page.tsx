"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, Calendar, Award, Languages, CheckCircle2, X, ExternalLink } from "lucide-react";
import { useI18n } from "@/i18n";

// ─── Radar Chart (SVG, no external lib) ─────────────────────────────────────
const RADAR_SKILLS = [
    { label: "Frontend", value: 90 },
    { label: "Backend", value: 80 },
    { label: "DevOps", value: 72 },
    { label: "Cloud", value: 68 },
    { label: "Databases", value: 78 },
    { label: "Security", value: 65 },
];

function RadarChart() {
    const size = 240;
    const cx = size / 2;
    const cy = size / 2;
    const r = 90;
    const levels = 4;
    const n = RADAR_SKILLS.length;

    const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
    const point = (i: number, value: number) => ({
        x: cx + (r * value / 100) * Math.cos(angle(i)),
        y: cy + (r * value / 100) * Math.sin(angle(i)),
    });
    const axisEnd = (i: number) => ({
        x: cx + r * Math.cos(angle(i)),
        y: cy + r * Math.sin(angle(i)),
    });
    const labelPos = (i: number) => ({
        x: cx + (r + 22) * Math.cos(angle(i)),
        y: cy + (r + 22) * Math.sin(angle(i)),
    });

    const dataPath = RADAR_SKILLS.map((s, i) => {
        const p = point(i, s.value);
        return `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    }).join(" ") + " Z";

    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[240px] mx-auto">
            {/* Background circles */}
            {Array.from({ length: levels }, (_, lvl) => (
                <polygon
                    key={lvl}
                    points={Array.from({ length: n }, (_, i) => {
                        const p = point(i, ((lvl + 1) / levels) * 100);
                        return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
                    }).join(" ")}
                    fill="none"
                    stroke="rgba(255,255,255,0.07)"
                    strokeWidth="1"
                />
            ))}

            {/* Axis lines */}
            {RADAR_SKILLS.map((_, i) => {
                const end = axisEnd(i);
                return (
                    <line key={i} x1={cx} y1={cy} x2={end.x.toFixed(2)} y2={end.y.toFixed(2)}
                        stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                );
            })}

            {/* Data area */}
            <path d={dataPath} fill="rgba(249,115,22,0.2)" stroke="#f97316" strokeWidth="2" strokeLinejoin="round" />

            {/* Value dots */}
            {RADAR_SKILLS.map((s, i) => {
                const p = point(i, s.value);
                return <circle key={i} cx={p.x.toFixed(2)} cy={p.y.toFixed(2)} r="4" fill="#f97316" stroke="#fff" strokeWidth="1.5" />;
            })}

            {/* Labels */}
            {RADAR_SKILLS.map((s, i) => {
                const lp = labelPos(i);
                return (
                    <text key={i} x={lp.x.toFixed(2)} y={lp.y.toFixed(2)}
                        textAnchor="middle" dominantBaseline="central"
                        className="fill-current text-muted-foreground"
                        style={{ fontSize: "10px", fill: "rgb(148 163 184)" }}
                    >
                        {s.label}
                        <tspan x={lp.x.toFixed(2)} dy="12" style={{ fill: "#f97316", fontWeight: 700 }}>
                            {s.value}%
                        </tspan>
                    </text>
                );
            })}
        </svg>
    );
}

// ─── Certificate Modal ───────────────────────────────────────────────────────
interface CertInfo {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
    verifyUrl?: string;
}

function CertModal({ cert, onClose }: { cert: CertInfo; onClose: () => void }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onClick={e => e.stopPropagation()}
                    className="w-full max-w-md bg-background border border-orange-500/20 rounded-[2rem] p-8 shadow-2xl shadow-orange-500/10 relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                            {cert.title.toLowerCase().includes('english') || cert.title.toLowerCase().includes('cambridge')
                                ? <Languages className="w-8 h-8 text-orange-500" />
                                : <Award className="w-8 h-8 text-orange-500" />
                            }
                        </div>
                        <div>
                            <span className="text-xs font-bold tracking-widest uppercase text-orange-500/60 block mb-1">{cert.date}</span>
                            <h3 className="text-xl font-bold text-foreground">{cert.title}</h3>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Emisor</p>
                            <p className="font-semibold text-orange-500">{cert.issuer}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Descripción</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{cert.description}</p>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-border/50 text-sm font-medium hover:bg-muted/40 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ExperiencePage() {
    const { t, locale } = useI18n();
    const [selectedCert, setSelectedCert] = useState<CertInfo | null>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : 'en-US', {
            month: 'short',
            year: 'numeric'
        }).format(date);
    };

    return (
        <div className="relative min-h-screen">
            {/* Professional background for experience page */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-background" />

            {/* Subtle diagonal gradient stripes */}
            <div className="absolute inset-0 bg-gradient-to-bl from-green-500/[0.015] via-transparent via-blue-500/[0.01] to-orange-500/[0.015]" />

            {/* Fine mesh pattern */}
            <div className="absolute inset-0 opacity-[0.008] bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

            {/* Cert Modal */}
            {selectedCert && <CertModal cert={selectedCert} onClose={() => setSelectedCert(null)} />}

            <div className="relative z-10 container mx-auto px-4 py-12 sm:py-14 md:py-16 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 sm:mb-18 md:mb-20 text-center"
                >
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-orange-500/60 mb-3">
                        {t.experience.badge}
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 sm:mb-6 px-4">
                        {t.experience.title}
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                        {t.experience.description}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
                    {/* Main Experience Timeline */}
                    <div className="lg:col-span-2 space-y-10 sm:space-y-12">
                        <div className="flex items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
                            <div className="h-8 sm:h-10 w-1 bg-gradient-to-b from-orange-600 to-amber-500 rounded-full" />
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground/90">{t.experience.sections.history}</h2>
                        </div>

                        <div className="relative border-l-2 border-white/10 ml-5 sm:ml-6 md:ml-8 space-y-12 sm:space-y-14 md:space-y-16 pb-8">
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
                                    <div className="absolute -left-[38px] sm:-left-[42px] md:-left-[45px]">
                                        <div className={`
                                            w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center relative shadow-xl z-10 transition-transform duration-500 group-hover:scale-110
                                            ${exp.current
                                                ? 'bg-gradient-to-br from-orange-500 to-orange-600 border ring-6 sm:ring-8 ring-background border-white/20'
                                                : 'bg-white/5 border border-white/10 ring-6 sm:ring-8 ring-background backdrop-blur-md'
                                            }
                                        `}>
                                            {exp.role.toLowerCase().includes('ies') || exp.role.includes('DAW') || exp.role.toLowerCase().includes('degree') ? (
                                                <GraduationCap className={`w-5 h-5 sm:w-6 sm:h-6 ${exp.current ? 'text-white' : 'text-orange-500/80'}`} />
                                            ) : (
                                                <Briefcase className={`w-5 h-5 sm:w-6 sm:h-6 ${exp.current ? 'text-white' : 'text-orange-500/80'}`} />
                                            )}
                                            {exp.current && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-orange-500/50"
                                                    animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-[1.75rem] border border-white/8 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] hover:border-orange-500/20 transition-all duration-300 shadow-lg hover:shadow-2xl">
                                        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                                            <div>
                                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">{exp.role}</h3>
                                                <h4 className="text-base sm:text-lg font-medium text-orange-500/90">{exp.company}</h4>
                                            </div>
                                            <div className="flex flex-shrink-0 items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 sm:px-3.5 py-1.5 rounded-full border border-orange-500/20 w-fit">
                                                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                <span>
                                                    {formatDate(exp.start_date)} — {exp.current || !exp.end_date ? t.experience.current : formatDate(exp.end_date)}
                                                </span>
                                            </div>
                                        </div>

                                        {exp.description && (
                                            <p className="text-muted-foreground/90 leading-relaxed text-sm sm:text-[15px]">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-12 sm:space-y-14 md:space-y-16">
                        {/* Certifications — clicables */}
                        <section>
                            <div className="flex items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
                                <div className="h-8 sm:h-10 w-1 bg-gradient-to-b from-orange-600 to-amber-500 rounded-full" />
                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground/90">{t.experience.sections.certifications}</h2>
                            </div>
                            <div className="space-y-4 sm:space-y-5">
                                {t.experience.certifications.map((cert: any, i: number) => (
                                    <motion.button
                                        key={cert.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => setSelectedCert(cert)}
                                        className="w-full text-left p-5 sm:p-6 rounded-xl sm:rounded-[1.5rem] bg-white/[0.02] border border-white/8 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-300 group cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3">
                                            <div className="p-2.5 sm:p-3 bg-orange-500/10 rounded-xl sm:rounded-2xl group-hover:bg-orange-500/20 transition-colors border border-orange-500/20">
                                                {cert.title.toLowerCase().includes('english') ? <Languages className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" /> : <Award className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />}
                                            </div>
                                            <span className="text-[10px] font-bold text-orange-500/80 uppercase tracking-widest bg-orange-500/10 px-2 sm:px-2.5 py-1 rounded-full">{cert.date}</span>
                                        </div>
                                        <h3 className="font-bold text-base sm:text-lg mb-1.5 text-foreground/90 group-hover:text-orange-400 transition-colors">{cert.title}</h3>
                                        <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">{cert.issuer}</p>
                                        <p className="text-[10px] sm:text-[11px] text-orange-500/60 font-medium">Clic para ver detalles →</p>
                                    </motion.button>
                                ))}
                            </div>
                        </section>

                        {/* Skills Radar Chart */}
                        <section>
                            <div className="flex items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
                                <div className="h-8 sm:h-10 w-1 bg-gradient-to-b from-orange-600 to-amber-500 rounded-full" />
                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground/90">Habilidades Técnicas</h2>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="p-5 sm:p-6 rounded-xl sm:rounded-[1.5rem] bg-white/[0.02] border border-white/8"
                            >
                                <div className="max-w-[180px] sm:max-w-[200px] lg:max-w-[240px] mx-auto">
                                    <RadarChart />
                                </div>
                                <p className="text-xs text-center text-muted-foreground mt-3">Autoevaluación técnica · 2026</p>
                            </motion.div>
                        </section>

                        {/* Soft Skills */}
                        <section>
                            <div className="flex items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
                                <div className="h-8 sm:h-10 w-1 bg-gradient-to-b from-orange-600 to-amber-500 rounded-full" />
                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground/90">{t.experience.sections.skills}</h2>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                {t.experience.softSkills.map((skill: string, i: number) => (
                                    <motion.span
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/10 transition-colors text-muted-foreground hover:text-foreground cursor-default"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
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
