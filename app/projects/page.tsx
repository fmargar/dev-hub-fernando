"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, TerminalSquare, AlertCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Project } from "@/types/portfolio";

const projects: Project[] = [
    {
        id: "1",
        title: "Marbella Fácil – Plataforma Smart City & Turismo (TFG)",
        description: "Plataforma SaaS integral. Arquitectura con gestión dinámica de subscripciones, módulo transaccional de reservas en tiempo real e integración con Open-Meteo API.",
        image_url: null,
        tech_stack: ["Laravel 10", "React.js", "Inertia.js", "MySQL"],
        github_url: "https://github.com/fmargar",
        live_url: null,
        created_at: new Date().toISOString()
    },
    {
        id: "2",
        title: "Dev-Hub Fernando",
        description: "Mi portafolio profesional híbrido y laboratorio de herramientas IA/WA construidas con Next.js 15 y diseño ultra-moderno.",
        image_url: null,
        tech_stack: ["Next.js 15", "React", "Framer Motion", "Supabase", "FFmpeg.wasm"],
        github_url: "https://github.com/fmargar",
        live_url: null,
        created_at: new Date().toISOString()
    },
    {
        id: "3",
        title: "Desarrollo de Aplicaciones Web CRUD",
        description: "Despliegue de aplicaciones PHP (puro y frameworks MVC como Symfony) para lógica de negocio, operando con bases de datos relacionales.",
        image_url: null,
        tech_stack: ["PHP", "Symfony", "MySQL", "MariaDB"],
        github_url: "https://github.com/fmargar",
        live_url: null,
        created_at: new Date().toISOString()
    }
];

export default function ProjectsPage() {
    const loading = false;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <TerminalSquare className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Showcase</h1>
                </div>
                <p className="text-xl text-muted-foreground mt-4 max-w-2xl">
                    Una colección de mis proyectos más recientes. Aquí fusiono diseño visual con ingeniería de software robusta.
                </p>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="h-[350px] animate-pulse bg-muted/20" />
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {projects.map((project) => (
                        <motion.div variants={item} key={project.id} className="h-full">
                            <Card className="h-full flex flex-col hover:border-emerald-500/50 transition-colors group">
                                {project.image_url ? (
                                    <div className="w-full h-48 bg-muted overflow-hidden rounded-t-xl">
                                        <img
                                            src={project.image_url}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-48 bg-muted/50 overflow-hidden rounded-t-xl flex items-center justify-center border-b">
                                        <TerminalSquare className="w-12 h-12 text-muted-foreground/30" />
                                    </div>
                                )}

                                <CardHeader>
                                    <CardTitle className="text-xl">{project.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech_stack.map((tech) => (
                                            <Badge key={tech} variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex gap-4 pt-4 border-t">
                                    {project.github_url && (
                                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", size: "sm" }) + " flex-1 gap-2"}>
                                            <Github className="w-4 h-4" /> Código
                                        </a>
                                    )}
                                    {project.live_url && (
                                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "sm" }) + " flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"}>
                                            <ExternalLink className="w-4 h-4" /> Demo
                                        </a>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            )
            }
        </div >
    );
}
