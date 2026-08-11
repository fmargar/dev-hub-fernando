"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Aparcamiento de cámara para la fase 4: sin cuerpos que enfocar todavía,
 * así que solo hace una órbita ociosa muy lenta alrededor del origen. La
 * fase 5 sustituye esto por interpolación críticamente amortiguada hacia el
 * POI activo (lib/space/pois.ts + lib/space/orbits.ts) — el enganche es el
 * mismo componente, cambia lo que hace dentro de useFrame.
 */
const IDLE_RADIUS = 14;
const IDLE_HEIGHT = 3;
const IDLE_ROTATE_SPEED = 0.015; // rad/s

export function CameraRig() {
  const angleRef = useRef(0);

  useFrame((state, delta) => {
    angleRef.current += delta * IDLE_ROTATE_SPEED;
    state.camera.position.set(
      Math.sin(angleRef.current) * IDLE_RADIUS,
      IDLE_HEIGHT,
      Math.cos(angleRef.current) * IDLE_RADIUS,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
