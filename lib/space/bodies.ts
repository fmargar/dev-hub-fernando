import { getCase, getCases } from "@/content/cases";
import { assignOrbits, type OrbitParams, type OrbitRequest } from "@/lib/space/orbits";

export type BodyKind = "civic" | "smart-city" | "binary" | "station" | "moon";

const SATELLITE_ORBIT_FACTOR = 2.2;
const MAX_SATELLITES = 8;

export interface CaseBodyVisual {
  radius: number;
  colorDeep: string;
  colorSurface: string;
  colorHighlight: string;
  atmosphereColor: string;
  seed: number;
  zonePartitions?: number;
  cityLights?: boolean;
  cityTint?: string;
  /** Tecnologías reales del `stack` del caso (content/cases/*.ts) — cada
   * satélite es una tecnología que de verdad se usó, no un adorno. Capado a
   * MAX_SATELLITES por legibilidad, igual que las tarjetas HTML ya capan
   * los chips visibles (WorkIndexList corta en 5-6). */
  satelliteTechs?: string[];
  rotationSpeed?: number;
}

export interface CaseBody {
  slug: string;
  kind: BodyKind;
  orbit: OrbitParams;
  visual: CaseBodyVisual;
}

/**
 * Diseño fijado a mano por caso (colores, tipo de mundo), no derivado del
 * contenido. Lo que sí sale de content/cases/index.ts: el stack real (las
 * lunas) y track/order (la órbita, vía assignOrbits).
 */
const VISUALS: Record<string, Omit<CaseBodyVisual, "seed" | "satelliteTechs">> = {
  // Mundo cívico: superficie árida partida en 4 zonas administrativas
  // (metric real del caso) con retícula bermellón.
  "sistema-vados-marbella": {
    radius: 1.05,
    colorDeep: "#241a10",
    colorSurface: "#8a6b3f",
    colorHighlight: "#ff7a52",
    atmosphereColor: "#ffb08a",
    zonePartitions: 4,
    rotationSpeed: 0.05,
  },
  // Planeta Smart City: cara nocturna con luces de neón cian/magenta.
  "marbella-facil": {
    radius: 1.2,
    colorDeep: "#04070f",
    colorSurface: "#122040",
    colorHighlight: "#5ee7ff",
    atmosphereColor: "#5ee7ff",
    cityLights: true,
    cityTint: "#ff6bd6",
    rotationSpeed: 0.04,
  },
  // Par en transferencia: sin métricas propias (el caso no las tiene), la
  // forma es la integración misma — ver components/space/scene/bodies/BinaryTrade.tsx.
  "uniformes-bahia": {
    radius: 0.55,
    colorDeep: "#151020",
    colorSurface: "#3a2f52",
    colorHighlight: "#a98bff",
    atmosphereColor: "#a98bff",
    rotationSpeed: 0.08,
  },
  // Estación industrial — ver components/space/scene/bodies/StationHomelab.tsx,
  // no usa el shader de planeta.
  homelab: {
    radius: 1.0,
    colorDeep: "#0c1420",
    colorSurface: "#5ee7ff",
    colorHighlight: "#eaf0ff",
    atmosphereColor: "#5ee7ff",
    rotationSpeed: 0.03,
  },
  // Luna de relé, orbita en el plano exterior junto al resto de personales.
  "fmargar-gallery": {
    radius: 0.5,
    colorDeep: "#120e1c",
    colorSurface: "#6a53a8",
    colorHighlight: "#ff6bd6",
    atmosphereColor: "#a98bff",
    rotationSpeed: 0.09,
  },
};

const KIND_BY_SLUG: Record<string, BodyKind> = {
  "sistema-vados-marbella": "civic",
  "marbella-facil": "smart-city",
  "uniformes-bahia": "binary",
  homelab: "station",
  "fmargar-gallery": "moon",
};

function seedFor(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return (h >>> 0) % 1000;
}

function clearanceFor(radius: number, satelliteCount: number): number {
  const atmosphere = radius * 1.08;
  const satelliteShell = satelliteCount > 0 ? radius * SATELLITE_ORBIT_FACTOR + radius * 0.15 : 0;
  return Math.max(atmosphere, satelliteShell);
}

/** Los 5 cuerpos del sistema, en el plano orbital de "/work". Puro y
 * determinista: mismo resultado siempre, no depende del locale (track,
 * order, slug y stack son iguales en los tres idiomas). */
export function getSolarSystemBodies(): CaseBody[] {
  const cases = getCases("es");

  const entries = cases.map((c) => {
    const visual = VISUALS[c.slug];
    const satelliteTechs = c.stack.slice(0, MAX_SATELLITES);
    const clearance = clearanceFor(visual.radius, satelliteTechs.length);
    return { case: c, visual, satelliteTechs, clearance };
  });

  const orbits = assignOrbits(
    entries.map(
      (e): OrbitRequest => ({
        key: e.case.slug,
        track: e.case.track,
        order: e.case.order,
        clearance: e.clearance,
      }),
    ),
  );

  return entries.map((e) => ({
    slug: e.case.slug,
    kind: KIND_BY_SLUG[e.case.slug] ?? "moon",
    orbit: orbits.get(e.case.slug)!,
    visual: { ...e.visual, seed: seedFor(e.case.slug), satelliteTechs: e.satelliteTechs },
  }));
}

/** Slugs de tecnología por caso, para etiquetar cada luna con su nombre real
 * (usado por el escáner / futuros tooltips). Locale-independiente: el stack
 * es una lista de nombres, no texto traducido. */
export function getSatelliteLabel(slug: string, index: number): string | undefined {
  const study = getCase("es", slug);
  return study?.stack[index];
}
