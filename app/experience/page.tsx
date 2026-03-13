"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Calendar, Award, Languages, CheckCircle2 } from "lucide-react";
import { Experience, Certification } from "@/types/portfolio";

const experiences: Experience[] = [
    {
        id: "4",
        role: "Desarrollador Backend & BBDD (Prácticas)",
        company: "Ayuntamiento de Marbella",
        start_date: "2026-03-01",
        end_date: null,
        description: "Migración y unificación de bases de datos de Marbella y San Pedro desde archivos CSV a una arquitectura relacional sólida en PostgreSQL. Desarrollo de una aplicación web CRUD integral para la gestión de vados, implementando sistemas de auditoría, despliegue en la Intranet municipal e integración con Directorio Activo para garantizar un acceso seguro y trazabilidad absoluta.",
        current: true,
        created_at: new Date().toISOString()
    },
    {
        id: "1",
        role: "Desarrollador Web (Prácticas)",
        company: "ASISA",
        start_date: "2025-01-01",
        end_date: "2025-06-30",
        description: "Gestión técnica de portales corporativos. Optimización de rendimiento mediante la configuración de módulos y refactorización de código. Colaboración en el diseño UI/UX para asegurar interfaces responsivas y accesibles en entornos empresariales de alta demanda.",
        current: false,
        created_at: new Date().toISOString()
    },
    {
        id: "3",
        role: "Grado Superior DAW",
        company: "I.E.S. Salduba",
        start_date: "2024-09-15",
        end_date: null,
        description: "Formación técnica avanzada en desarrollo Full Stack. Especialización en Java (Spring Boot), PHP (Laravel), Bases de Datos (MySQL) y control de versiones colaborativo con Git/GitHub.",
        current: true,
        created_at: new Date().toISOString()
    },
    {
        id: "2",
        role: "Vendedor Técnico",
        company: "Alcampo",
        start_date: "2024-06-01",
        end_date: "2024-09-01",
        description: "Asesoramiento hardware y soluciones tecnológicas. Resolución de incidencias técnicas bajo presión y gestión avanzada de stock e inventario.",
        current: false,
        created_at: new Date().toISOString()
    }
];

const certifications: Certification[] = [
    {
        id: "c1",
        title: "English B2 (First Certificate)",
        issuer: "Cambridge Assessment English",
        date: "2024",
        description: "Competencia intermedia-alta certificada, capaz de comunicarse con fluidez en entornos profesionales y técnicos."
    },
    {
        id: "c2",
        title: "AWS Cloud Practitioner Essentials",
        issuer: "Amazon Web Services (AWS)",
        date: "2025",
        description: "Fundamentos de la nube, servicios principales, seguridad y modelos de precios de AWS."
    },
    {
        id: "c3",
        title: "Cybersecurity Essentials",
        issuer: "Cisco Networking Academy",
        date: "2025",
        description: "Principios de protección de datos, mitigación de amenazas y seguridad en redes corporativas."
    }
];

const softSkills = [
    "Resolución de problemas complejos",
    "Comunicación técnica efectiva",
    "Alta adaptabilidad tecnológica",
    "Trabajo en equipo coordinado"
];

export default function ExperiencePage() {
    // Format date string to Month Year (e.g., "Sep 2023")
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric' }).format(date);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -30 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Briefcase className="w-6 h-6 text-orange-500" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Experiencia & Educación</h1>
                </div>
                <p className="text-xl text-muted-foreground mt-4 max-w-3xl">
                    Mi trayectoria profesional y formación académica, centrada en el desarrollo de software de alto impacto.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Main Experience Column */}
                <div className="lg:col-span-2 space-y-12">
                    <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                        <span className="h-8 w-1 bg-orange-500 rounded-full" />
                        Trayectoria Profesional
                    </h2>
                    
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="relative border-l-2 border-muted/50 ml-6 md:ml-8 space-y-12 pb-8"
                    >
                        {experiences.map((exp) => (
                            <motion.div variants={item} key={exp.id} className="relative pl-8 md:pl-0">
                                {/* Timeline Node */}
                                <div className={`absolute -left-[41px] md:-left-[41px] p-2 rounded-full border-4 border-background ${exp.current ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-muted text-muted-foreground'}`}>
                                    {exp.role.toLowerCase().includes('ies') || exp.role.includes('DAW') ? (
                                        <GraduationCap className="w-5 h-5" />
                                    ) : (
                                        <Briefcase className="w-5 h-5" />
                                    )}
                                </div>

                                <div className="md:pl-16">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-orange-600 bg-orange-600/10 px-3 py-1 rounded-full w-fit">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>
                                                {formatDate(exp.start_date)} — {exp.current || !exp.end_date ? 'Presente' : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-medium text-muted-foreground mb-4">{exp.company}</h4>

                                    {exp.description && (
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                            <p>{exp.description}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Sidebar: Certifications & Skills */}
                <div className="space-y-12">
                    {/* Certifications Section */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                            <span className="h-8 w-1 bg-orange-500 rounded-full" />
                            Certificaciones
                        </h2>
                        <div className="space-y-6">
                            {certifications.map((cert) => (
                                <motion.div 
                                    key={cert.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10 hover:border-orange-500/20 transition-all group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                                            {cert.title.toLowerCase().includes('english') ? <Languages className="w-5 h-5 text-orange-600" /> : <Award className="w-5 h-5 text-orange-600" />}
                                        </div>
                                        <span className="text-xs font-bold text-orange-600/80 uppercase tracking-wider">{cert.date}</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{cert.title}</h3>
                                    <p className="text-sm text-balance text-muted-foreground mb-2">{cert.issuer}</p>
                                    <p className="text-xs text-muted-foreground/80 leading-relaxed italic">{cert.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Soft Skills Section */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                            <span className="h-8 w-1 bg-orange-500 rounded-full" />
                            Competencias
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {softSkills.map((skill) => (
                                <span key={skill} className="px-4 py-2 bg-muted/50 rounded-xl text-sm font-medium flex items-center gap-2 border border-transparent hover:border-orange-500/20 transition-colors text-muted-foreground hover:text-foreground">
                                    <CheckCircle2 className="w-4 h-4 text-orange-500" />
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
