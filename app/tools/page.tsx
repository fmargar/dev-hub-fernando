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

// Static tool data: icons, hrefs, colors, tags only.
// Titles and descriptions come from t.tools.list (translations).
// ORDER MUST MATCH the order in the translation files.
const TOOL_STATIC: Omit<Tool, "title" | "description">[] = [
    // ── Image & Color ─────────────────────────────────────────────────────────
    { icon: <ImagePlus className="w-8 h-8 text-blue-500" />, href: "/tools/bg-remover",         color: "bg-blue-500/10",   category: "image",      tags: ["fondo","background","eliminar","ia","ai","bg","remover"] },
    { icon: <Type       className="w-8 h-8 text-purple-500"/>, href: "/tools/image-forge",       color: "bg-purple-500/10", category: "image",      tags: ["convertir","redimensionar","webp","avif","png","jpg"] },
    { icon: <Image      className="w-8 h-8 text-pink-500"  />, href: "/tools/image-compressor",  color: "bg-pink-500/10",   category: "image",      tags: ["comprimir","optimizar","peso","compress"] },
    { icon: <Camera     className="w-8 h-8 text-indigo-500"/>, href: "/tools/exif-reader",       color: "bg-indigo-500/10", category: "image",      tags: ["exif","metadatos","gps","camara","fecha"] },
    { icon: <Eye        className="w-8 h-8 text-purple-500"/>, href: "/tools/color-blindness",   color: "bg-purple-500/10", category: "image",      tags: ["daltonismo","colores","accesibilidad","vision","deuteranopia","protanopia"] },
    { icon: <Palette    className="w-8 h-8 text-pink-500"  />, href: "/tools/palette-extractor", color: "bg-pink-500/10",   category: "image",      tags: ["paleta","color","hex","rgb","hsl","dominante"] },
    { icon: <Pipette    className="w-8 h-8 text-cyan-500"  />, href: "/tools/image-color-picker",color: "bg-cyan-500/10",   category: "image",      tags: ["color","picker","capturar","cuentagotas","hex"] },
    { icon: <Layers     className="w-8 h-8 text-violet-500"/>, href: "/tools/gradient-generator",color: "bg-violet-500/10", category: "image",      tags: ["gradiente","css","color","linear","radial","conic"] },
    { icon: <Monitor    className="w-8 h-8 text-rose-500"  />, href: "/tools/favicon-generator", color: "bg-rose-500/10",   category: "image",      tags: ["favicon","icono","pwa","manifest"] },
    // ── Video ─────────────────────────────────────────────────────────────────
    { icon: <Scissors   className="w-8 h-8 text-emerald-500"/>, href: "/tools/video-crunch",     color: "bg-emerald-500/10",category: "video",      tags: ["video","comprimir","gif","ffmpeg","wasm"] },
    // ── Code ──────────────────────────────────────────────────────────────────
    { icon: <Code2      className="w-8 h-8 text-orange-500"/>, href: "/tools/snippet-generator", color: "bg-orange-500/10", category: "code",       tags: ["snippet","imagen","codigo","compartir"] },
    { icon: <FileJson2  className="w-8 h-8 text-yellow-500"/>, href: "/tools/json-formatter",    color: "bg-yellow-500/10", category: "code",       tags: ["json","formatear","validar","minificar"] },
    { icon: <FileCode   className="w-8 h-8 text-amber-500" />, href: "/tools/svg-to-datauri",    color: "bg-amber-500/10",  category: "code",       tags: ["svg","data uri","css","html","inline"] },
    { icon: <Wand2      className="w-8 h-8 text-lime-500"  />, href: "/tools/code-beautifier",   color: "bg-lime-500/10",   category: "code",       tags: ["beautifier","format","html","css","js","minify"] },
    // ── Text ──────────────────────────────────────────────────────────────────
    { icon: <FileText   className="w-8 h-8 text-teal-500"  />, href: "/tools/word-counter",      color: "bg-teal-500/10",   category: "text",       tags: ["palabras","contador","texto","lectura","estadisticas"] },
    { icon: <GitCompare className="w-8 h-8 text-fuchsia-500"/>,href: "/tools/text-diff",         color: "bg-fuchsia-500/10",category: "text",       tags: ["diff","comparar","texto","diferencias"] },
    { icon: <MessageSquare className="w-8 h-8 text-sky-500"/>, href: "/tools/lorem-ipsum",       color: "bg-sky-500/10",    category: "text",       tags: ["lorem","ipsum","placeholder","texto"] },
    { icon: <BookOpen   className="w-8 h-8 text-green-500" />, href: "/tools/markdown-editor",   color: "bg-green-500/10",  category: "text",       tags: ["markdown","editor","preview","md"] },
    // ── Security ──────────────────────────────────────────────────────────────
    { icon: <Key        className="w-8 h-8 text-red-500"   />, href: "/tools/password-generator",color: "bg-red-500/10",    category: "security",   tags: ["password","contrasena","seguridad","generador"] },
    { icon: <Hash       className="w-8 h-8 text-zinc-500"  />, href: "/tools/hashing-tool",      color: "bg-zinc-500/10",   category: "security",   tags: ["hash","sha","md5","sha256","integridad"] },
    { icon: <ShieldCheck className="w-8 h-8 text-green-500"/>, href: "/tools/base64",            color: "bg-green-500/10",  category: "security",   tags: ["base64","encode","decode","codificar"] },
    { icon: <Lock       className="w-8 h-8 text-orange-500"/>, href: "/tools/text-encryptor",    color: "bg-orange-500/10", category: "security",   tags: ["encrypt","aes","cifrar","seguridad"] },
    { icon: <FileType2  className="w-8 h-8 text-purple-500"/>, href: "/tools/jwt-decoder",       color: "bg-purple-500/10", category: "security",   tags: ["jwt","token","decode","payload"] },
    // ── Conversion ────────────────────────────────────────────────────────────
    { icon: <HardDrive  className="w-8 h-8 text-blue-500"  />, href: "/tools/data-units",        color: "bg-blue-500/10",   category: "conversion", tags: ["bytes","kb","mb","gb","conversion"] },
    { icon: <Clock      className="w-8 h-8 text-orange-500"/>, href: "/tools/unix-timestamp",    color: "bg-orange-500/10", category: "conversion", tags: ["unix","timestamp","fecha","tiempo","epoch"] },
    { icon: <FileCheck  className="w-8 h-8 text-green-500" />, href: "/tools/csv-to-json",       color: "bg-green-500/10",  category: "conversion", tags: ["csv","json","convertir","datos"] },
    { icon: <QrCode     className="w-8 h-8 text-zinc-500"  />, href: "/tools/qr-generator",      color: "bg-zinc-500/10",   category: "conversion", tags: ["qr","code","codigo","url","vcard"] },
    { icon: <Monitor    className="w-8 h-8 text-sky-500"   />, href: "/tools/aspect-ratio",      color: "bg-sky-500/10",    category: "conversion", tags: ["aspect ratio","proporcion","escalar","dimensiones","16:9"] },
    // ── Dev ───────────────────────────────────────────────────────────────────
    { icon: <FileCheck  className="w-8 h-8 text-slate-500" />, href: "/tools/gitignore-generator",color:"bg-slate-500/10",  category: "dev",        tags: ["gitignore","git","templates","stack"] },
    { icon: <BookOpen   className="w-8 h-8 text-blue-500"  />, href: "/tools/readme-generator",  color: "bg-blue-500/10",   category: "dev",        tags: ["readme","github","markdown","badges"] },
    { icon: <Regex      className="w-8 h-8 text-orange-500"/>, href: "/tools/regex-tester",      color: "bg-orange-500/10", category: "dev",        tags: ["regex","expresion regular","patron","test"] },
    { icon: <AlarmClock className="w-8 h-8 text-teal-500"  />, href: "/tools/cron-helper",       color: "bg-teal-500/10",   category: "dev",        tags: ["cron","scheduler","tarea","automatizar"] },
    // ── Sports ────────────────────────────────────────────────────────────────
    { icon: <Radio      className="w-8 h-8 text-orange-500"/>, href: "/tools/nba-scores",        color: "bg-orange-500/10", category: "sports",     tags: ["nba","baloncesto","basket","scores","live"] },
];

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

    // Merge static tool data with translated titles/descriptions
    const tools: Tool[] = useMemo(() => {
        const list = t.tools.list as { title: string; description: string; category: string }[];
        return TOOL_STATIC.map((s, i) => ({
            ...s,
            title: list[i]?.title ?? s.href,
            description: list[i]?.description ?? "",
        }));
    }, [t]);

    // Category labels from translations
    const CATEGORY_LABELS: Record<string, string> = useMemo(() => ({
        image:      t.tools.categories.image,
        video:      t.tools.categories.video,
        code:       t.tools.categories.code,
        text:       t.tools.categories.text,
        security:   t.tools.categories.security,
        conversion: t.tools.categories.conversion,
        dev:        t.tools.categories.dev,
        sports:     t.tools.categories.sports,
    }), [t]);

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
    }, [search, tools, CATEGORY_LABELS]);

    const recentTools = useMemo(
        () => recentHrefs.map(href => tools.find(t => t.href === href)).filter(Boolean) as Tool[],
        [recentHrefs, tools]
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
                        placeholder={t.tools.searchPlaceholder.replace("{count}", String(tools.length))}
                        className="w-full pl-12 pr-10 py-3 bg-muted/20 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-all"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </motion.div>
            </motion.div>

            {/* Recent tools */}
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
                            {t.tools.recentlyUsed}
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
                        {t.tools.searchResults.replace("{count}", String(filteredTools.length))}{" "}
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
                            <p>{t.tools.noResults} "{search}"</p>
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
