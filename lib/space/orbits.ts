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

export interface OrbitRequest {
  key: string;
  track: "professional" | "personal";
  order: number;
  /** Radio del propio cuerpo + la extensión de sus satélites — el hueco que
   * necesita reservado a cada lado para no pisar la órbita vecina. */
  clearance: number;
}

const TRACK_BASE_RADIUS: Record<"professional" | "personal", number> = {
  professional: 2.4,
  personal: 6.2,
};
/** Espacio libre garantizado entre el borde de una órbita (radio ± clearance)
 * y la siguiente, dentro del mismo track. */
const ORBIT_MARGIN = 1.4;
const BASE_PERIOD_SECONDS = 40;

/** Hash determinista de cadena → [0, 2π). No es criptográfico, es para variar la fase. */
function hashPhase(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return ((h >>> 0) % 1000) / 1000 * Math.PI * 2;
}

/**
 * Asigna radios de órbita a todo el conjunto de una vez, en vez de uno a uno
 * por índice: así el hueco entre dos cuerpos depende de lo grandes que son
 * de verdad (radio del planeta + el anillo de sus satélites), no de un
 * espaciado fijo que asumía que todos ocupaban lo mismo — eso es lo que
 * hacía que los planetas grandes con muchos satélites se comieran la
 * órbita vecina.
 */
export function assignOrbits(requests: OrbitRequest[]): Map<string, OrbitParams> {
  const result = new Map<string, OrbitParams>();

  for (const track of ["professional", "personal"] as const) {
    const group = requests
      .filter((r) => r.track === track)
      .sort((a, b) => a.order - b.order);

    let edge = TRACK_BASE_RADIUS[track];
    for (const req of group) {
      const radius = edge + req.clearance + ORBIT_MARGIN;
      const periodSeconds = BASE_PERIOD_SECONDS * Math.pow(radius / TRACK_BASE_RADIUS.professional, 1.5);
      result.set(req.key, { radius, periodSeconds, phase: hashPhase(req.key) });
      edge = radius + req.clearance;
    }
  }

  return result;
}

/** Posición en el plano orbital (XZ en la escena 3D) en un instante dado. */
export function positionAtTime(orbit: OrbitParams, elapsedSeconds: number): [number, number] {
  const angle = orbit.phase + (elapsedSeconds / orbit.periodSeconds) * Math.PI * 2;
  return [Math.cos(angle) * orbit.radius, Math.sin(angle) * orbit.radius];
}
