import { stripLocale } from "@/lib/locale-paths";
import { POIS } from "@/lib/space/pois";

/**
 * pathname (de usePathname, con o sin prefijo de idioma) → id de POI. El más
 * específico gana: "/work/homelab" debe resolver al caso, no al plano
 * orbital "/work". Fuera de rutas conocidas (herramienta individual,
 * 404...) cae a "system" — la cámara no tiene por qué moverse si no hay un
 * cuerpo que enfocar.
 */
export function resolvePoiId(pathname: string): string {
  const { path } = stripLocale(pathname);

  let bestId = "system";
  let bestLength = -1;
  for (const poi of POIS) {
    if (poi.route === "/" ? path === "/" : path === poi.route || path.startsWith(`${poi.route}/`)) {
      if (poi.route.length > bestLength) {
        bestId = poi.id;
        bestLength = poi.route.length;
      }
    }
  }
  return bestId;
}
