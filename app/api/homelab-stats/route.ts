import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import fallback from "@/content/homelab-stats-fallback.json";

export const dynamic = "force-dynamic";

const STATS_FILE = "/app/data/homelab-stats.json";
const STALE_AFTER_MS = 48 * 60 * 60 * 1000;

interface HomelabStats {
  containers: number;
  stacks: number;
  uptimeDays: number;
  dbPortsExposed: number;
  internetEgress: number;
  updatedAt: string;
}

function isFresh(updatedAt: string): boolean {
  const age = Date.now() - new Date(updatedAt).getTime();
  return Number.isFinite(age) && age >= 0 && age < STALE_AFTER_MS;
}

// El JSON lo escribe un cron en el host (fuera del contenedor, sin
// docker.sock) y se monta aquí en modo :ro. Si falta, no parsea, o su
// updatedAt supera 48h, se cae al snapshot estático: un número "en vivo"
// caducado es peor que uno fijo.
export async function GET() {
  try {
    const raw = await readFile(STATS_FILE, "utf8");
    const stats: HomelabStats = JSON.parse(raw);
    if (isFresh(stats.updatedAt)) {
      return NextResponse.json(stats);
    }
  } catch {
    // sigue al fallback
  }

  return NextResponse.json(fallback);
}
