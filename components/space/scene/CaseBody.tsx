"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { planetVert, planetFrag, atmosphereVert, atmosphereFrag } from "@/components/space/shaders/planet";
import { Satellites } from "@/components/space/scene/Satellites";
import type { CaseBodyVisual } from "@/lib/space/bodies";
import type { OrbitParams } from "@/lib/space/orbits";
import { positionAtTime } from "@/lib/space/orbits";

const LIGHT_DIR = new THREE.Vector3(1, 0.6, 0.5);

/** Planeta genérico: núcleo con shader procedural + atmósfera fresnel +
 * satélites opcionales. Calcula su propia posición orbital cada fotograma
 * (positionAtTime, la misma función pura que usa CameraRig para apuntar) en
 * vez de recibirla como prop — así el padre nunca re-renderiza para mover
 * un planeta. Usado por civic/smart-city/moon; binary y station tienen su
 * propio componente (ver ./bodies/). */
export function CaseBody({
  visual,
  orbit,
  onSelect,
}: {
  visual: CaseBodyVisual;
  orbit: OrbitParams;
  onSelect?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uColorDeep: { value: new THREE.Color(visual.colorDeep) },
      uColorSurface: { value: new THREE.Color(visual.colorSurface) },
      uColorHighlight: { value: new THREE.Color(visual.colorHighlight) },
      uLightDir: { value: LIGHT_DIR },
      uSeed: { value: visual.seed },
      uZonePartitions: { value: visual.zonePartitions ?? 0 },
      uCityLights: { value: visual.cityLights ? 1 : 0 },
      uCityTint: { value: new THREE.Color(visual.cityTint ?? "#5ee7ff") },
    }),
    [visual],
  );

  const atmosphereUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(visual.atmosphereColor) },
      uIntensity: { value: 0.7 },
    }),
    [visual.atmosphereColor],
  );

  useFrame((state, delta) => {
    const [x, z] = positionAtTime(orbit, state.clock.elapsedTime);
    groupRef.current?.position.set(x, 0, z);
    if (meshRef.current) meshRef.current.rotation.y += delta * (visual.rotationSpeed ?? 0.05);
  });

  return (
    <group
      ref={groupRef}
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
      <mesh ref={meshRef}>
        <sphereGeometry args={[visual.radius, 48, 32]} />
        <shaderMaterial uniforms={uniforms} vertexShader={planetVert} fragmentShader={planetFrag} />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[visual.radius, 32, 24]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          vertexShader={atmosphereVert}
          fragmentShader={atmosphereFrag}
          uniforms={atmosphereUniforms}
        />
      </mesh>
      {visual.satellites ? (
        <Satellites count={visual.satellites} radius={visual.radius * 2.2} color={visual.colorHighlight} />
      ) : null}
    </group>
  );
}
