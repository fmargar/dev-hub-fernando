"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { nebulaVert, nebulaFrag } from "@/components/space/shaders/nebula";
import { readSpacePalette, SPACE_NEBULA_MAX_LUMA } from "@/lib/space/palette";

/**
 * Skybox procedural visto desde dentro (BackSide, esfera grande). Es el
 * mismo fondo que SpaceFallback pinta en CSS para el nivel 0, ahora en
 * WebGL real: cuando la cámara empiece a moverse (fase 5), esta nebulosa da
 * la sensación de volumen que un fondo plano no puede dar.
 *
 * El material se declara en JSX (<shaderMaterial>), no se construye a mano:
 * así el ref solo se lee en efectos/useFrame, nunca durante el render —
 * misma regla que ya sigue useHoverIcon (components/ui/hover-icon.tsx) y
 * que react-hooks/refs exige en todo el proyecto.
 */
export function Nebula() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorBg: { value: new THREE.Color("#070912") },
      uColorCyan: { value: new THREE.Color("#5ee7ff") },
      uColorMagenta: { value: new THREE.Color("#ff6bd6") },
      uColorViolet: { value: new THREE.Color("#a98bff") },
      uMaxLuma: { value: SPACE_NEBULA_MAX_LUMA },
      uIntensity: { value: 1 },
    }),
    [],
  );

  // Los colores reales de la paleta solo existen en el DOM tras montar (ver
  // lib/space/palette.ts) — leerlos antes daría negro.
  useLayoutEffect(() => {
    const palette = readSpacePalette();
    uniforms.uColorBg.value.copy(palette.bg);
    uniforms.uColorCyan.value.copy(palette.cyan);
    uniforms.uColorMagenta.value.copy(palette.magenta);
    uniforms.uColorViolet.value.copy(palette.violet);
  }, [uniforms]);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (material) material.uniforms.uTime.value += delta;
  });

  return (
    <mesh>
      <sphereGeometry args={[500, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={nebulaVert}
        fragmentShader={nebulaFrag}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}
