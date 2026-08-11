"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { CaseBodyVisual } from "@/lib/space/bodies";
import type { OrbitParams } from "@/lib/space/orbits";
import { positionAtTime } from "@/lib/space/orbits";

const STREAM_COUNT = 20;

/**
 * Uniformes Bahía: sin métricas propias en el contenido (no se inventan),
 * así que la forma es la integración misma — dos cuerpos con una corriente
 * de partículas fluyendo entre ellos, no un planeta con cifras encima.
 */
export function BinaryTrade({
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
  const streamRef = useRef<THREE.Points>(null);

  const separation = visual.radius * 3.4;
  const bodyRadius = visual.radius * 0.8;

  const colorA = useMemo(() => new THREE.Color(visual.colorSurface), [visual.colorSurface]);
  const colorB = useMemo(() => new THREE.Color(visual.colorHighlight), [visual.colorHighlight]);

  const streamGeometry = useMemo(() => {
    const positions = new Float32Array(STREAM_COUNT * 3);
    for (let i = 0; i < STREAM_COUNT; i++) {
      positions[i * 3] = THREE.MathUtils.lerp(-separation, separation, i / STREAM_COUNT);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [separation]);

  useFrame((state, delta) => {
    const [x, z] = positionAtTime(orbit, state.clock.elapsedTime);
    groupRef.current?.position.set(x, 0, z);
    if (spinRef.current) spinRef.current.rotation.y += delta * (visual.rotationSpeed ?? 0.08);

    const pos = streamRef.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (pos) {
      for (let i = 0; i < STREAM_COUNT; i++) {
        let px = pos.getX(i) + delta * 1.6;
        if (px > separation) px -= separation * 2;
        pos.setX(i, px);
      }
      pos.needsUpdate = true;
    }
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
        <mesh position={[-separation, 0, 0]}>
          <sphereGeometry args={[bodyRadius, 24, 18]} />
          <meshBasicMaterial color={colorA} />
        </mesh>
        <mesh position={[separation, 0, 0]}>
          <sphereGeometry args={[bodyRadius, 24, 18]} />
          <meshBasicMaterial color={colorB} />
        </mesh>
        <points ref={streamRef} geometry={streamGeometry}>
          <pointsMaterial color={colorB} size={0.07} sizeAttenuation transparent opacity={0.85} />
        </points>
      </group>
    </group>
  );
}
