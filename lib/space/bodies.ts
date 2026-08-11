import { getCases } from "@/content/cases";
import { orbitFor, type OrbitParams } from "@/lib/space/orbits";

export type BodyKind = "civic" | "smart-city" | "binary" | "station" | "moon";

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
  satellites?: number;
  rotationSpeed?: number;
}

export interface CaseBody {
  slug: string;
  kind: BodyKind;
  orbit: OrbitParams;
  visual: CaseBodyVisual;
}

/**
 * Diseño fijado a mano por caso, no derivado automáticamente del contenido
 * (salvo las cifras que sí vienen de metrics — ver comentarios). El resto
 * (orbit, track, order) sí sale de content/cases/index.ts: un caso movido
 * de orden o de track cambia su órbita solo, sin tocar este fichero.
 */
const VISUALS: Record<string, Omit<CaseBodyVisual, "seed">> = {
  // Mundo cívico: superficie árida partida en 4 zonas administrativas
  // (metrics reales del caso) con retícula bermellón; 5 satélites en
  // órbita polar por los 5 roles territoriales.
  "sistema-vados-marbella": {
    radius: 1.05,
    colorDeep: "#241a10",
    colorSurface: "#8a6b3f",
    colorHighlight: "#ff7a52",
    atmosphereColor: "#ffb08a",
    zonePartitions: 4,
    satellites: 5,
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

/** Los 5 cuerpos del sistema, en el plano orbital de "/work". Puro y
 * determinista: mismo resultado siempre, no depende del locale (track,
 * order y slug son iguales en los tres idiomas). */
export function getSolarSystemBodies(): CaseBody[] {
  return getCases("es").map((c) => ({
    slug: c.slug,
    kind: KIND_BY_SLUG[c.slug] ?? "moon",
    orbit: orbitFor(c.track, c.order, c.slug),
    visual: { ...VISUALS[c.slug], seed: seedFor(c.slug) },
  }));
}
