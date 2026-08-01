"use client";

import {
    ImagePlus, Scissors, Type, Code2, GitCompare, MessageSquare,
    Key, Hash, FileCode, HardDrive, Lock, QrCode, Image as ImageIcon,
    FileType2, Camera, Clock, FileJson2, FileCheck, BookOpen,
    Eye, Palette, Pipette, Layers, ShieldCheck, Regex, AlarmClock,
    Wand2, Monitor, FileText, Search, X, Radio
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/i18n";
import { useState, useMemo, useSyncExternalStore } from "react";

interface Tool {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    category: string;
    tags: string[];
}

// Datos estáticos: icono, ruta, categoría y etiquetas de búsqueda.
// Los títulos y descripciones vienen de t.tools.list y EL ORDEN DEBE COINCIDIR
// con el de los ficheros de traducción.
const TOOL_STATIC: Omit<Tool, "title" | "description">[] = [
    // ── Imagen y color ────────────────────────────────────────────────────────
    { icon: <ImagePlus />,     href: "/tools/bg-remover",          category: "image",      tags: ["fondo","background","eliminar","ia","ai","bg","remover"] },
    { icon: <Type />,          href: "/tools/image-forge",         category: "image",      tags: ["convertir","redimensionar","webp","avif","png","jpg"] },
    { icon: <ImageIcon />,     href: "/tools/image-compressor",    category: "image",      tags: ["comprimir","optimizar","peso","compress"] },
    { icon: <Camera />,        href: "/tools/exif-reader",         category: "image",      tags: ["exif","metadatos","gps","camara","fecha"] },
    { icon: <Eye />,           href: "/tools/color-blindness",     category: "image",      tags: ["daltonismo","colores","accesibilidad","vision","deuteranopia","protanopia"] },
    { icon: <Palette />,       href: "/tools/palette-extractor",   category: "image",      tags: ["paleta","color","hex","rgb","hsl","dominante"] },
    { icon: <Pipette />,       href: "/tools/image-color-picker",  category: "image",      tags: ["color","picker","capturar","cuentagotas","hex"] },
    { icon: <Layers />,        href: "/tools/gradient-generator",  category: "image",      tags: ["gradiente","css","color","linear","radial","conic"] },
    { icon: <Monitor />,       href: "/tools/favicon-generator",   category: "image",      tags: ["favicon","icono","pwa","manifest"] },
    // ── Vídeo ─────────────────────────────────────────────────────────────────
    { icon: <Scissors />,      href: "/tools/video-crunch",        category: "video",      tags: ["video","comprimir","gif","ffmpeg","wasm"] },
    // ── Código ────────────────────────────────────────────────────────────────
    { icon: <Code2 />,         href: "/tools/snippet-generator",   category: "code",       tags: ["snippet","imagen","codigo","compartir"] },
    { icon: <FileJson2 />,     href: "/tools/json-formatter",      category: "code",       tags: ["json","formatear","validar","minificar"] },
    { icon: <FileCode />,      href: "/tools/svg-to-datauri",      category: "code",       tags: ["svg","data uri","css","html","inline"] },
    { icon: <Wand2 />,         href: "/tools/code-beautifier",     category: "code",       tags: ["beautifier","format","html","css","js","minify"] },
    // ── Texto ─────────────────────────────────────────────────────────────────
    { icon: <FileText />,      href: "/tools/word-counter",        category: "text",       tags: ["palabras","contador","texto","lectura","estadisticas"] },
    { icon: <GitCompare />,    href: "/tools/text-diff",           category: "text",       tags: ["diff","comparar","texto","diferencias"] },
    { icon: <MessageSquare />, href: "/tools/lorem-ipsum",         category: "text",       tags: ["lorem","ipsum","placeholder","texto"] },
    { icon: <BookOpen />,      href: "/tools/markdown-editor",     category: "text",       tags: ["markdown","editor","preview","md"] },
    // ── Seguridad ─────────────────────────────────────────────────────────────
    { icon: <Key />,           href: "/tools/password-generator",  category: "security",   tags: ["password","contrasena","seguridad","generador"] },
    { icon: <Hash />,          href: "/tools/hash-generator",      category: "security",   tags: ["hash","sha","md5","sha256","integridad"] },
    { icon: <ShieldCheck />,   href: "/tools/base64",              category: "security",   tags: ["base64","encode","decode","codificar"] },
    { icon: <Lock />,          href: "/tools/text-encryptor",      category: "security",   tags: ["encrypt","aes","cifrar","seguridad"] },
    { icon: <FileType2 />,     href: "/tools/jwt-decoder",         category: "security",   tags: ["jwt","token","decode","payload"] },
    // ── Conversión ────────────────────────────────────────────────────────────
    { icon: <HardDrive />,     href: "/tools/data-converter",      category: "conversion", tags: ["bytes","kb","mb","gb","conversion"] },
    { icon: <Clock />,         href: "/tools/unix-timestamp",      category: "conversion", tags: ["unix","timestamp","fecha","tiempo","epoch"] },
    { icon: <FileCheck />,     href: "/tools/csv-json",            category: "conversion", tags: ["csv","json","convertir","datos"] },
    { icon: <QrCode />,        href: "/tools/qr-code",             category: "conversion", tags: ["qr","code","codigo","url","vcard"] },
    { icon: <Monitor />,       href: "/tools/aspect-ratio",        category: "conversion", tags: ["aspect ratio","proporcion","escalar","dimensiones","16:9"] },
    // ── Desarrollo ────────────────────────────────────────────────────────────
    { icon: <FileCheck />,     href: "/tools/gitignore-generator", category: "dev",        tags: ["gitignore","git","templates","stack"] },
    { icon: <BookOpen />,      href: "/tools/readme-generator",    category: "dev",        tags: ["readme","github","markdown","badges"] },
    { icon: <Regex />,         href: "/tools/regex-tester",        category: "dev",        tags: ["regex","expresion regular","patron","test"] },
    { icon: <AlarmClock />,    href: "/tools/cron-helper",         category: "dev",        tags: ["cron","scheduler","tarea","automatizar"] },
    // ── Deportes ──────────────────────────────────────────────────────────────
    { icon: <Radio />,         href: "/tools/nba-scores",          category: "sports",     tags: ["nba","baloncesto","basket","scores","live"] },
];

/* ── Herramientas usadas recientemente ────────────────────────────────────────
   Viven en localStorage, que el servidor no puede leer. Se exponen con
   `useSyncExternalStore` en vez de con un efecto de montaje: así el HTML del
   servidor y el primer render del cliente coinciden sin renders en cascada.
   ─────────────────────────────────────────────────────────────────────────── */

const RECENT_KEY = "fmargar_recent_tools";
const RECENT_EVENT = "fmargar:recent-tools";

function subscribeRecent(onChange: () => void) {
    window.addEventListener(RECENT_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
        window.removeEventListener(RECENT_EVENT, onChange);
        window.removeEventListener("storage", onChange);
    };
}

// Devuelve la cadena cruda: debe ser estable entre llamadas o el store entra en bucle.
function getRecentSnapshot(): string {
    try { return localStorage.getItem(RECENT_KEY) ?? "[]"; } catch { return "[]"; }
}

function getRecentServerSnapshot(): string {
    return "[]";
}

function parseRecent(raw: string): string[] {
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveRecent(href: string) {
    try {
        const prev = parseRecent(getRecentSnapshot()).filter(h => h !== href);
        localStorage.setItem(RECENT_KEY, JSON.stringify([href, ...prev].slice(0, 6)));
        window.dispatchEvent(new Event(RECENT_EVENT));
    } catch {}
}

export function ToolsView() {
    const { t } = useI18n();
    const [search, setSearch] = useState("");
    const rawRecent = useSyncExternalStore(subscribeRecent, getRecentSnapshot, getRecentServerSnapshot);
    const recentHrefs = useMemo(() => parseRecent(rawRecent), [rawRecent]);

    const tools: Tool[] = useMemo(() => {
        const list = t.tools.list as { title: string; description: string; category: string }[];
        return TOOL_STATIC.map((s, i) => ({
            ...s,
            title: list[i]?.title ?? s.href,
            description: list[i]?.description ?? "",
        }));
    }, [t]);

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
        () => recentHrefs.map(href => tools.find(tool => tool.href === href)).filter(Boolean) as Tool[],
        [recentHrefs, tools]
    );

    const categories = useMemo(
        () => Array.from(new Set(filteredTools.map(tool => tool.category))),
        [filteredTools]
    );

    const handleToolClick = (href: string) => {
        saveRecent(href);
    };

    return (
        <div className="container-page section">
            <header className="page-grid">
                <div className="rail">
                    <p className="eyebrow">{t.tools.title}</p>
                </div>
                <div className="rail-body">
                    <h1 className="display-1">{t.tools.title}</h1>
                    <p className="lead mt-6 measure">{t.tools.description}</p>
                </div>
            </header>

            <div className="relative mt-10 max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <label htmlFor="tool-search" className="sr-only">{t.tools.title}</label>
                <input
                    id="tool-search"
                    type="search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t.tools.searchPlaceholder.replace("{count}", String(tools.length))}
                    className="w-full rounded-md border border-[var(--input)] bg-[var(--background)] py-2.5 pl-10 pr-10 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--accent-vivid)] transition-colors"
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        aria-label={t.common.clear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {!search && recentTools.length > 0 && (
                <section className="mt-12">
                    <h2 className="eyebrow mb-4">{t.tools.recentlyUsed}</h2>
                    <div className="flex flex-wrap gap-2">
                        {recentTools.map(tool => (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                onClick={() => handleToolClick(tool.href)}
                                className="rounded-md border border-[var(--rule)] px-3 py-2 text-sm hover:border-[var(--accent-vivid)] hover:text-[var(--accent-text)] transition-colors"
                            >
                                {tool.title}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {search && (
                <p className="mt-8 text-sm text-muted-foreground">
                    {t.tools.searchResults.replace("{count}", String(filteredTools.length))}{" "}
                    <span className="text-foreground">&laquo;{search}&raquo;</span>
                </p>
            )}

            {search ? (
                filteredTools.length === 0 ? (
                    <p className="mt-12 text-sm text-muted-foreground">
                        {t.tools.noResults} &laquo;{search}&raquo;
                    </p>
                ) : (
                    <ToolGrid tools={filteredTools} onSelect={handleToolClick} />
                )
            ) : (
                <div className="mt-4">
                    {categories.map(category => (
                        <section key={category} className="mt-14">
                            <div className="flex items-baseline justify-between gap-6 border-b border-[var(--rule-strong)] pb-3">
                                <h2 className="display-3">{CATEGORY_LABELS[category] ?? category}</h2>
                                <span className="font-mono text-xs text-muted-foreground">
                                    {String(filteredTools.filter(tool => tool.category === category).length).padStart(2, "0")}
                                </span>
                            </div>
                            <ToolGrid
                                tools={filteredTools.filter(tool => tool.category === category)}
                                onSelect={handleToolClick}
                            />
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}

function ToolGrid({ tools, onSelect }: { tools: Tool[]; onSelect: (href: string) => void }) {
    return (
        /* Las separaciones son bordes por celda, no un fondo con `gap-px`: con ese
           truco, una última fila incompleta deja el hueco pintado del color de la
           línea y parece un bloque roto. */
        <ul className="mt-6 grid border-t border-[var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(tool => (
                <li key={tool.href} className="border-b border-[var(--rule)]">
                    <Link
                        href={tool.href}
                        onClick={() => onSelect(tool.href)}
                        className="group flex h-full gap-3.5 p-5 hover:bg-[var(--surface-subtle)] transition-colors"
                    >
                        <span
                            className="mt-0.5 shrink-0 text-muted-foreground group-hover:text-[var(--accent-text)] transition-colors [&>svg]:h-5 [&>svg]:w-5"
                            aria-hidden="true"
                        >
                            {tool.icon}
                        </span>
                        <span className="min-w-0">
                            <span className="block text-sm font-medium group-hover:text-[var(--accent-text)] transition-colors">
                                {tool.title}
                            </span>
                            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                                {tool.description}
                            </span>
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
