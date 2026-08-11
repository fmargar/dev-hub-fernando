"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { TOOLS } from "@/content/tools";

/** Región del universo donde vive /tools. */
export const STATION_BAY_ORIGIN: [number, number, number] = [0, -6, -70];

const CATEGORY_TINTS: Record<string, string> = {
  image: "#5ee7ff",
  video: "#ff6bd6",
  code: "#a98bff",
  text: "#5be6b0",
  security: "#ff7a52",
  conversion: "#5ee7ff",
  dev: "#a98bff",
  sports: "#ff6bd6",
};

const RING_RADIUS = 3.4;

interface CrewMember {
  category: string;
  count: number;
  color: string;
  angle: number;
  phase: number;
}

function useCrew(): CrewMember[] {
  return useMemo(() => {
    const categories = Array.from(new Set(TOOLS.map((t) => t.category)));
    return categories.map((category, i) => ({
      category,
      count: TOOLS.filter((t) => t.category === category).length,
      color: CATEGORY_TINTS[category] ?? "#a8b4d4",
      angle: (i / categories.length) * Math.PI * 2,
      phase: i * 1.7,
    }));
  }, []);
}

/** Un tripulante procedural: cápsula + cabeza esférica + una "insignia"
 * emisiva que lleva el color de su categoría. Nada de modelos importados —
 * la misma regla de siempre, cero bytes de asset. */
function Crewmate({ member, onSelect }: { member: CrewMember; onSelect: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const color = useMemo(() => new THREE.Color(member.color), [member.color]);
  const bodyColor = useMemo(() => new THREE.Color("#1a1f38"), []);

  const x = Math.cos(member.angle) * RING_RADIUS;
  const z = Math.sin(member.angle) * RING_RADIUS;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 1.4 + member.phase) * 0.05;
    groupRef.current.rotation.y = Math.atan2(-z, -x) + Math.sin(t * 0.5 + member.phase) * 0.15;
  });

  return (
    <group position={[x, 0, z]}>
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <mesh position={[0, 0.42, 0]}>
          <capsuleGeometry args={[0.22, 0.42, 6, 12]} />
          <meshBasicMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.2, 16, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.5, 0.23]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Bahía de la estación: un tripulante por categoría real de
 * content/tools.ts (8 ahora), de pie en corro sobre la plataforma. Clicar
 * uno navega a /tools y baja directo a esa categoría — "intercambiar" con
 * el personaje para entrar en sus herramientas. Las 33 herramientas por
 * dentro no se tocan: esto es solo la antesala.
 */
export function StationBay() {
  const router = useRouter();
  const crew = useCrew();
  const platformColor = useMemo(() => new THREE.Color("#111528"), []);
  const ringColor = useMemo(() => new THREE.Color("#5ee7ff"), []);

  const goToCategory = (category: string) => router.push(`/tools#category-${category}`);

  return (
    <group position={STATION_BAY_ORIGIN}>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[RING_RADIUS + 1.1, 40]} />
        <meshBasicMaterial color={platformColor} />
      </mesh>
      <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[RING_RADIUS + 1.02, RING_RADIUS + 1.1, 40]} />
        <meshBasicMaterial color={ringColor} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {crew.map((member) => (
        <Crewmate key={member.category} member={member} onSelect={() => goToCategory(member.category)} />
      ))}
    </group>
  );
}
