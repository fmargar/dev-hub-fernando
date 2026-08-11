"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useSpaceStore } from "@/lib/space/store";
import { getSolarSystemBodies } from "@/lib/space/bodies";
import { positionAtTime } from "@/lib/space/orbits";
import { TRAJECTORY_ORIGIN } from "@/lib/space/trajectory";
import { COMMS_ORIGIN } from "@/components/space/scene/CommsArray";
import { STATION_BAY_ORIGIN } from "@/components/space/scene/StationBay";

const BODIES = getSolarSystemBodies();

const SYSTEM_OFFSET = new THREE.Vector3(0, 6, 15);
const WORK_OFFSET = new THREE.Vector3(0, 10, 12);
const EXPERIENCE_OFFSET = new THREE.Vector3(4, 4, 10);
const COMMS_OFFSET = new THREE.Vector3(2.5, 1.5, 3.5);
const TOOLS_OFFSET = new THREE.Vector3(0, 0.5, 5.5);
const IDLE_ROTATE_SPEED = 0.015; // rad/s, solo en la vista de sistema en reposo
const DAMPING = 2.6; // el viaje automático alcanza el objetivo en ~1/DAMPING s
const TRAVEL_SECONDS = 2.2; // ventana en la que el viaje manda sobre el arrastre del usuario
const FOLLOW_DAMPING = 1.4; // una vez asentado, ritmo al que el objetivo sigue a un cuerpo que orbita

/**
 * Punto de destino del viaje automático según el POI activo
 * (lib/space/pois.ts, escrito por SpaceRouteSync). Para un caso concreto,
 * calcula la posición orbital EN VIVO del cuerpo con la misma
 * positionAtTime que usan CaseBody/BinaryTrade/StationHomelab para
 * dibujarse: cámara y cuerpo están de acuerdo por construcción.
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

  if (poi === "experience") {
    // El centro de la línea, no su origen: con varias balizas en fila la
    // cámara debe mirar al medio del recorrido, no a su primer extremo.
    const origin = new THREE.Vector3(TRAJECTORY_ORIGIN[0], TRAJECTORY_ORIGIN[1], TRAJECTORY_ORIGIN[2] + 6);
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

  // "system" (home) y "stack" (sin región 3D propia — sus lunas viven en
  // cada proyecto real, ver lib/space/bodies.ts): vista general con una
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

/**
 * Cámara con dos modos que se turnan, nunca compiten: durante los primeros
 * TRAVEL_SECONDS tras cambiar de POI, un viaje automático amortiguado
 * manda sobre posición y objetivo (estilo "salto" cinematográfico); pasado
 * ese margen, OrbitControls toma el mando por completo — arrastrar para
 * orbitar, rueda para acercar, con inercia — y el objetivo solo se sigue
 * reajustando muy despacio para no perder de vista un cuerpo que orbita.
 * El truco para que no se peleen: durante el viaje se escribe
 * `camera.position` a mano y se llama `controls.update()` justo después,
 * que resincroniza el estado interno de OrbitControls con la posición real
 * en vez de deshacerla — así el arrastre del usuario nunca "rebota" al
 * reanudarse.
 */
export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const idleAngleRef = useRef(0);
  const travelStartRef = useRef(0);
  const lastPoiRef = useRef<string | null>(null);

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const { poi } = useSpaceStore.getState();
    idleAngleRef.current += delta * IDLE_ROTATE_SPEED;

    if (poi !== lastPoiRef.current) {
      travelStartRef.current = state.clock.elapsedTime;
      lastPoiRef.current = poi;
    }
    const traveling = state.clock.elapsedTime - travelStartRef.current < TRAVEL_SECONDS;

    const { camera: targetPos, lookAt: targetLookAt } = computeTarget(
      poi,
      state.clock.elapsedTime,
      idleAngleRef.current,
    );

    if (traveling) {
      const t = 1 - Math.exp(-DAMPING * delta);
      state.camera.position.lerp(targetPos, t);
      controls.target.lerp(targetLookAt, t);
    } else {
      controls.target.lerp(targetLookAt, 1 - Math.exp(-FOLLOW_DAMPING * delta));
    }

    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={1.2}
      maxDistance={70}
      enablePan={false}
      makeDefault
    />
  );
}
