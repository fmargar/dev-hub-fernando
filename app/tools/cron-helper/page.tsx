"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Copy, Check, RefreshCw, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CronField {
    name: string;
    label: string;
    min: number;
    max: number;
    placeholder: string;
    examples: { value: string; desc: string }[];
}

const FIELDS: CronField[] = [
    { name: "minute", label: "Minuto", min: 0, max: 59, placeholder: "*", examples: [{ value: "*", desc: "Cada minuto" }, { value: "0", desc: "Minuto 0" }, { value: "*/15", desc: "Cada 15 min" }, { value: "0,30", desc: "Min 0 y 30" }] },
    { name: "hour", label: "Hora", min: 0, max: 23, placeholder: "*", examples: [{ value: "*", desc: "Cada hora" }, { value: "8", desc: "8:00" }, { value: "8-18", desc: "8 a 18h" }, { value: "*/6", desc: "Cada 6h" }] },
    { name: "dayOfMonth", label: "Día del mes", min: 1, max: 31, placeholder: "*", examples: [{ value: "*", desc: "Cada día" }, { value: "1", desc: "Día 1" }, { value: "L", desc: "Último día" }, { value: "1,15", desc: "Días 1 y 15" }] },
    { name: "month", label: "Mes", min: 1, max: 12, placeholder: "*", examples: [{ value: "*", desc: "Cada mes" }, { value: "1", desc: "Enero" }, { value: "6,12", desc: "Jun/Dic" }, { value: "*/3", desc: "Trimestral" }] },
    { name: "dayOfWeek", label: "Día semana", min: 0, max: 6, placeholder: "*", examples: [{ value: "*", desc: "Cada día" }, { value: "1-5", desc: "Lun-Vie" }, { value: "0,6", desc: "Fines de semana" }, { value: "1", desc: "Lunes" }] },
];

const PRESETS = [
    { label: "Cada minuto", cron: "* * * * *" },
    { label: "Cada hora", cron: "0 * * * *" },
    { label: "Diario a las 00:00", cron: "0 0 * * *" },
    { label: "Diario a las 8:00", cron: "0 8 * * *" },
    { label: "Cada lunes 9:00", cron: "0 9 * * 1" },
    { label: "Cada semana", cron: "0 0 * * 0" },
    { label: "Mensual (día 1)", cron: "0 0 1 * *" },
    { label: "Anual (1 ene)", cron: "0 0 1 1 *" },
    { label: "Lun–Vie 9–18h", cron: "0 9-18 * * 1-5" },
    { label: "Cada 15 min", cron: "*/15 * * * *" },
    { label: "Cada 6 horas", cron: "0 */6 * * *" },
    { label: "Cada 30 min (lab)", cron: "*/30 8-18 * * 1-5" },
];

const MONTH_NAMES = ["", "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function describePart(value: string, field: CronField): string {
    if (value === "*") return null as unknown as string;
    if (value.startsWith("*/")) {
        const step = parseInt(value.slice(2));
        if (field.name === "minute") return `cada ${step} minutos`;
        if (field.name === "hour") return `cada ${step} horas`;
        if (field.name === "month") return `cada ${step} meses`;
        return `cada ${step} ${field.label.toLowerCase()}`;
    }
    if (value.includes("-")) {
        const [a, b] = value.split("-");
        if (field.name === "dayOfWeek") return `de ${DAY_NAMES[parseInt(a)]} a ${DAY_NAMES[parseInt(b)]}`;
        if (field.name === "hour") return `de ${a}:00 a ${b}:00`;
        return `desde ${a} hasta ${b}`;
    }
    if (value.includes(",")) {
        const parts = value.split(",");
        if (field.name === "dayOfWeek") return parts.map(p => DAY_NAMES[parseInt(p)]).join(" y ");
        if (field.name === "month") return parts.map(p => MONTH_NAMES[parseInt(p)]).join(" y ");
        return `en ${parts.join(" y ")}`;
    }
    const num = parseInt(value);
    if (field.name === "dayOfWeek") return DAY_NAMES[num] ?? value;
    if (field.name === "month") return MONTH_NAMES[num] ?? value;
    if (field.name === "hour") return `a las ${value}:00`;
    if (field.name === "minute") return `al minuto ${value}`;
    if (field.name === "dayOfMonth") return `el día ${value}`;
    return value;
}

function humanReadable(cron: string): string {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 5) return "Expresión inválida (necesita 5 campos)";
    const [min, hr, dom, mon, dow] = parts;

    if (cron === "* * * * *") return "Cada minuto";
    if (dom === "*" && mon === "*" && dow === "*") {
        const hourDesc = describePart(hr, FIELDS[1]);
        const minDesc = describePart(min, FIELDS[0]);
        if (!hourDesc && !minDesc) return "Cada minuto";
        if (!hourDesc && minDesc) return `Ejecutar ${minDesc}`;
        if (hr !== "*" && !hr.includes("*/") && !hr.includes("-") && !hr.includes(",")) {
            const minuteStr = min === "0" ? "" : ` y ${minDesc}`;
            return `Cada día a las ${hr}:${min.padStart(2, "0")}`;
        }
        return `${minDesc ? minDesc : "Cada minuto"}, ${hourDesc ?? "cada hora"}`;
    }

    const pieces: string[] = [];
    const minD = describePart(min, FIELDS[0]);
    const hrD = describePart(hr, FIELDS[1]);
    const domD = describePart(dom, FIELDS[2]);
    const monD = describePart(mon, FIELDS[3]);
    const dowD = describePart(dow, FIELDS[4]);

    if (minD) pieces.push(minD);
    if (hrD) pieces.push(hrD);
    if (domD) pieces.push(domD);
    if (monD) pieces.push(`en ${monD}`);
    if (dowD) pieces.push(`los ${dowD}`);

    return pieces.length ? pieces.join(", ") : "Cada minuto";
}

