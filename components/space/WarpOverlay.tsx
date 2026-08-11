"use client";

import { useSpaceStore } from "@/lib/space/store";

/**
 * Versión mínima: un fogonazo CSS de ~180ms al cambiar de ruta, funciona
 * exista o no el canvas (así degrada limpio en nivel 0). La fase 9 la
 * sustituye por estelas de verdad renderizadas en la escena; el punto de
 * montaje y el contrato con el store (`warping`) ya quedan fijados aquí.
 */
export function WarpOverlay() {
  const warping = useSpaceStore((s) => s.warping);

  return <div className="space-warp-overlay" data-active={warping || undefined} aria-hidden="true" />;
}
