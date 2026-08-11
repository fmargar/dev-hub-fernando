"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Región del universo donde vive /contact. */
export const COMMS_ORIGIN: [number, number, number] = [30, 0, 20];

/** Una antena en órbita síncrona, no un cuerpo: es el único sitio del sitio
 * donde el visitante emite en vez de recibir. El plato oscila muy despacio,
 * como si escuchara. */
export function CommsArray() {
  const dishRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (dishRef.current) dishRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.4;
  });

  return (
    <group position={COMMS_ORIGIN}>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 1.4, 8]} />
        <meshBasicMaterial color="#5a68a4" />
      </mesh>
      <group ref={dishRef} position={[0, 0.5, 0]}>
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[0.55, 0.035, 8, 24]} />
          <meshBasicMaterial color="#5ee7ff" />
        </mesh>
        <mesh position={[0, 0, 0.22]}>
          <sphereGeometry args={[0.08, 12, 8]} />
          <meshBasicMaterial color="#ff7a52" />
        </mesh>
      </group>
    </group>
  );
}
