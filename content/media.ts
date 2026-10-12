/**
 * Capturas reales de los proyectos. Las dimensiones viven aquí una sola vez y
 * los textos alternativos en los ficheros de caso, que sí están traducidos.
 *
 * Origen: memoria técnica de Marbella Fácil (57 páginas), imágenes embebidas
 * extraídas del PDF y convertidas a WebP. Son capturas del entorno académico,
 * con datos de prueba.
 */
export interface MediaAsset {
  src: string;
  width: number;
  height: number;
}

export const media = {
  "mf-portada": { src: "/media/marbella-facil/portada.webp", width: 1400, height: 795 },
  "mf-directorio": { src: "/media/marbella-facil/directorio.webp", width: 1400, height: 668 },
  "mf-panel": { src: "/media/marbella-facil/panel-empresa.webp", width: 1400, height: 676 },
  "mf-agenda": { src: "/media/marbella-facil/agenda.webp", width: 1400, height: 675 },
  "mf-resenas": { src: "/media/marbella-facil/resenas.webp", width: 1400, height: 669 },
  "mf-playas": { src: "/media/marbella-facil/playas.webp", width: 1400, height: 668 },
  // Adivinadle: capturas de adivinadle.com en producción (12/10/2026).
  "adv-portada": { src: "/media/adivinadle/portada.webp", width: 1400, height: 875 },
  "adv-clasico": { src: "/media/adivinadle/clasico.webp", width: 1400, height: 875 },
  "adv-movil": { src: "/media/adivinadle/movil.webp", width: 780, height: 1688 },
  // Wardux: portada de wardux.com en producción (12/10/2026).
  "wdx-portada": { src: "/media/wardux/portada.webp", width: 1400, height: 875 },
} as const satisfies Record<string, MediaAsset>;

export type MediaKey = keyof typeof media;
