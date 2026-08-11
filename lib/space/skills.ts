import { getSkills } from "@/content/profile";

export interface SkillPlanetConfig {
  groupId: string;
  position: [number, number, number];
  radius: number;
  color: string;
  seed: number;
  satelliteCount: number;
}

/** Región del universo donde vive /stack — lejos del sistema solar (fase 5)
 * para que la cámara nunca los vea mezclados desde ningún encuadre normal. */
export const SKILLS_ORIGIN: [number, number, number] = [0, 0, -42];

const GROUP_VISUAL: Record<string, { color: string; radius: number }> = {
  backend: { color: "#ff7a52", radius: 1.05 }, // mundo caliente, bandas de convección
  frontend: { color: "#5ee7ff", radius: 0.9 }, // cian brillante
  datos: { color: "#4a3f6b", radius: 0.95 }, // denso y oscuro — la masa es el dato
  infra: { color: "#a98bff", radius: 1.2 }, // gigante gaseoso, enjambre de satélites
  calidad: { color: "#5be6b0", radius: 0.62 }, // pequeño y preciso
};

const SPACING = 4.4;

function seedFor(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return (h >>> 0) % 1000;
}

/** Los 5 grupos de content/profile.ts como planetas en fila. Puro y
 * determinista: ids, orden y número de tecnologías por grupo son iguales
 * en los tres idiomas (solo las etiquetas se traducen), así que no importa
 * qué locale se use para calcular la geometría. */
export function getSkillPlanets(): SkillPlanetConfig[] {
  const groups = getSkills("es");
  return groups.map((g, i) => {
    const visual = GROUP_VISUAL[g.id] ?? { color: "#a8b4d4", radius: 0.8 };
    const x = SKILLS_ORIGIN[0] + (i - (groups.length - 1) / 2) * SPACING;
    return {
      groupId: g.id,
      position: [x, SKILLS_ORIGIN[1], SKILLS_ORIGIN[2]],
      radius: visual.radius,
      color: visual.color,
      seed: seedFor(g.id),
      // Una luna por tecnología sería ilegible pasadas 6-7 — se limita el
      // recuento visual, la lista completa sigue viviendo en el HUD (fase 7).
      satelliteCount: Math.min(g.items.length, 7),
    };
  });
}
