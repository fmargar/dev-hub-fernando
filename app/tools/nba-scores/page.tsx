"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RefreshCw, Trophy, Clock, Activity, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";

// ─── Team brand colours (primary / secondary) ────────────────────────────────
const TEAM_COLORS: Record<string, [string, string]> = {
    ATL: ["#E03A3E", "#C1D32F"], BOS: ["#007A33", "#BA9653"],
    BKN: ["#000000", "#FFFFFF"], CHA: ["#1D1160", "#00788C"],
    CHI: ["#CE1141", "#000000"], CLE: ["#860038", "#FDBB30"],
    DAL: ["#00538C", "#002B5E"], DEN: ["#0E2240", "#FEC524"],
    DET: ["#C8102E", "#006BB6"], GSW: ["#1D428A", "#FFC72C"],
    HOU: ["#CE1141", "#000000"], IND: ["#002D62", "#FDBB30"],
    LAC: ["#C8102E", "#1D428A"], LAL: ["#552583", "#FDB927"],
    MEM: ["#5D76A9", "#12173F"], MIA: ["#98002E", "#F9A01B"],
    MIL: ["#00471B", "#EEE1C6"], MIN: ["#0C2340", "#236192"],
    NOP: ["#0C2340", "#C8102E"], NYK: ["#006BB6", "#F58426"],
    OKC: ["#007AC1", "#EF3B24"], ORL: ["#0077C0", "#C4CED4"],
    PHI: ["#006BB6", "#ED174C"], PHX: ["#1D1160", "#E56020"],
    POR: ["#E03A3E", "#000000"], SAC: ["#5A2D81", "#63727A"],
    SAS: ["#C4CED4", "#000000"], TOR: ["#CE1141", "#000000"],
    UTA: ["#002B5C", "#00471B"], WAS: ["#002B5C", "#E31837"],
};

const TEAM_LOGO = (abbr: string) =>
    `https://cdn.nba.com/logos/nba/${NBA_IDS[abbr] ?? 0}/global/L/logo.svg`;

// balldontlie team_id → NBA official team_id mapping
const NBA_IDS: Record<string, number> = {
    ATL: 1610612737, BOS: 1610612738, BKN: 1610612751, CHA: 1610612766,
    CHI: 1610612741, CLE: 1610612739, DAL: 1610612742, DEN: 1610612743,
    DET: 1610612765, GSW: 1610612744, HOU: 1610612745, IND: 1610612754,
    LAC: 1610612746, LAL: 1610612747, MEM: 1610612763, MIA: 1610612748,
    MIL: 1610612749, MIN: 1610612750, NOP: 1610612740, NYK: 1610612752,
    OKC: 1610612760, ORL: 1610612753, PHI: 1610612755, PHX: 1610612756,
    POR: 1610612757, SAC: 1610612758, SAS: 1610612759, TOR: 1610612761,
    UTA: 1610612762, WAS: 1610612764,
};

type Team = {
    id: number;
    abbreviation: string;
    full_name: string;
    city: string;
    name: string;
};

type Game = {
    id: number;
    date: string;
    status: string;
    period: number;
    time: string;
    home_team: Team;
    visitor_team: Team;
    home_team_score: number;
    visitor_team_score: number;
    postseason: boolean;
};

function todayStr() {
    return new Date().toISOString().split("T")[0];
}

function addDays(dateStr: string, n: number) {
    const d = new Date(dateStr + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().split("T")[0];
}

function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(Date.UTC(year, month - 1, day));
    const today = todayStr();
    const yesterday = addDays(today, -1);
    const tomorrow = addDays(today, 1);
    if (dateStr === today) return "Hoy";
    if (dateStr === yesterday) return "Ayer";
    if (dateStr === tomorrow) return "Mañana";
    return d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
}

function isLive(status: string) {
    return !["Final", ""].includes(status) &&
        !status.match(/^\d{1,2}:\d{2}/) &&
        status !== "Final/OT" &&
        !status.startsWith("Final");
}

function isFinal(status: string) {
    return status.startsWith("Final");
}

