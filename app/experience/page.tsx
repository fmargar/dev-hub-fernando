"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Calendar, AlertCircle } from "lucide-react";
import { Experience } from "@/types/portfolio";

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
        id: "Cert-2",
        role: "Cybersecurity Essentials",
        company: "Cisco Networking Academy (Certificación)",
        start_date: "2025-08-01",
        end_date: null,
        description: "Fundamentos de ciberseguridad, protección de datos, amenazas comunes y medidas de mitigación en entornos corporativos.",
        current: false,
        created_at: new Date().toISOString()
    },
    {
        id: "Skills-1",
        role: "Soft Skills & Competencias",
        company: "Transversal",
        start_date: "2024-01-01",
        end_date: null,
        description: "Resolución de problemas complejos, comunicación técnica efectiva, trabajo en equipo coordinado y alta adaptabilidad a nuevos entornos y tecnologías.",
        current: false,
        created_at: new Date().toISOString()
    },
    {
        id: "Cert-1",
        role: "AWS Cloud Practitioner Essentials",
        company: "Amazon Web Services (Certificación)",
        start_date: "2025-07-01",
        end_date: null,
        description: "Formación en fundamentos de la nube AWS, servicios principales, seguridad y cumplimiento. Capacidad para diseñar arquitecturas básicas escalables.",
        current: false,
        created_at: new Date().toISOString()
    },
    {
        id: "3",
        role: "Grado Superior DAW",
        company: "I.E.S. Salduba",
        start_date: "2024-09-15",
        end_date: null,
        description: "Formación técnica avanzada en desarrollo Full Stack. Especialización en Java (Spring Boot), PHP (Laravel), Bases de Datos (MySQL) y control de versiones colaborativo.",
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

export default function ExperiencePage() {
    const loading = false;

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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
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
                <p className="text-xl text-muted-foreground mt-4">
                    Mi recorrido profesional y académico en el mundo del desarrollo de software.
                </p>
            </motion.div>

            {loading ? (
                <div className="space-y-8">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-muted/50 animate-pulse shrink-0" />
                            <div className="flex-1 space-y-3 py-1">
                                <div className="h-6 w-1/3 bg-muted/50 rounded animate-pulse" />
                                <div className="h-4 w-1/4 bg-muted/50 rounded animate-pulse" />
                                <div className="h-20 w-full bg-muted/50 rounded animate-pulse mt-4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="relative border-l-2 border-muted/50 ml-6 md:ml-8 space-y-12 pb-8"
                >
                    {experiences.map((exp, index) => (
                        <motion.div variants={item} key={exp.id} className="relative pl-8 md:pl-0">

                            {/* Timeline Node */}
                            <div className={`absolute -left-[41px] md:-left-[41px] p-2 rounded-full border-4 border-background ${exp.current ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-muted text-muted-foreground'}`}>
                                {exp.role.toLowerCase().includes('estudiante') || exp.company.toLowerCase().includes('ies') ? (
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
            )}
        </div>
    );
}
