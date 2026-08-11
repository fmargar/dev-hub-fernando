/**
 * Fuente única de verdad del universo: qué cuerpo celeste representa cada
 * ruta. `route` es siempre la ruta SIN prefijo de idioma (la que devuelve
 * stripLocale().path de lib/locale-paths.ts) — el mismo formato que usa
 * Navbar para resaltar el enlace activo.
 *
 * Esto no duplica contenido: los 5 casos, sus métricas y sus stacks siguen
 * viviendo en content/cases/. Aquí solo se anota CÓMO se ve cada uno en el
 * mapa (tipo de cuerpo, orden orbital) — la escena (fase 5+) lee el
 * contenido real desde content/ para generar la geometría.
 */
export type PoiKind =
  | "system" // "/" — vista de sistema, no es un cuerpo
  | "orbital-plane" // "/work" — plano orbital de los 5 casos
  | "case" // "/work/[slug]" — aproximación a un cuerpo
  | "trajectory" // "/experience" — línea de rumbo, no un cuerpo
  | "constellation" // "/stack" — 5 planetas-lenguaje
  | "comms" // "/contact" — matriz de comunicaciones
  | "station-bay"; // "/tools" — bahía de carga de la estación

export interface Poi {
  id: string;
  kind: PoiKind;
  route: string;
  /** Solo para kind:"case" — enlaza con content/cases/index.ts. */
  caseSlug?: string;
}

export const POIS: Poi[] = [
  { id: "system", kind: "system", route: "/" },
  { id: "work", kind: "orbital-plane", route: "/work" },
  { id: "case:sistema-vados-marbella", kind: "case", route: "/work/sistema-vados-marbella", caseSlug: "sistema-vados-marbella" },
  { id: "case:marbella-facil", kind: "case", route: "/work/marbella-facil", caseSlug: "marbella-facil" },
  { id: "case:uniformes-bahia", kind: "case", route: "/work/uniformes-bahia", caseSlug: "uniformes-bahia" },
  { id: "case:homelab", kind: "case", route: "/work/homelab", caseSlug: "homelab" },
  { id: "case:fmargar-gallery", kind: "case", route: "/work/fmargar-gallery", caseSlug: "fmargar-gallery" },
  { id: "experience", kind: "trajectory", route: "/experience" },
  { id: "stack", kind: "constellation", route: "/stack" },
  { id: "contact", kind: "comms", route: "/contact" },
  { id: "tools", kind: "station-bay", route: "/tools" },
];

export function findPoi(id: string): Poi | undefined {
  return POIS.find((p) => p.id === id);
}
