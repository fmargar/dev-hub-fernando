"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getTrajectoryBeacons } from "@/lib/space/trajectory";

function Beacon({
  position,
  current,
  kind,
}: {
  position: [number, number, number];
  current: boolean;
  kind: "work" | "education";
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useMemo(() => new THREE.Color(kind === "work" ? "#ff7a52" : "#5ee7ff"), [kind]);

  useFrame((state) => {
    if (!meshRef.current || !current) return;
    meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.15);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[current ? 0.32 : 0.22, 16, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

/** La trayectoria no es un cuerpo, es la línea de rumbo por el sistema: una
 * baliza por ExperienceEntry, en el orden cronológico real. Convertirla en
 * un planeta más sería la pereza de "todo es un planeta" — aquí el dato
 * (start/end) ya es una línea, así que se dibuja como línea. */
export function Trajectory() {
  const beacons = useMemo(() => getTrajectoryBeacons(), []);

  // Objeto three.js construido a mano en vez de <line> en JSX: el
  // intrinsic "line" de R3F choca con el <line> de SVG en el namespace de
  // tipos de este proyecto (que también usa iconos SVG en todas partes), y
  // TypeScript resuelve al SVG. <primitive> evita la ambigüedad.
  const line = useMemo(() => {
    const points = beacons.map((b) => new THREE.Vector3(...b.position));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: "#5a68a4", transparent: true, opacity: 0.5 });
    return new THREE.Line(geometry, material);
  }, [beacons]);

  return (
    <>
      <primitive object={line} />
      {beacons.map((b) => (
        <Beacon key={b.id} position={b.position} current={b.current} kind={b.kind} />
      ))}
    </>
  );
}
