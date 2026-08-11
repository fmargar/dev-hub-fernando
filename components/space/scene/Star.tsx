"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** La estrella del sistema, en el origen. Núcleo sólido + halo aditivo —
 * sin luz real de escena: los cuerpos ya se autoiluminan por shader
 * (uLightDir en planet.ts), así que esto es puramente el punto de anclaje
 * visual del que cuelgan las 5 órbitas. */
export function Star() {
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (haloRef.current) haloRef.current.rotation.y += delta * 0.02;
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.55, 32, 24]} />
        <meshBasicMaterial color="#fff4ea" />
      </mesh>
      <mesh ref={haloRef} scale={1.6}>
        <sphereGeometry args={[0.55, 24, 18]} />
        <meshBasicMaterial color="#ff9c6b" transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