// ─── Team Logo with fallback ──────────────────────────────────────────────────
function TeamLogo({ abbr, size = 48 }: { abbr: string; size?: number }) {
    const [failed, setFailed] = useState(false);
    const color = TEAM_COLORS[abbr]?.[0] ?? "#888";

    if (failed) {
        return (
            <div
                className="rounded-full flex items-center justify-center font-bold text-white text-xs"
                style={{ width: size, height: size, background: color, fontSize: size * 0.3 }}
            >
                {abbr.slice(0, 3)}
            </div>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={TEAM_LOGO(abbr)}
            alt={abbr}
            width={size}
            height={size}
            onError={() => setFailed(true)}
            className="object-contain drop-shadow-md"
            style={{ width: size, height: size }}
        />
    );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, period }: { status: string; period: number }) {
    if (isFinal(status)) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-700/60 text-zinc-300 text-xs font-semibold">
                <Trophy className="w-3 h-3" />
                {status}
            </span>
        );
    }
    if (isLive(status)) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                {period > 0 ? `Q${period}` : ""} {status}
            </span>
        );
    }
    // Scheduled
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Clock className="w-3 h-3" />
            {status}
        </span>
    );
}

// ─── Single game card ─────────────────────────────────────────────────────────
function GameCard({ game }: { game: Game }) {
    const homeWin = game.home_team_score > game.visitor_team_score;
    const awayWin = game.visitor_team_score > game.home_team_score;
    const finished = isFinal(game.status);
    const live = isLive(game.status);

    const homeColor = TEAM_COLORS[game.home_team.abbreviation]?.[0] ?? "#f97316";
    const awayColor = TEAM_COLORS[game.visitor_team.abbreviation]?.[0] ?? "#6366f1";

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
        >
            <Card className={`relative overflow-hidden bg-card/60 backdrop-blur-sm border transition-all duration-300
                ${live ? "border-red-500/30 shadow-lg shadow-red-500/10" : "border-border/50 hover:border-border"}`}>

                {/* Gradient top accent */}
                <div
                    className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg"
                    style={{ background: `linear-gradient(90deg, ${awayColor}, ${homeColor})` }}
                />

                {/* Live pulse overlay */}
                {live && (
                    <div className="absolute inset-0 rounded-lg bg-red-500/[0.03] pointer-events-none" />
                )}

                <div className="p-4 sm:p-5">
                    {/* Status */}
                    <div className="flex justify-center mb-4">
                        <StatusBadge status={game.status} period={game.period} />
                    </div>

                    {/* Scoreboard */}
                    <div className="flex items-center justify-between gap-3">
                        {/* Away team */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <TeamLogo abbr={game.visitor_team.abbreviation} size={52} />
                            <div className="text-center">
                                <p className="font-bold text-sm">{game.visitor_team.abbreviation}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[80px]">
                                    {game.visitor_team.city}
                                </p>
                            </div>
                            <p className={`text-4xl font-black tabular-nums transition-colors
                                ${finished && awayWin ? "text-white" : finished && !awayWin ? "text-muted-foreground/50" : "text-foreground"}`}
                                style={live ? { color: awayColor } : {}}>
                                {game.visitor_team_score}
                            </p>
                        </div>

                        {/* Separator */}
                        <div className="flex flex-col items-center gap-1 px-2">
                            <span className="text-2xl font-light text-muted-foreground/30">—</span>
                            {game.postseason && (
                                <span className="text-[9px] font-bold tracking-widest uppercase text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                    Playoffs
                                </span>
                            )}
                        </div>

                        {/* Home team */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <TeamLogo abbr={game.home_team.abbreviation} size={52} />
                            <div className="text-center">
                                <p className="font-bold text-sm">{game.home_team.abbreviation}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[80px]">
                                    {game.home_team.city}
                                </p>
                            </div>
                            <p className={`text-4xl font-black tabular-nums transition-colors
                                ${finished && homeWin ? "text-white" : finished && !homeWin ? "text-muted-foreground/50" : "text-foreground"}`}
                                style={live ? { color: homeColor } : {}}>
                                {game.home_team_score}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-border/30 flex justify-center">
                        <p className="text-xs text-muted-foreground">
                            <span className="text-muted-foreground/50">LOCAL: </span>
                            {game.home_team.full_name}
                        </p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

// ─── Refresh countdown ring ───────────────────────────────────────────────────
const REFRESH_SECS = 30;

function RefreshRing({ countdown, onRefresh, loading }: {
    countdown: number;
    onRefresh: () => void;
    loading: boolean;
}) {
    const r = 16;
    const circ = 2 * Math.PI * r;
    const dash = circ * (countdown / REFRESH_SECS);

    return (
        <button
            onClick={onRefresh}
            title="Actualizar ahora"
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm text-muted-foreground hover:text-foreground"
        >
            <span className="relative w-8 h-8 flex items-center justify-center">
                <svg className="absolute inset-0 -rotate-90 w-8 h-8" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r={r} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2.5" />
                    <circle
                        cx="20" cy="20" r={r}
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2.5"
                        strokeDasharray={`${dash} ${circ}`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 1s linear" }}
                    />
                </svg>
                <RefreshCw className={`w-3.5 h-3.5 relative z-10 ${loading ? "animate-spin" : ""}`} />
            </span>
            <span className="hidden sm:inline">{countdown}s</span>
        </button>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function NBAScoresPage() {
    const [date, setDate] = useState(todayStr());
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(REFRESH_SECS);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);

    const fetchGames = useCallback(async (selectedDate: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `/api/nba?endpoint=games&dates[]=${selectedDate}&per_page=30`
            );
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const json = await res.json();
            // Sort: live first, then by scheduled time
            const sorted = (json.data as Game[]).sort((a, b) => {
                const aLive = isLive(a.status) ? 0 : isFinal(a.status) ? 2 : 1;
                const bLive = isLive(b.status) ? 0 : isFinal(b.status) ? 2 : 1;
                return aLive - bLive;
            });
            setGames(sorted);
            setLastUpdated(new Date());
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    }, []);

    // Auto-refresh countdown
    useEffect(() => {
        setCountdown(REFRESH_SECS);
        if (countdownRef.current) clearInterval(countdownRef.current);
        countdownRef.current = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) {
                    fetchGames(date);
                    return REFRESH_SECS;
                }
                return c - 1;
            });
        }, 1000);
        return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
    }, [date, fetchGames]);

    // Initial fetch
    useEffect(() => { fetchGames(date); }, [date, fetchGames]);

    const liveCount = games.filter(g => isLive(g.status)).length;

    return (
        <div className="container mx-auto px-4 py-12 md:py-24 max-w-6xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-4">
                    <Activity className="w-3.5 h-3.5" />
                    Powered by BallDontLie.io
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent mb-3">
                    NBA Scores
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Resultados y marcadores en directo de la NBA
                </p>
            </motion.div>

            {/* Controls */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between mb-8 gap-4"
            >
                {/* Date navigator */}
                <div className="flex items-center gap-2 bg-muted/20 border border-border/50 rounded-xl p-1">
                    <button
                        onClick={() => setDate(d => addDays(d, -1))}
                        className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 px-3 min-w-[120px] justify-center">
                        <CalendarDays className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-sm">{formatDate(date)}</span>
                    </div>
                    <button
                        onClick={() => setDate(d => addDays(d, 1))}
                        disabled={date >= todayStr()}
                        className="p-2 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Right: live badge + refresh */}
                <div className="flex items-center gap-3">
                    {liveCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                            </span>
                            {liveCount} EN DIRECTO
                        </motion.span>
                    )}
                    <RefreshRing
                        countdown={countdown}
                        onRefresh={() => { fetchGames(date); setCountdown(REFRESH_SECS); }}
                        loading={loading}
                    />
                </div>
            </motion.div>

            {/* Last updated */}
            {lastUpdated && (
                <p className="text-xs text-muted-foreground/50 text-right mb-4 -mt-4">
                    Actualizado: {lastUpdated.toLocaleTimeString("es-ES")}
                </p>
            )}

            {/* Content */}
            <AnimatePresence mode="wait">
                {loading && games.length === 0 ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-52 rounded-xl bg-muted/20 animate-pulse border border-border/30" />
                        ))}
                    </motion.div>
                ) : error ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-20"
                    >
                        <p className="text-red-400 font-medium mb-2">Error cargando partidos</p>
                        <p className="text-muted-foreground text-sm">{error}</p>
                    </motion.div>
                ) : games.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-24"
                    >
                        <div className="text-6xl mb-4">🏀</div>
                        <p className="text-xl font-bold text-muted-foreground mb-1">Sin partidos para {formatDate(date)}</p>
                        <p className="text-sm text-muted-foreground/60">
                            La NBA no tiene partidos programados este día.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key={date}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {games.map((game, i) => (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <GameCard game={game} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats footer */}
            {games.length > 0 && !loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
                >
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        {liveCount} en directo
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-zinc-500" />
                        {games.filter(g => isFinal(g.status)).length} finalizados
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        {games.filter(g => !isLive(g.status) && !isFinal(g.status)).length} programados
                    </span>
                </motion.div>
            )}
        </div>
    );
}
