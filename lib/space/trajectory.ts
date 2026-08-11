import { getExperience } from "@/content/profile";

export interface TrajectoryBeacon {
  id: string;
  position: [number, number, number];
  kind: "work" | "education";
  current: boolean;
}

/** Región del universo donde vive /experience — separada del sistema solar
 * y de la constelación de /stack. */
export const TRAJECTORY_ORIGIN: [number, number, number] = [-42, 0, 0];

const SPACING = 3.6;

/** Una baliza por ExperienceEntry, en orden cronológico (más antiguo primero,
 * como el propio timeline de /experience). Los ids/fechas son iguales en
 * los tres idiomas. */
export function getTrajectoryBeacons(): TrajectoryBeacon[] {
  const entries = [...getExperience("es")].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
  return entries.map((entry, i) => ({
    id: entry.id,
    position: [TRAJECTORY_ORIGIN[0], TRAJECTORY_ORIGIN[1], TRAJECTORY_ORIGIN[2] + i * SPACING],
    kind: entry.kind,
    current: entry.end === null,
  }));
}
