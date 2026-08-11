"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceStore } from "@/lib/space/store";
import { getSolarSystemBodies } from "@/lib/space/bodies";
import { positionAtTime } from "@/lib/space/orbits";
import { SKILLS_ORIGIN } from "@/lib/space/skills";
import { TRAJECTORY_ORIGIN } from "@/lib/space/trajectory";
import { COMMS_ORIGIN } from "@/components/space/scene/CommsArray";
import { STATION_BAY_ORIGIN } from "@/components/space/scene/StationBay";

const BODIES = getSolarSystemBodies();

const SYSTEM_OFFSET = new THREE.Vector3(0, 6, 15);
const WORK_OFFSET = new THREE.Vector3(0, 10, 12);
const STACK_OFFSET = new THREE.Vector3(0, 5, 13);
const EXPERIENCE_OFFSET = new THREE.Vector3(4, 4, 10);
const COMMS_OFFSET = new THREE.Vector3(2.5, 1.5, 3.5);
const TOOLS_OFFSET = new THREE.Vector3(0, 0.5, 5.5);
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

  if (poi === "stack") {
    const origin = new THREE.Vector3(...SKILLS_ORIGIN);
    return { camera: origin.clone().add(STACK_OFFSET), lookAt: origin };
  }

  if (poi === "experience") {
    // El centro de la línea, no su origen: con 5 balizas en fila la cámara
    // debe mirar al medio del recorrido, no a su primer extremo.
    const origin = new THREE.Vector3(
      TRAJECTORY_ORIGIN[0],
      TRAJECTORY_ORIGIN[1],
      TRAJECTORY_ORIGIN[2] + 6,
    );
    return { camera: origin.clone().add(EXPERIENCE_OFFSET), lookAt: origin };
  }

  if (poi === "contact") {
    const origin = new THREE.Vector3(...COMMS_ORIGIN);
    return { camera: origin.clone().add(COMMS_OFFSET), lookAt: origin };
  }

  if (poi === "tools") {
    const origin = new THREE.Vector3(...STATION_BAY_ORIGIN);
    return { camera: origin.clone().add(TOOLS_OFFSET), lookAt: origin };
  }

  // "system" y cualquier POI sin escena todavía: vista general con una
  // órbita ociosa lenta.
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
