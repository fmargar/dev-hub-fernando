"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Anillo de satélites en órbita polar (inclinada 90° respecto al plano
 * del padre) — usado por los planetas-caso (fase 5, roles territoriales de
 * vados) y por los planetas-lenguaje de /stack (fase 6, tecnologías del
 * grupo). Compartido para no repetir la misma órbita dos veces. */
export function Satellites({ count, radius, color }: { count: number; radius: number; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const satColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
            <sphereGeometry args={[radius * 0.06, 12, 8]} />
            <meshBasicMaterial color={satColor} />
          </mesh>
        );
      })}
    </group>
  );
}
