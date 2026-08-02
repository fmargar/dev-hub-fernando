"use client";

import { useRef, type ReactNode } from "react";
import type { AnimatedIconHandle } from "@/icons/types";

/**
 * Los iconos de itshover se animan solos al pasar por encima del propio glifo,
 * que dentro de un enlace o una tarjeta es el sitio equivocado: el usuario
 * apunta al bloque entero, no a un cuadrado de 16 píxeles. El componente expone
 * un handle imperativo justo para esto, y este hook lo cablea al elemento que
 * de verdad recibe el puntero.
 *
 *   const [arrowRef, arrowHover] = useHoverIcon();
 *   <Link {...arrowHover}>Leer <Icon><ArrowIcon ref={arrowRef} /></Icon></Link>
 *
 * El foco de teclado dispara la misma animación, así que quien navega con
 * tabulador ve la misma respuesta que quien usa el ratón.
 *
 * Devuelve una tupla y no un objeto a propósito: leer `algo.ref` durante el
 * render es justo lo que prohíbe `react-hooks/refs`, y con desestructuración
 * posicional el ref llega al JSX como una variable normal.
 */
export function useHoverIcon() {
  const ref = useRef<AnimatedIconHandle>(null);

  const hostProps = {
    onMouseEnter: () => ref.current?.startAnimation(),
    onMouseLeave: () => ref.current?.stopAnimation(),
    onFocus: () => ref.current?.startAnimation(),
    onBlur: () => ref.current?.stopAnimation(),
  };

  return [ref, hostProps] as const;
}

/**
 * Envoltorio decorativo. Los SVG de los iconos no llevan título, así que se
 * marcan como ocultos para lectores de pantalla: el texto del enlace ya dice
 * lo que hace.
 */
export function Icon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 ${className}`}>
      {children}
    </span>
  );
}
