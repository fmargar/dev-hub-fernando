"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { CaseBodyVisual } from "@/lib/space/bodies";
import type { OrbitParams } from "@/lib/space/orbits";
import { positionAtTime } from "@/lib/space/orbits";

/**
 * Versión de la fase 5 (mapa del sistema): geometría industrial — núcleo
 * icosaédrico + celosía en wireframe, angular a propósito frente a los
 * planetas orgánicos. La fase 7 la conecta a /api/homelab-stats y sustituye
 * el núcleo por un InstancedMesh generado desde los contenedores reales
 * (25 módulos, 17 stacks...) — el punto de montaje es este mismo componente.
 */
export function StationHomelab({
  visual,
  orbit,
  onSelect,
}: {
  visual: CaseBodyVisual;
  orbit: OrbitParams;
  onSelect?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);

  const coreColor = useMemo(() => new THREE.Color(visual.colorSurface), [visual.colorSurface]);
  const latticeColor = useMemo(() => new THREE.Color(visual.colorHighlight), [visual.colorHighlight]);

  useFrame((state, delta) => {
    const [x, z] = positionAtTime(orbit, state.clock.elapsedTime);
    groupRef.current?.position.set(x, 0, z);
    if (spinRef.current) spinRef.current.rotation.y += delta * (visual.rotationSpeed ?? 0.03);
  });

  return (
    <group ref={groupRef}>
      <group
        ref={spinRef}
        onClick={
          onSelect &&
          ((e) => {
            e.stopPropagation();
            onSelect();
          })
        }
        onPointerOver={onSelect ? () => (document.body.style.cursor = "pointer") : undefined}
        onPointerOut={onSelect ? () => (document.body.style.cursor = "auto") : undefined}
      >
        <mesh>
          <icosahedronGeometry args={[visual.radius * 0.7, 0]} />
          <meshBasicMaterial color={coreColor} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[visual.radius * 1.15, 1]} />
          <meshBasicMaterial color={latticeColor} wireframe transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
}
