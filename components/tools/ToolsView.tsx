"use client";

import {
    ImagePlus, Scissors, Type, Code2, GitCompare, MessageSquare,
    Key, Hash, FileCode, HardDrive, Lock, QrCode, Image as ImageIcon,
    FileType2, Camera, Clock, FileJson2, FileCheck, BookOpen,
    Eye, Palette, Pipette, Layers, ShieldCheck, Regex, AlarmClock,
    Wand2, Monitor, FileText, Radio
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/i18n";
import { useState, useMemo, useSyncExternalStore } from "react";
import { Icon, useHoverIcon } from "@/components/ui/hover-icon";
import MagnifierIcon from "@/icons/magnifier-icon";
import XIcon from "@/icons/x-icon";
import { TOOLS } from "@/content/tools";

interface Tool {
    slug: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    category: string;
    tags: string[];
}

// Icono por slug. Título, descripción, categoría y tags viven en
// content/tools.ts + t.tools.list[slug] — sin acoplamiento por posición.
const TOOL_ICONS: Record<string, React.ReactNode> = {
    "bg-remover": <ImagePlus />,
    "image-forge": <Type />,
    "image-compressor": <ImageIcon />,
    "exif-reader": <Camera />,
    "color-blindness": <Eye />,
    "palette-extractor": <Palette />,
    "image-color-picker": <Pipette />,
    "gradient-generator": <Layers />,
    "favicon-generator": <Monitor />,
    "video-crunch": <Scissors />,
    "snippet-generator": <Code2 />,
    "json-formatter": <FileJson2 />,
    "svg-to-datauri": <FileCode />,
    "code-beautifier": <Wand2 />,
    "word-counter": <FileText />,
    "text-diff": <GitCompare />,
    "lorem-ipsum": <MessageSquare />,
    "markdown-editor": <BookOpen />,
    "password-generator": <Key />,
    "hash-generator": <Hash />,
    base64: <ShieldCheck />,
    "text-encryptor": <Lock />,
    "jwt-decoder": <FileType2 />,
    "data-converter": <HardDrive />,
    "unix-timestamp": <Clock />,
    "csv-json": <FileCheck />,
    "qr-code": <QrCode />,
    "aspect-ratio": <Monitor />,
    "gitignore-generator": <FileCheck />,
    "readme-generator": <BookOpen />,
    "regex-tester": <Regex />,
    "cron-helper": <AlarmClock />,
    "nba-scores": <Radio />,
};

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

function buildTools(list: Record<string, { title: string; description: string }>): Tool[] {
    return TOOLS.map((meta) => {
        const entry = list[meta.slug];
        return {
            ...meta,
            href: `/tools/${meta.slug}`,
            icon: TOOL_ICONS[meta.slug],
            title: entry.title,
            description: entry.description,
        };
    });
}

export function ToolsView() {
    const { t } = useI18n();
    const [search, setSearch] = useState("");
    const [glassRef, glassHover] = useHoverIcon();
    const [clearRef, clearHover] = useHoverIcon();
    const rawRecent = useSyncExternalStore(subscribeRecent, getRecentSnapshot, getRecentServerSnapshot);
    const recentHrefs = useMemo(() => parseRecent(rawRecent), [rawRecent]);

    const toolsList = t.tools.list;
    const tools: Tool[] = useMemo(
        () => buildTools(toolsList),
        [toolsList]
    );

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
        <>
        <div className="page-head">
            <div className="container-page">
                <h1 className="display-1">{t.tools.title}</h1>
                <p className="lead measure mt-5">{t.tools.description}</p>

                <div className="relative mt-8 max-w-md" {...glassHover}>
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-subtle)]">
                        <Icon>
                            <MagnifierIcon ref={glassRef} size={16} strokeWidth={1.75} />
                        </Icon>
                    </span>
                    <label htmlFor="tool-search" className="sr-only">{t.tools.title}</label>
                    <input
                        id="tool-search"
                        type="search"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={t.tools.searchPlaceholder.replace("{count}", String(tools.length))}
                        className="field pl-10 pr-10"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            aria-label={t.common.clear}
                            {...clearHover}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-subtle)] hover:text-[var(--fg)]"
                        >
                            <Icon>
                                <XIcon ref={clearRef} size={16} strokeWidth={1.75} />
                            </Icon>
                        </button>
                    )}
                </div>
            </div>
        </div>

        <div className="container-page section">

            {!search && recentTools.length > 0 && (
                <section>
                    <h2 className="text-sm font-semibold">{t.tools.recentlyUsed}</h2>
                    <div className="mt-3.5 flex flex-wrap gap-2">
                        {recentTools.map(tool => (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                onClick={() => handleToolClick(tool.href)}
                                className="chip px-3 py-1.5 text-sm transition-colors hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
                            >
                                {tool.title}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {search && (
                <p className="text-sm text-[var(--fg-muted)]">
                    {t.tools.searchResults.replace("{count}", String(filteredTools.length))}{" "}
                    <span className="text-[var(--fg)]">&laquo;{search}&raquo;</span>
                </p>
            )}

            {search ? (
                filteredTools.length === 0 ? (
                    <p className="mt-10 text-sm text-[var(--fg-muted)]">
                        {t.tools.noResults} &laquo;{search}&raquo;
                    </p>
                ) : (
                    <ToolGrid tools={filteredTools} onSelect={handleToolClick} />
                )
            ) : (
                <>
                    {categories.map(category => (
                        <section key={category} className="mt-14 first:mt-0">
                            <div className="flex items-baseline justify-between gap-6 border-b border-[var(--line)] pb-3">
                                <h2 className="display-3">{CATEGORY_LABELS[category] ?? category}</h2>
                                <span className="data">
                                    {filteredTools.filter(tool => tool.category === category).length}
                                </span>
                            </div>
                            <ToolGrid
                                tools={filteredTools.filter(tool => tool.category === category)}
                                onSelect={handleToolClick}
                            />
                        </section>
                    ))}
                </>
            )}
        </div>
        </>
    );
}

/* Un directorio de utilidades sí es una lista de iguales, así que aquí la
   retícula regular es la forma honesta. Lo que evita que parezca una plantilla
   es que las tarjetas no llevan sombra ni marco pesado: son celdas de una lista
   que se levantan al pasar por encima. */
function ToolGrid({ tools, onSelect }: { tools: Tool[]; onSelect: (href: string) => void }) {
    return (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(tool => (
                <li key={tool.href}>
                    <Link
                        href={tool.href}
                        onClick={() => onSelect(tool.href)}
                        className="surface-flat surface-lift group flex h-full gap-3.5 p-5"
                    >
                        <span
                            className="mt-0.5 shrink-0 text-[var(--fg-subtle)] transition-colors group-hover:text-[var(--accent)] [&>svg]:h-[1.125rem] [&>svg]:w-[1.125rem]"
                            aria-hidden="true"
                        >
                            {tool.icon}
                        </span>
                        <span className="min-w-0">
                            <span className="block text-sm font-medium transition-colors group-hover:text-[var(--accent)]">
                                {tool.title}
                            </span>
                            <span className="mt-1 block text-xs leading-relaxed text-[var(--fg-muted)]">
                                {tool.description}
                            </span>
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
