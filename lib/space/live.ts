/**
 * Espejo del shape de app/api/homelab-stats/route.ts. No se importa desde
 * ahí (esa ruta es server-only); se duplica la forma a propósito, es un
 * contrato pequeño y estable.
 */
export interface HomelabStats {
  containers: number;
  stacks: number;
  uptimeDays: number;
  dbPortsExposed: number;
  internetEgress: number;
  updatedAt: string;
}

/** Nunca lanza: si falla, el llamador se queda con lo que ya tuviera (o null). */
export async function fetchHomelabStats(signal?: AbortSignal): Promise<HomelabStats | null> {
  try {
    const res = await fetch("/api/homelab-stats", { signal });
    if (!res.ok) return null;
    return (await res.json()) as HomelabStats;
  } catch {
    return null;
  }
}
