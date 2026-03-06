"use client";

import { motion } from "framer-motion";
import { ImagePlus, Scissors, Type, Code2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const tools = [
    {
        title: "BG-Remover",
        description: "Elimina el fondo de cualquier imagen instantáneamente usando IA directamente en tu navegador.",
        icon: <ImagePlus className="w-8 h-8 text-blue-500" />,
        href: "/tools/bg-remover",
        color: "bg-blue-500/10",
    },
    {
        title: "Image Forge",
        description: "Convierte y redimensiona imágenes entre múltiples formatos (WebP, AVIF, PNG, JPG).",
        icon: <Type className="w-8 h-8 text-purple-500" />,
        href: "/tools/image-forge",
        color: "bg-purple-500/10",
    },
    {
        title: "Video Crunch",
        description: "Comprime vídeos y conviértelos a GIF usando la potencia de FFmpeg.wasm sin salir de la página.",
        icon: <Scissors className="w-8 h-8 text-emerald-500" />,
        href: "/tools/video-crunch",
        color: "bg-emerald-500/10",
    },
    {
        title: "Snippet Generator",
        description: "Transforma tu código fuente en imágenes con estilos atractivos para compartir en redes.",
        icon: <Code2 className="w-8 h-8 text-orange-500" />,
        href: "/tools/snippet-generator",
        color: "bg-orange-500/10",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

export default function ToolsPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center md:text-left"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">El Laboratorio</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    Colección de herramientas de alto rendimiento que procesan archivos localmente en tu navegador.
                    Sin subir datos a servidores de terceros, máxima privacidad y velocidad.
                </p>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {tools.map((tool) => (
                    <motion.div key={tool.href} variants={itemVariants} whileHover={{ scale: 1.02 }}>
                        <Link href={tool.href}>
                            <Card className="h-full cursor-pointer hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <div className={`p-3 rounded-lg w-fit mb-4 ${tool.color}`}>
                                        {tool.icon}
                                    </div>
                                    <CardTitle className="text-2xl">{tool.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-muted-foreground">
                                        {tool.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
