import * as THREE from "three";

export interface SpacePalette {
  bg: THREE.Color;
  cyan: THREE.Color;
  magenta: THREE.Color;
  violet: THREE.Color;
  accent: THREE.Color;
}

/** Mismos valores que :root en app/globals.css, por si getComputedStyle
 * devolviera vacío (no debería pasar tras montar, pero un Color negro
 * silencioso es peor que un fallback explícito). */
const FALLBACK: Record<string, string> = {
  "--bg": "#070912",
  "--nebula-cyan": "#5ee7ff",
  "--nebula-magenta": "#ff6bd6",
  "--nebula-violet": "#a98bff",
  "--accent": "#ff7a52",
};

function readToken(styles: CSSStyleDeclaration, name: string): string {
  const value = styles.getPropertyValue(name).trim();
  return value || FALLBACK[name];
}

/**
 * Puente tokens CSS → THREE.Color. Llamar SOLO desde useLayoutEffect en
 * cliente: en ámbito de módulo o durante SSR no hay `document` con estilos
 * aplicados, y getComputedStyle devolvería cadenas vacías → THREE.Color
 * negro silencioso.
 */
export function readSpacePalette(): SpacePalette {
  const styles = getComputedStyle(document.documentElement);
  return {
    bg: new THREE.Color(readToken(styles, "--bg")),
    cyan: new THREE.Color(readToken(styles, "--nebula-cyan")),
    magenta: new THREE.Color(readToken(styles, "--nebula-magenta")),
    violet: new THREE.Color(readToken(styles, "--nebula-violet")),
    accent: new THREE.Color(readToken(styles, "--accent")),
  };
}

/** Recorte de luminancia de la nebulosa 3D — independiente del alfa que usa
 * la versión CSS (--nebula-max-luma en globals.css es un hex de referencia
 * para el fallback nivel 0; en el shader aditivo la escala es otra). */
export const SPACE_NEBULA_MAX_LUMA = 0.5;
