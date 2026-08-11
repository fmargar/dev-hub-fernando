"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { CaseBodyVisual } from "@/lib/space/bodies";
import type { OrbitParams } from "@/lib/space/orbits";
import { positionAtTime } from "@/lib/space/orbits";
import { useSpaceStore } from "@/lib/space/store";
import { fetchHomelabStats } from "@/lib/space/live";
import fallback from "@/content/homelab-stats-fallback.json";

const MODULE_MATRIX = new THREE.Matrix4();
const MODULE_GEOMETRY_SIZE = 0.09;

/** Distribuye N módulos en una esfera de Fibonacci alrededor del núcleo —
 * reparto uniforme sin huecos ni amontonamientos, para cualquier N. */
function moduleShellPositions(count: number, shellRadius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    points.push(
      new THREE.Vector3(Math.cos(theta) * radiusAtY, y, Math.sin(theta) * radiusAtY).multiplyScalar(shellRadius),
    );
  }
  return points;
}

/**
 * Estación conectada a /api/homelab-stats vía lib/space/live.ts: los
 * módulos en órbita SON los contenedores reales del servidor de Fernando,
 * no un número inventado. Si el contenedor de al lado se levanta hoy, la
 * estación crece la próxima vez que alguien cargue la página — coherente
 * con "la prueba manda sobre la afirmación" (PRODUCT.md). Fallback al
 * snapshot estático si la API no responde o el dato supera 48h (misma
 * regla que ya aplica en la propia ruta).
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
  const modulesRef = useRef<THREE.InstancedMesh>(null);

  const live = useSpaceStore((s) => s.live);
  const setLive = useSpaceStore((s) => s.setLive);

  useEffect(() => {
    const controller = new AbortController();
    fetchHomelabStats(controller.signal).then((stats) => {
      if (stats) setLive(stats);
    });
    return () => controller.abort();
  }, [setLive]);

  const containerCount = live?.containers ?? fallback.containers;
  const stackCount = live?.stacks ?? fallback.stacks;
  const egressCount = live?.internetEgress ?? fallback.internetEgress;

  const coreColor = useMemo(() => new THREE.Color(visual.colorSurface), [visual.colorSurface]);
  const latticeColor = useMemo(() => new THREE.Color(visual.colorHighlight), [visual.colorHighlight]);
  const moduleColor = useMemo(() => new THREE.Color(visual.colorHighlight), [visual.colorHighlight]);

  const modulePositions = useMemo(
    () => moduleShellPositions(containerCount, visual.radius * 1.45),
    [containerCount, visual.radius],
  );

  // Un segmento de celosía por stack: arcos cortos repartidos en el
  // ecuador de la estación.
  const latticeSegments = useMemo(() => Math.max(stackCount, 1), [stackCount]);

  // Los brazos de antena son las salidas a internet reales (2 en producción).
  const antennaArms = useMemo(() => Math.max(egressCount, 1), [egressCount]);

  useEffect(() => {
    const mesh = modulesRef.current;
    if (!mesh) return;
    modulePositions.forEach((pos, i) => {
      MODULE_MATRIX.makeTranslation(pos.x, pos.y, pos.z);
      mesh.setMatrixAt(i, MODULE_MATRIX);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [modulePositions]);

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

        {/* Celosía: un segmento en wireframe por stack gestionado en el servidor real. */}
        <mesh>
          <icosahedronGeometry args={[visual.radius * 1.15, Math.min(latticeSegments > 12 ? 2 : 1, 2)]} />
          <meshBasicMaterial color={latticeColor} wireframe transparent opacity={0.5} />
        </mesh>

        {/* Módulos: un cubo por contenedor real, en una sola draw call. */}
        <instancedMesh ref={modulesRef} args={[undefined, undefined, containerCount]}>
          <boxGeometry args={[MODULE_GEOMETRY_SIZE, MODULE_GEOMETRY_SIZE, MODULE_GEOMETRY_SIZE]} />
          <meshBasicMaterial color={moduleColor} />
        </instancedMesh>

        {/* Antenas: un brazo por salida a internet independiente. */}
        {Array.from({ length: antennaArms }).map((_, i) => {
          const angle = (i / antennaArms) * Math.PI * 2;
          const armLength = visual.radius * 1.9;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * armLength * 0.5, 0, Math.sin(angle) * armLength * 0.5]}
              rotation={[0, -angle, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.012, 0.012, armLength, 6]} />
              <meshBasicMaterial color={latticeColor} transparent opacity={0.7} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
