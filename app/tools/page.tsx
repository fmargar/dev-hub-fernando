"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ImagePlus, Scissors, Type, Code2, GitCompare, MessageSquare,
    Key, Hash, FileCode, HardDrive, Lock, QrCode, Image,
    FileType2, Camera, Clock, FileJson2, FileCheck, BookOpen,
    Eye, Palette, Pipette, Layers, ShieldCheck, Regex, AlarmClock,
    Wand2, Monitor, FileText, Search, X, Star, Radio
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useI18n } from "@/i18n";
import { useState, useEffect, useMemo } from "react";

interface Tool {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    color: string;
    category: string;
    tags: string[];
}

const tools: Tool[] = [
    // ── Imagen & Color ───────────────────────────────────────────────────────
    {
        title: "BG-Remover",
        description: "Elimina el fondo de cualquier imagen instantáneamente usando IA directamente en tu navegador.",
        icon: <ImagePlus className="w-8 h-8 text-blue-500" />, href: "/tools/bg-remover",
        color: "bg-blue-500/10", category: "image", tags: ["fondo","background","eliminar","ia","ai"],
    },
    {
        title: "Image Forge",
        description: "Convierte y redimensiona imágenes entre múltiples formatos (WebP, AVIF, PNG, JPG).",
        icon: <Type className="w-8 h-8 text-purple-500" />, href: "/tools/image-forge",
        color: "bg-purple-500/10", category: "image", tags: ["convertir","redimensionar","webp","avif","png","jpg"],
    },
    {
        title: "Compresor de Imágenes",
        description: "Reduce el peso de tus imágenes manteniendo la calidad para optimizar tiempos de carga.",
        icon: <Image className="w-8 h-8 text-pink-500" />, href: "/tools/image-compressor",
        color: "bg-pink-500/10", category: "image", tags: ["comprimir","optimizar","peso"],
    },
    {
        title: "Extractor de Metadatos",
        description: "Lee información EXIF de tus fotos: modelo de cámara, fecha, ubicación GPS y más.",
        icon: <Camera className="w-8 h-8 text-indigo-500" />, href: "/tools/exif-reader",
        color: "bg-indigo-500/10", category: "image", tags: ["exif","metadatos","gps","camara","fecha"],
    },
    {
        title: "Simulador de Daltonismo",
        description: "Visualiza cómo perciben tus imágenes personas con deuteranopia, protanopia, tritanopia y más.",
        icon: <Eye className="w-8 h-8 text-purple-500" />, href: "/tools/color-blindness",
        color: "bg-purple-500/10", category: "image", tags: ["daltonismo","colores","accesibilidad","vision","deuteranopia","protanopia"],
    },
    {
        title: "Extractor de Paleta",
        description: "Extrae los colores dominantes de cualquier imagen en HEX, RGB y HSL.",
        icon: <Palette className="w-8 h-8 text-pink-500" />, href: "/tools/palette-extractor",
        color: "bg-pink-500/10", category: "image", tags: ["paleta","color","hex","rgb","hsl","dominante"],
    },
    {
        title: "Color Picker",
        description: "Haz clic en cualquier punto de una imagen para capturar su color exacto en HEX, RGB y HSL.",
        icon: <Pipette className="w-8 h-8 text-cyan-500" />, href: "/tools/image-color-picker",
        color: "bg-cyan-500/10", category: "image", tags: ["color","picker","capturar","cuentagotas","hex"],
    },
    {
        title: "Generador de Gradientes",
        description: "Crea gradientes CSS lineales, radiales y cónicos visualmente. Copia el CSS al instante.",
        icon: <Layers className="w-8 h-8 text-violet-500" />, href: "/tools/gradient-generator",
        color: "bg-violet-500/10", category: "image", tags: ["gradiente","css","color","linear","radial","conic"],
    },
    {
        title: "Favicon Generator",
        description: "Genera el pack completo de favicons (16×16 a 512×512) desde cualquier imagen.",
        icon: <Monitor className="w-8 h-8 text-rose-500" />, href: "/tools/favicon-generator",
        color: "bg-rose-500/10", category: "image", tags: ["favicon","icono","pwa","apple touch","manifest"],
    },

    // ── Video ────────────────────────────────────────────────────────────────
    {
        title: "Video Crunch",
        description: "Comprime vídeos y conviértelos a GIF usando la potencia de FFmpeg.wasm sin salir de la página.",
        icon: <Scissors className="w-8 h-8 text-emerald-500" />, href: "/tools/video-crunch",
        color: "bg-emerald-500/10", category: "video", tags: ["video","comprimir","gif","ffmpeg","wasm"],
    },

    // ── Código ───────────────────────────────────────────────────────────────
    {
        title: "Snippet Generator",
        description: "Transforma tu código en imágenes con estilos atractivos para compartir en redes.",
        icon: <Code2 className="w-8 h-8 text-orange-500" />, href: "/tools/snippet-generator",
        color: "bg-orange-500/10", category: "code", tags: ["snippet","imagen","codigo","compartir"],
    },
    {
        title: "JSON Formatter",
        description: "Valida, formatea o minifica tus estructuras JSON de forma rápida y segura.",
        icon: <FileJson2 className="w-8 h-8 text-emerald-500" />, href: "/tools/json-formatter",
        color: "bg-emerald-500/10", category: "code", tags: ["json","formatear","validar","minificar"],
    },
    {
        title: "SVG to Data URI",
        description: "Convierte archivos SVG en cadenas URI para usar directamente en CSS o HTML.",
        icon: <FileType2 className="w-8 h-8 text-violet-500" />, href: "/tools/svg-to-datauri",
        color: "bg-violet-500/10", category: "code", tags: ["svg","datauri","base64","css","html"],
    },
    {
        title: "Code Beautifier",
        description: "Embellece o minifica código HTML, CSS y JavaScript instantáneamente en el navegador.",
        icon: <Wand2 className="w-8 h-8 text-indigo-500" />, href: "/tools/code-beautifier",
        color: "bg-indigo-500/10", category: "code", tags: ["formatear","embellecer","minificar","html","css","javascript","prettier"],
    },

    // ── Texto ────────────────────────────────────────────────────────────────
    {
        title: "Contador de Palabras",
        description: "Analiza texto con estadísticas detalladas, tiempo de lectura e índice de legibilidad.",
        icon: <FileText className="w-8 h-8 text-cyan-500" />, href: "/tools/word-counter",
        color: "bg-cyan-500/10", category: "text", tags: ["palabras","caracteres","lectura","texto"],
    },
    {
        title: "Comparador de Textos",
        description: "Compara dos textos lado a lado con resaltado de diferencias estilo Git diff.",
        icon: <GitCompare className="w-8 h-8 text-amber-500" />, href: "/tools/text-diff",
        color: "bg-amber-500/10", category: "text", tags: ["diff","comparar","texto","diferencias","git"],
    },
    {
        title: "Lorem Ipsum Generator",
        description: "Genera texto placeholder profesional en español o inglés: párrafos, palabras o listas.",
        icon: <MessageSquare className="w-8 h-8 text-lime-500" />, href: "/tools/lorem-ipsum",
        color: "bg-lime-500/10", category: "text", tags: ["lorem","ipsum","placeholder","texto"],
    },
    {
        title: "Editor Markdown",
        description: "Escribe Markdown y visualiza el resultado en tiempo real. Exporta a .md o .html.",
        icon: <FileText className="w-8 h-8 text-emerald-500" />, href: "/tools/markdown-editor",
        color: "bg-emerald-500/10", category: "text", tags: ["markdown","md","preview","editor","html"],
    },

    // ── Seguridad ────────────────────────────────────────────────────────────
    {
        title: "Password Generator",
        description: "Genera contraseñas seguras con configuración avanzada y medidor de entropía en tiempo real.",
        icon: <Key className="w-8 h-8 text-red-500" />, href: "/tools/password-generator",
        color: "bg-red-500/10", category: "security", tags: ["contraseña","password","seguridad","entropía"],
    },
    {
        title: "Hashing Tool",
        description: "Genera hashes criptográficos MD5, SHA-256 y SHA-512 para verificar integridad de datos.",
        icon: <Hash className="w-8 h-8 text-yellow-500" />, href: "/tools/hash-generator",
        color: "bg-yellow-500/10", category: "security", tags: ["hash","md5","sha","criptografia","integridad"],
    },
    {
        title: "Base64 Encoder/Decoder",
        description: "Codifica y decodifica texto o archivos en Base64. Fundamental para desarrollo web.",
        icon: <FileCode className="w-8 h-8 text-teal-500" />, href: "/tools/base64",
        color: "bg-teal-500/10", category: "security", tags: ["base64","codificar","decodificar"],
    },
    {
        title: "Text Encryptor",
        description: "Encripta mensajes con AES usando una contraseña. Perfecto para compartir información sensible.",
        icon: <Lock className="w-8 h-8 text-rose-500" />, href: "/tools/text-encryptor",
        color: "bg-rose-500/10", category: "security", tags: ["encriptar","aes","cifrar","privacidad"],
    },
    {
        title: "JWT Decoder",
        description: "Decodifica y analiza tokens JWT. Visualiza header, payload y fecha de expiración.",
        icon: <ShieldCheck className="w-8 h-8 text-amber-500" />, href: "/tools/jwt-decoder",
        color: "bg-amber-500/10", category: "security", tags: ["jwt","token","auth","decodificar","payload","header"],
    },

    // ── Conversión ───────────────────────────────────────────────────────────
    {
        title: "Data Units Converter",
        description: "Convierte entre Bytes, KB, MB, GB, TB con precisión binaria (KiB) y decimal.",
        icon: <HardDrive className="w-8 h-8 text-sky-500" />, href: "/tools/data-converter",
        color: "bg-sky-500/10", category: "conversion", tags: ["bytes","kb","mb","gb","tb","convertir"],
    },
    {
        title: "Unix Timestamp",
        description: "Convierte fechas normales a timestamp Unix y viceversa. Esencial para bases de datos.",
        icon: <Clock className="w-8 h-8 text-fuchsia-500" />, href: "/tools/unix-timestamp",
        color: "bg-fuchsia-500/10", category: "conversion", tags: ["timestamp","unix","fecha","tiempo","convertir"],
    },
    {
        title: "CSV to JSON",
        description: "Convierte archivos CSV a JSON y viceversa. Ideal para migración de datos y APIs.",
        icon: <FileJson2 className="w-8 h-8 text-orange-500" />, href: "/tools/csv-json",
        color: "bg-orange-500/10", category: "conversion", tags: ["csv","json","convertir","datos","api"],
    },
    {
        title: "QR Code Generator",
        description: "Genera códigos QR personalizados y lee QR desde imágenes. Soporta URLs, texto y vCards.",
        icon: <QrCode className="w-8 h-8 text-green-500" />, href: "/tools/qr-code",
        color: "bg-green-500/10", category: "conversion", tags: ["qr","codigo","url","vcard","escanear"],
    },
    {
        title: "Calculadora Aspect Ratio",
        description: "Calcula y escala dimensiones manteniendo la proporción. Ideal para imágenes y vídeos responsive.",
        icon: <Monitor className="w-8 h-8 text-sky-500" />, href: "/tools/aspect-ratio",
        color: "bg-sky-500/10", category: "conversion", tags: ["aspect ratio","proporcion","escalar","dimensiones","16:9","responsive"],
    },

    // ── Desarrollo ───────────────────────────────────────────────────────────
    {
        title: ".gitignore Generator",
        description: "Genera archivos .gitignore personalizados según tu stack tecnológico con templates actualizados.",
        icon: <FileCheck className="w-8 h-8 text-slate-500" />, href: "/tools/gitignore-generator",
        color: "bg-slate-500/10", category: "dev", tags: ["gitignore","git","templates","stack"],
    },
    {
        title: "README.md Generator",
        description: "Crea READMEs profesionales para GitHub con plantillas, badges y secciones personalizables.",
        icon: <BookOpen className="w-8 h-8 text-blue-500" />, href: "/tools/readme-generator",
        color: "bg-blue-500/10", category: "dev", tags: ["readme","github","markdown","badges","documentacion"],
    },
    {
        title: "Regex Tester",
        description: "Prueba expresiones regulares en tiempo real con resaltado de coincidencias y grupos.",
        icon: <Regex className="w-8 h-8 text-orange-500" />, href: "/tools/regex-tester",
        color: "bg-orange-500/10", category: "dev", tags: ["regex","expresion regular","patron","test","javascript"],
    },
    {
        title: "Cron Helper",
        description: "Construye y comprende expresiones cron en lenguaje natural. Muestra próximas ejecuciones.",
        icon: <AlarmClock className="w-8 h-8 text-teal-500" />, href: "/tools/cron-helper",
        color: "bg-teal-500/10", category: "dev", tags: ["cron","scheduler","tarea","automatizar","linux","server"],
    },

    // ── Deportes ─────────────────────────────────────────────────────────────
    {
        title: "NBA Live Scores",
        description: "Sigue los marcadores de la NBA en tiempo real. Partidos en directo, finales y programación con auto-refresh.",
        icon: <Radio className="w-8 h-8 text-orange-500" />, href: "/tools/nba-scores",
        color: "bg-orange-500/10", category: "sports", tags: ["nba","baloncesto","basket","scores","tiempo real","live","deportes"],
    },
];

