/**
 * Órbitas deterministas: mismo caso, misma órbita, siempre — nada de
 * posiciones aleatorias en cada carga. El radio codifica el `track` real de
 * content/types.ts (profesional = interior, personal = exterior), no es
 * decoración; el período crece con el radio (proporción Kepler-ish, solo
 * estética) para que los cuerpos exteriores giren visiblemente más despacio.
 */
export interface OrbitParams {
  radius: number;
  periodSeconds: number;
  /** Ángulo inicial en radianes, para que los cuerpos no arranquen alineados. */
  phase: number;
}

const TRACK_BASE_RADIUS: Record<"professional" | "personal", number> = {
  professional: 3.2,
  personal: 6.4,
};
const RADIUS_STEP = 1.3;
const BASE_PERIOD_SECONDS = 40;

/** Hash determinista de cadena → [0, 2π). No es criptográfico, es para variar la fase. */
function hashPhase(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return ((h >>> 0) % 1000) / 1000 * Math.PI * 2;
}

export function orbitFor(track: "professional" | "personal", order: number, seed: string): OrbitParams {
  const radius = TRACK_BASE_RADIUS[track] + order * RADIUS_STEP;
  const periodSeconds = BASE_PERIOD_SECONDS * Math.pow(radius / TRACK_BASE_RADIUS.professional, 1.5);
  return { radius, periodSeconds, phase: hashPhase(seed) };
}

/** Posición en el plano orbital (XZ en la escena 3D) en un instante dado. */
export function positionAtTime(orbit: OrbitParams, elapsedSeconds: number): [number, number] {
  const angle = orbit.phase + (elapsedSeconds / orbit.periodSeconds) * Math.PI * 2;
  return [Math.cos(angle) * orbit.radius, Math.sin(angle) * orbit.radius];
}
