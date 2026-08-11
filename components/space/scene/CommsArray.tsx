"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Región del universo donde vive /contact. */
export const COMMS_ORIGIN: [number, number, number] = [30, 0, 20];

const PULSE_COUNT = 3;
const PULSE_PERIOD = 2.4;
const BEAM_COUNT = 14;
const BEAM_LENGTH = 3.2;

/** Un pulso de anillo expandiéndose desde el plato — la señal saliendo. */
function Pulse({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const color = useMemo(() => new THREE.Color("#5ee7ff"), []);

  useFrame((state) => {
    const t = ((state.clock.elapsedTime + (index / PULSE_COUNT) * PULSE_PERIOD) % PULSE_PERIOD) / PULSE_PERIOD;
    const scale = 0.15 + t * 1.6;
    meshRef.current?.scale.setScalar(scale);
    if (materialRef.current) materialRef.current.opacity = (1 - t) * 0.5;
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2.3, 0, 0]}>
      <ringGeometry args={[0.5, 0.54, 32]} />
      <meshBasicMaterial ref={materialRef} color={color} transparent side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

/** Haz de partículas viajando hacia fuera — "estás transmitiendo", no solo
 * escuchando. Se mueve a lo largo del eje de mira del plato. */
function Beam() {
  const pointsRef = useRef<THREE.Points>(null);
  const color = useMemo(() => new THREE.Color("#ff7a52"), []);

  const geometry = useMemo(() => {
    const positions = new Float32Array(BEAM_COUNT * 3);
    for (let i = 0; i < BEAM_COUNT; i++) {
      positions[i * 3 + 2] = (i / BEAM_COUNT) * BEAM_LENGTH;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    const pos = pointsRef.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (!pos) return;
    for (let i = 0; i < BEAM_COUNT; i++) {
      let z = pos.getZ(i) + delta * 1.8;
      if (z > BEAM_LENGTH) z -= BEAM_LENGTH;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial color={color} size={0.05} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

/** Matriz de comunicaciones: el único sitio del sitio donde el visitante
 * emite en vez de recibir. Plato + pulsos de señal expandiéndose + un haz
 * de partículas saliendo hacia el espacio, sobre una base con más presencia
 * que una antena suelta. */
export function CommsArray() {
  const dishRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (dishRef.current) dishRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.4;
  });

  return (
    <group position={COMMS_ORIGIN} scale={1.6}>
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.1, 1.3, 0.18, 24]} />
        <meshBasicMaterial color="#111528" />
      </mesh>
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.02, 1.1, 24]} />
        <meshBasicMaterial color="#5a68a4" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.07, 0.11, 1.4, 8]} />
        <meshBasicMaterial color="#5a68a4" />
      </mesh>

      <group ref={dishRef} position={[0, 0.5, 0]}>
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[0.55, 0.04, 8, 24]} />
          <meshBasicMaterial color="#5ee7ff" />
        </mesh>
        <mesh position={[0, 0, 0.22]}>
          <sphereGeometry args={[0.09, 12, 8]} />
          <meshBasicMaterial color="#ff7a52" />
        </mesh>
        {Array.from({ length: PULSE_COUNT }).map((_, i) => (
          <Pulse key={i} index={i} />
        ))}
        <group position={[0, 0, 0.3]}>
          <Beam />
        </group>
      </group>
    </group>
  );
}
