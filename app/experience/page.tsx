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
        description: "Migración y unificación de bases de datos de Marbella y San Pedro desde archivos CSV a PostgreSQL. Desarrollo de una aplicación web CRUD para la gestión integral de vados en Marbella, incluyendo un sistema de registro de auditoría, despliegue en la Intranet municipal e integración con Directorio Activo para el inicio de sesión.",
        current: true,
        created_at: new Date().toISOString()
    },
    {
        id: "1",
        role: "Desarrollador Web (Prácticas)",
        company: "ASISA",
        start_date: "2025-01-01",
        end_date: "2025-06-30",
        description: "Gestión y mantenimiento técnico de portales corporativos web. Personalización y configuración de módulos para optimizar el rendimiento y la funcionalidad del sitio. Colaboración en el diseño de interfaces (UI) responsivas y mejora de la experiencia de usuario (UX).",
        current: false,
        created_at: new Date().toISOString()
    },
    {
        id: "3",
        role: "Grado Superior en Desarrollo de Aplicaciones Web (DAW)",
        company: "I.E.S. Salduba",
        start_date: "2024-09-15",
        end_date: null,
        description: "Desarrollo Backend (Java Spring Boot, PHP), Frontend (JavaScript, React), Bases de Datos (MySQL), y control de versiones colaborativo con Git/GitHub.",
        current: true,
        created_at: new Date().toISOString()
    },
    {
        id: "2",
        role: "Vendedor Técnico - Informática y Tecnología",
        company: "Alcampo",
        start_date: "2024-06-01",
        end_date: "2024-09-01",
        description: "Asesoramiento técnico especializado en hardware y soluciones de consumo según requisitos del cliente. Gestión de stock tecnológico y organización de inventario en el área de informática.",
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
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Briefcase className="w-6 h-6 text-emerald-500" />
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
                            <div className={`absolute -left-[41px] md:-left-[41px] p-2 rounded-full border-4 border-background ${exp.current ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                                {exp.role.toLowerCase().includes('estudiante') || exp.company.toLowerCase().includes('ies') ? (
                                    <GraduationCap className="w-5 h-5" />
                                ) : (
                                    <Briefcase className="w-5 h-5" />
                                )}
                            </div>

                            <div className="md:pl-16">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
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
