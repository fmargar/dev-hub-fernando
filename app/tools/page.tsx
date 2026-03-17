"use client";

import { motion } from "framer-motion";
import {
    ImagePlus, Scissors, Type, Code2, FileText, GitCompare, MessageSquare,
    Key, Hash, FileCode, HardDrive, Lock, QrCode, Image,
    FileType2, Camera, Clock, FileJson2, FileCheck, BookOpen
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useI18n } from "@/i18n";

const tools = [
    // Herramientas de Imagen
    {
        title: "BG-Remover",
        description: "Elimina el fondo de cualquier imagen instantáneamente usando IA directamente en tu navegador.",
        icon: <ImagePlus className="w-8 h-8 text-blue-500" />,
        href: "/tools/bg-remover",
        color: "bg-blue-500/10",
        category: "image"
    },
    {
        title: "Image Forge",
        description: "Convierte y redimensiona imágenes entre múltiples formatos (WebP, AVIF, PNG, JPG).",
        icon: <Type className="w-8 h-8 text-purple-500" />,
        href: "/tools/image-forge",
        color: "bg-purple-500/10",
        category: "image"
    },
    {
        title: "Compresor de Imágenes",
        description: "Reduce el peso de tus imágenes manteniendo la calidad para optimizar tiempos de carga.",
        icon: <Image className="w-8 h-8 text-pink-500" />,
        href: "/tools/image-compressor",
        color: "bg-pink-500/10",
        category: "image"
    },
    {
        title: "Extractor de Metadatos",
        description: "Lee información EXIF de tus fotos: modelo de cámara, fecha, ubicación GPS y más.",
        icon: <Camera className="w-8 h-8 text-indigo-500" />,
        href: "/tools/exif-reader",
        color: "bg-indigo-500/10",
        category: "image"
    },

    // Herramientas de Video
    {
        title: "Video Crunch",
        description: "Comprime vídeos y conviértelos a GIF usando la potencia de FFmpeg.wasm sin salir de la página.",
        icon: <Scissors className="w-8 h-8 text-emerald-500" />,
        href: "/tools/video-crunch",
        color: "bg-emerald-500/10",
        category: "video"
    },

    // Herramientas de Código
    {
        title: "Snippet Generator",
        description: "Transforma tu código fuente en imágenes con estilos atractivos para compartir en redes.",
        icon: <Code2 className="w-8 h-8 text-orange-500" />,
        href: "/tools/snippet-generator",
        color: "bg-orange-500/10",
        category: "code"
    },
    {
        title: "JSON Formatter",
        description: "Valida, formatea o minifica tus estructuras JSON de forma rápida y segura en el navegador.",
        icon: <FileJson2 className="w-8 h-8 text-emerald-500" />,
        href: "/tools/json-formatter",
        color: "bg-emerald-500/10",
        category: "code"
    },
    {
        title: "SVG to Data URI",
        description: "Convierte archivos SVG en cadenas URI para usar directamente en CSS o HTML.",
        icon: <FileType2 className="w-8 h-8 text-violet-500" />,
        href: "/tools/svg-to-datauri",
        color: "bg-violet-500/10",
        category: "code"
    },

    // Herramientas de Texto
    {
        title: "Contador de Palabras",
        description: "Analiza texto con contador de palabras, caracteres, tiempo de lectura e índice de legibilidad.",
        icon: <FileText className="w-8 h-8 text-cyan-500" />,
        href: "/tools/word-counter",
        color: "bg-cyan-500/10",
        category: "text"
    },
    {
        title: "Comparador de Textos",
        description: "Compara dos textos lado a lado con resaltado de diferencias estilo Git diff.",
        icon: <GitCompare className="w-8 h-8 text-amber-500" />,
        href: "/tools/text-diff",
        color: "bg-amber-500/10",
        category: "text"
    },
    {
        title: "Lorem Ipsum Generator",
        description: "Genera texto placeholder profesional en español o inglés: párrafos, palabras o listas.",
        icon: <MessageSquare className="w-8 h-8 text-lime-500" />,
        href: "/tools/lorem-ipsum",
        color: "bg-lime-500/10",
        category: "text"
    },

    // Herramientas de Seguridad
    {
        title: "Password Generator",
        description: "Genera contraseñas seguras con configuración avanzada y medidor de entropía en tiempo real.",
        icon: <Key className="w-8 h-8 text-red-500" />,
        href: "/tools/password-generator",
        color: "bg-red-500/10",
        category: "security"
    },
    {
        title: "Hashing Tool",
        description: "Genera hashes criptográficos MD5, SHA-256 y SHA-512 para verificar integridad de datos.",
        icon: <Hash className="w-8 h-8 text-yellow-500" />,
        href: "/tools/hash-generator",
        color: "bg-yellow-500/10",
        category: "security"
    },
    {
        title: "Base64 Encoder/Decoder",
        description: "Codifica y decodifica texto o archivos en Base64. Fundamental para desarrollo web.",
        icon: <FileCode className="w-8 h-8 text-teal-500" />,
        href: "/tools/base64",
        color: "bg-teal-500/10",
        category: "security"
    },
    {
        title: "Text Encryptor",
        description: "Encripta mensajes con AES usando una contraseña. Perfecto para compartir información sensible.",
        icon: <Lock className="w-8 h-8 text-rose-500" />,
        href: "/tools/text-encryptor",
        color: "bg-rose-500/10",
        category: "security"
    },

    // Herramientas de Conversión
    {
        title: "Data Units Converter",
        description: "Convierte entre Bytes, KB, MB, GB, TB con precisión binaria (KiB) y decimal.",
        icon: <HardDrive className="w-8 h-8 text-sky-500" />,
        href: "/tools/data-converter",
        color: "bg-sky-500/10",
        category: "conversion"
    },
    {
        title: "Unix Timestamp",
        description: "Convierte fechas normales a timestamp Unix y viceversa. Esencial para bases de datos.",
        icon: <Clock className="w-8 h-8 text-fuchsia-500" />,
        href: "/tools/unix-timestamp",
        color: "bg-fuchsia-500/10",
        category: "conversion"
    },
    {
        title: "CSV to JSON",
        description: "Convierte archivos CSV a JSON y viceversa. Ideal para migración de datos y APIs.",
        icon: <FileJson2 className="w-8 h-8 text-orange-500" />,
        href: "/tools/csv-json",
        color: "bg-orange-500/10",
        category: "conversion"
    },
    {
        title: "QR Code Generator",
        description: "Genera códigos QR personalizados y lee QR desde imágenes. Soporta URLs, texto y vCards.",
        icon: <QrCode className="w-8 h-8 text-green-500" />,
        href: "/tools/qr-code",
        color: "bg-green-500/10",
        category: "conversion"
    },

    // Herramientas de Desarrollo
    {
        title: ".gitignore Generator",
        description: "Genera archivos .gitignore personalizados según tu stack tecnológico con templates actualizados.",
        icon: <FileCheck className="w-8 h-8 text-slate-500" />,
        href: "/tools/gitignore-generator",
        color: "bg-slate-500/10",
        category: "dev"
    },
    {
        title: "README.md Generator",
        description: "Crea READMEs profesionales para GitHub con plantillas, badges y secciones personalizables.",
        icon: <BookOpen className="w-8 h-8 text-blue-500" />,
        href: "/tools/readme-generator",
        color: "bg-blue-500/10",
        category: "dev"
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
    const { t } = useI18n();

    // Map tools list from translations
    const translatedTools = t.tools.list.map((tool, index) => ({
        ...tools[index],
        title: tool.title,
        description: tool.description,
        category: tool.category
    }));

    // Organizar herramientas por categoría
    const categoryMap: Record<string, string> = {
        image: t.tools.categories.image,
        video: t.tools.categories.video,
        code: t.tools.categories.code,
        text: t.tools.categories.text,
        security: t.tools.categories.security,
        conversion: t.tools.categories.conversion,
        dev: t.tools.categories.dev
    };

    const categories = Array.from(new Set(translatedTools.map(tool => tool.category)));

    return (
        <div className="container mx-auto px-4 py-12 md:py-24 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16 text-center"
            >
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    {t.tools.title}
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    {t.tools.description}
                </p>
            </motion.div>

            {/* Renderizar herramientas por categoría */}
            {categories.map((category, categoryIndex) => {
                const categoryTools = translatedTools.filter(tool => tool.category === category);
                return (
                    <motion.section
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: categoryIndex * 0.1 }}
                        className="mb-16 last:mb-0"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground/90 flex items-center gap-3">
                            <span className="w-2 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
                            {categoryMap[category]}
                            <span className="text-base font-normal text-muted-foreground">({categoryTools.length})</span>
                        </h2>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {categoryTools.map((tool, index) => (
                                <motion.div
                                    key={tool.href}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.03, y: -4 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <Link href={tool.href}>
                                        <Card className="h-full cursor-pointer hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 bg-card/50 backdrop-blur-sm group">
                                            <CardHeader className="pb-4">
                                                <div className={`p-3 rounded-xl w-fit mb-3 ${tool.color} group-hover:scale-110 transition-transform duration-300`}>
                                                    {tool.icon}
                                                </div>
                                                <CardTitle className="text-xl font-bold group-hover:text-orange-500 transition-colors">
                                                    {tool.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                                                    {tool.description}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.section>
                );
            })}
        </div>
    );
}
