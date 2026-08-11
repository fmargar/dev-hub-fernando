"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Paleta de telemetría, cíclica: cada luna se tiñe con un tono distinto
 * del anterior para que se lean como cosas distintas (tecnologías reales),
 * no como copias del mismo punto. */
const MOON_PALETTE = ["#5ee7ff", "#ff6bd6", "#a98bff", "#ff7a52", "#5be6b0"];

/**
 * Anillo de satélites — una luna por tecnología real del stack del proyecto
 * (ver lib/space/bodies.ts). Girado en Z, no en X: una rotación en X deja el
 * anillo en el mismo plano que las propias órbitas de los planetas (mismo
 * XZ), que es lo que hacía que los satélites de un cuerpo grande invadieran
 * la órbita vecina. En Z, el anillo queda en el plano XY — vertical
 * respecto al plano del sistema — y solo su clearance (lib/space/bodies.ts)
 * entra en el cálculo de espaciado orbital, no su orientación exacta.
 */
export function Satellites({ techs, radius, color }: { techs: string[]; radius: number; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const colors = useMemo(
    () => techs.map((_, i) => new THREE.Color(MOON_PALETTE[i % MOON_PALETTE.length])),
    [techs],
  );
  const fallbackColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.2;
  });

  const count = techs.length;
  if (count === 0) return null;

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 2]}>
      {techs.map((tech, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
          <mesh key={tech} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
            <sphereGeometry args={[radius * 0.07, 12, 8]} />
            <meshBasicMaterial color={colors[i] ?? fallbackColor} />
          </mesh>
        );
      })}
    </group>
  );
}
