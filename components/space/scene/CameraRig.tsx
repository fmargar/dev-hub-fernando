"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceStore } from "@/lib/space/store";
import { getSolarSystemBodies } from "@/lib/space/bodies";
import { positionAtTime } from "@/lib/space/orbits";

const BODIES = getSolarSystemBodies();

const SYSTEM_OFFSET = new THREE.Vector3(0, 6, 15);
const WORK_OFFSET = new THREE.Vector3(0, 10, 12);
const IDLE_ROTATE_SPEED = 0.015; // rad/s, solo en la vista de sistema en reposo
const DAMPING = 2.6; // alcanza el objetivo en ~1/DAMPING segundos

/**
 * La cámara sigue al POI activo (lib/space/pois.ts, escrito por
 * SpaceRouteSync) con amortiguación crítica — nunca un salto. Para un caso
 * concreto, calcula la posición orbital EN VIVO del cuerpo con la misma
 * positionAtTime que usan CaseBody/BinaryTrade/StationHomelab para
 * dibujarse: cámara y cuerpo están de acuerdo por construcción, sin
 * sincronizar nada entre componentes.
 */
function computeTarget(poi: string, elapsed: number, idleAngle: number) {
  if (poi.startsWith("case:")) {
    const slug = poi.slice("case:".length);
    const body = BODIES.find((b) => b.slug === slug);
    if (body) {
      const [x, z] = positionAtTime(body.orbit, elapsed);
      const dist = body.visual.radius * 4.5 + 3.5;
      return {
        camera: new THREE.Vector3(x + dist * 0.55, body.visual.radius * 2.2 + 1.8, z + dist * 0.85),
        lookAt: new THREE.Vector3(x, 0, z),
      };
    }
  }

  if (poi === "work") {
    return { camera: WORK_OFFSET.clone(), lookAt: new THREE.Vector3(0, 0, 0) };
  }

  // "system" y cualquier POI sin escena todavía (stack/experience/contact/
  // tools llegan en fases 6-8): vista general con una órbita ociosa lenta.
  const radius = Math.hypot(SYSTEM_OFFSET.x, SYSTEM_OFFSET.z);
  return {
    camera: new THREE.Vector3(
      SYSTEM_OFFSET.x + Math.sin(idleAngle) * radius * 0.12,
      SYSTEM_OFFSET.y,
      SYSTEM_OFFSET.z + Math.cos(idleAngle) * radius * 0.12,
    ),
    lookAt: new THREE.Vector3(0, 0, 0),
  };
}

export function CameraRig() {
  const idleAngleRef = useRef(0);
  const lookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const { poi } = useSpaceStore.getState();
    idleAngleRef.current += delta * IDLE_ROTATE_SPEED;

    const { camera: targetPos, lookAt: targetLookAt } = computeTarget(
      poi,
      state.clock.elapsedTime,
      idleAngleRef.current,
    );

    const t = 1 - Math.exp(-DAMPING * delta);
    state.camera.position.lerp(targetPos, t);
    lookAtRef.current.lerp(targetLookAt, t);
    state.camera.lookAt(lookAtRef.current);
  });

  return null;
}