function getNextRuns(cron: string, count = 5): string[] {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 5) return [];
    // Simplified: just show generic next runs based on description
    const now = new Date();
    const results: string[] = [];
    let d = new Date(now.getTime() + 60000);
    let attempts = 0;
    while (results.length < count && attempts < 10000) {
        attempts++;
        const [min, hr, dom, mon, dow] = parts;
        const matches = (val: string, actual: number, min_: number): boolean => {
            if (val === "*") return true;
            if (val.startsWith("*/")) return actual % parseInt(val.slice(2)) === 0;
            if (val.includes("-")) { const [a, b] = val.split("-").map(Number); return actual >= a && actual <= b; }
            if (val.includes(",")) return val.split(",").map(Number).includes(actual);
            return parseInt(val) === actual;
        };
        if (
            matches(mon, d.getMonth() + 1, 1) &&
            matches(dom, d.getDate(), 1) &&
            matches(dow, d.getDay(), 0) &&
            matches(hr, d.getHours(), 0) &&
            matches(min, d.getMinutes(), 0)
        ) {
            results.push(d.toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }));
            d = new Date(d.getTime() + 60000);
        } else {
            d = new Date(d.getTime() + 60000);
        }
    }
    return results;
}

export default function CronHelperPage() {
    const [fields, setFields] = useState({ minute: "*", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" });
    const [copied, setCopied] = useState(false);

    const cronExpr = `${fields.minute} ${fields.hour} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`;
    const description = useMemo(() => humanReadable(cronExpr), [cronExpr]);
    const nextRuns = useMemo(() => getNextRuns(cronExpr), [cronExpr]);

    const loadPreset = (cron: string) => {
        const [minute, hour, dayOfMonth, month, dayOfWeek] = cron.split(" ");
        setFields({ minute, hour, dayOfMonth, month, dayOfWeek });
    };

    const copy = async () => {
        await navigator.clipboard.writeText(cronExpr);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-teal-500/10 rounded-lg">
                        <Clock className="w-6 h-6 text-teal-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Cron Expression Helper</h1>
                </div>
                <p className="text-muted-foreground">Construye y entiende expresiones cron. Traductor a lenguaje natural y próximas ejecuciones.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Builder */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-4">
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Constructor visual</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            {/* Expression display */}
                            <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-3 font-mono">
                                {FIELDS.map((f, i) => (
                                    <div key={f.name} className="flex items-center gap-1">
                                        <div className="text-center">
                                            <div className="text-teal-400 font-bold text-sm">{fields[f.name as keyof typeof fields]}</div>
                                            <div className="text-[10px] text-muted-foreground">{f.label}</div>
                                        </div>
                                        {i < FIELDS.length - 1 && <span className="text-muted-foreground mx-1">·</span>}
                                    </div>
                                ))}
                                <Button size="sm" className="ml-auto bg-teal-600 hover:bg-teal-700 text-white" onClick={copy}>
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>

                            {/* Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                                {FIELDS.map(f => (
                                    <div key={f.name}>
                                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                            {f.label} <span className="text-xs opacity-50">({f.min}–{f.max})</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={fields[f.name as keyof typeof fields]}
                                            onChange={e => setFields(prev => ({ ...prev, [f.name]: e.target.value }))}
                                            className="w-full px-2 py-1.5 bg-muted/20 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm text-center"
                                            placeholder={f.placeholder}
                                        />
                                        <div className="mt-1.5 flex flex-wrap gap-1">
                                            {f.examples.map(ex => (
                                                <button
                                                    key={ex.value}
                                                    onClick={() => setFields(prev => ({ ...prev, [f.name]: ex.value }))}
                                                    className="px-1.5 py-0.5 text-[10px] bg-muted/30 hover:bg-teal-500/20 hover:text-teal-400 rounded border border-border/30 font-mono transition-colors"
                                                    title={ex.desc}
                                                >
                                                    {ex.value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card className="border-teal-500/20 bg-teal-500/5">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Esto significa:</p>
                                    <p className="text-teal-400 font-medium capitalize">{description}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Presets + Next runs */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
                    {nextRuns.length > 0 && (
                        <Card className="border-border/50">
                            <CardHeader className="py-3 px-4 border-b bg-muted/20">
                                <CardTitle className="text-sm font-medium">Próximas ejecuciones</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    {nextRuns.map((run, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs">
                                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                                            <span className="font-mono">{run}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Presets comunes</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                            <div className="space-y-1">
                                {PRESETS.map(p => (
                                    <button
                                        key={p.cron}
                                        onClick={() => loadPreset(p.cron)}
                                        className="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-muted/40 transition-colors text-sm group"
                                    >
                                        <span>{p.label}</span>
                                        <span className="font-mono text-xs text-teal-500/70 group-hover:text-teal-500">{p.cron}</span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