const CATEGORY_LABELS: Record<string, string> = {
    image: "Imagen & Color",
    video: "Video",
    code: "Código",
    text: "Texto",
    security: "Seguridad",
    conversion: "Conversión",
    dev: "Desarrollo",
    sports: "Deportes",
};

const RECENT_KEY = "fmargar_recent_tools";

function getRecent(): string[] {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); } catch { return []; }
}

function saveRecent(href: string) {
    try {
        const prev = getRecent().filter(h => h !== href);
        localStorage.setItem(RECENT_KEY, JSON.stringify([href, ...prev].slice(0, 6)));
    } catch {}
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

export default function ToolsPage() {
    const { t } = useI18n();
    const [search, setSearch] = useState("");
    const [recentHrefs, setRecentHrefs] = useState<string[]>([]);

    useEffect(() => {
        setRecentHrefs(getRecent());
    }, []);

    const filteredTools = useMemo(() => {
        if (!search.trim()) return tools;
        const q = search.toLowerCase();
        return tools.filter(tool =>
            tool.title.toLowerCase().includes(q) ||
            tool.description.toLowerCase().includes(q) ||
            tool.tags.some(tag => tag.includes(q)) ||
            CATEGORY_LABELS[tool.category]?.toLowerCase().includes(q)
        );
    }, [search]);

    const recentTools = useMemo(
        () => recentHrefs.map(href => tools.find(t => t.href === href)).filter(Boolean) as Tool[],
        [recentHrefs]
    );

    const categories = useMemo(
        () => Array.from(new Set(filteredTools.map(t => t.category))),
        [filteredTools]
    );

    const handleToolClick = (href: string) => {
        saveRecent(href);
        setRecentHrefs(getRecent());
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-24 max-w-7xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    {t.tools.title}
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                    {t.tools.description}
                </p>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="relative max-w-lg mx-auto"
                >
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={`Buscar entre ${tools.length} herramientas...`}
                        className="w-full pl-12 pr-10 py-3 bg-muted/20 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-all"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </motion.div>
            </motion.div>

            {/* Recientes */}
            <AnimatePresence>
                {!search && recentTools.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-12"
                    >
                        <h2 className="text-xl font-bold mb-4 text-foreground/80 flex items-center gap-3">
                            <Star className="w-5 h-5 text-orange-500" />
                            Usadas recientemente
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {recentTools.map(tool => (
                                <Link key={tool.href} href={tool.href} onClick={() => handleToolClick(tool.href)}>
                                    <Card className="h-full cursor-pointer hover:border-orange-500/30 hover:shadow-md hover:shadow-orange-500/10 transition-all group">
                                        <CardContent className="p-3 flex flex-col items-center gap-2 text-center">
                                            <div className={`p-2 rounded-lg w-fit ${tool.color} group-hover:scale-110 transition-transform`}>
                                                {tool.icon}
                                            </div>
                                            <span className="text-xs font-medium leading-tight group-hover:text-orange-500 transition-colors line-clamp-2">
                                                {tool.title}
                                            </span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Search info */}
            {search && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
                    <p className="text-sm text-muted-foreground">
                        {filteredTools.length} resultado{filteredTools.length !== 1 ? "s" : ""} para{" "}
                        <span className="text-foreground font-medium">"{search}"</span>
                    </p>
                </motion.div>
            )}

            {/* Search: flat list */}
            {search ? (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredTools.length === 0 ? (
                        <div className="col-span-3 text-center py-16 text-muted-foreground">
                            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p>No se encontraron herramientas para "{search}"</p>
                        </div>
                    ) : (
                        filteredTools.map(tool => (
                            <ToolCard key={tool.href} tool={tool} onClick={() => handleToolClick(tool.href)} />
                        ))
                    )}
                </motion.div>
            ) : (
                /* By category */
                categories.map((category, categoryIndex) => {
                    const categoryTools = filteredTools.filter(t => t.category === category);
                    return (
                        <motion.section
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: categoryIndex * 0.07 }}
                            className="mb-16 last:mb-0"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground/90 flex items-center gap-3">
                                <span className="w-2 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
                                {CATEGORY_LABELS[category] ?? category}
                                <span className="text-base font-normal text-muted-foreground">({categoryTools.length})</span>
                            </h2>
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {categoryTools.map(tool => (
                                    <ToolCard key={tool.href} tool={tool} onClick={() => handleToolClick(tool.href)} />
                                ))}
                            </motion.div>
                        </motion.section>
                    );
                })
            )}
        </div>
    );
}

function ToolCard({ tool, onClick }: { tool: Tool; onClick: () => void }) {
    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Link href={tool.href} onClick={onClick}>
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
    );
}
