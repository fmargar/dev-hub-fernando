"use client";

import { useSpaceStore } from "@/lib/space/store";

/**
 * El puente del escáner: un elemento del DOM (una fila del índice, una
 * tarjeta) escribe en el store al pasar el ratón, y el cuerpo 3D
 * correspondiente reacciona (ver CaseBody, que compara su slug contra
 * store.hovered). Un dato en un sentido, sin acoplar componentes — el
 * elemento del DOM no sabe nada de three.js.
 *
 * Devuelve un objeto de manejadores para esparcir sobre el elemento
 * interactivo, igual que useHoverIcon.
 */
export function useScanTarget(id: string) {
  const setHovered = useSpaceStore((s) => s.setHovered);
  return {
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
  };
}
