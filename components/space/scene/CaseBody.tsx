"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  planetVert,
  planetFrag,
  cloudsVert,
  cloudsFrag,
  atmosphereVert,
  atmosphereFrag,
} from "@/components/space/shaders/planet";
import { Satellites } from "@/components/space/scene/Satellites";
import { useSpaceStore } from "@/lib/space/store";
import type { CaseBodyVisual } from "@/lib/space/bodies";
import type { OrbitParams } from "@/lib/space/orbits";
import { positionAtTime } from "@/lib/space/orbits";

const LIGHT_DIR = new THREE.Vector3(1, 0.6, 0.5);
const ATMOSPHERE_BASE = 0.7;
const ATMOSPHERE_HOVER = 1.6;

/** Planeta genérico: núcleo con shader procedural + atmósfera fresnel +
 * satélites opcionales. Calcula su propia posición orbital cada fotograma
 * (positionAtTime, la misma función pura que usa CameraRig para apuntar) en
 * vez de recibirla como prop — así el padre nunca re-renderiza para mover
 * un planeta. Usado por civic/smart-city/moon; binary y station tienen su
 * propio componente (ver ./bodies/).
 *
 * `slug` alimenta el escáner (ScanTarget/useScanTarget): si el DOM escribe
 * este slug en store.hovered, la atmósfera se enciende — sin que este
 * componente sepa nada de qué elemento HTML lo disparó. */
export function CaseBody({
  visual,
  orbit,
  slug,
  onSelect,
}: {
  visual: CaseBodyVisual;
  orbit: OrbitParams;
  slug: string;
  onSelect?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const atmosphereMaterialRef = useRef<THREE.ShaderMaterial>(null);

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

  const cloudsUniforms = useMemo(
    () => ({
      uLightDir: { value: LIGHT_DIR },
      uSeed: { value: visual.seed },
      uSpin: { value: 0 },
    }),
    [visual.seed],
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

    // Las nubes giran a un ritmo propio, más lento y algo desacompasado del
    // planeta — así el clima se lee como algo vivo, no pegado a la corteza.
    if (cloudsMaterialRef.current) {
      cloudsMaterialRef.current.uniforms.uSpin.value += delta * (visual.rotationSpeed ?? 0.05) * 0.35;
    }

    const material = atmosphereMaterialRef.current;
    if (material) {
      const isHovered = useSpaceStore.getState().hovered === slug;
      const target = isHovered ? ATMOSPHERE_HOVER : ATMOSPHERE_BASE;
      const current = material.uniforms.uIntensity.value as number;
      material.uniforms.uIntensity.value = THREE.MathUtils.lerp(current, target, 1 - Math.exp(-8 * delta));
    }
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
      <mesh scale={1.025}>
        <sphereGeometry args={[visual.radius, 40, 28]} />
        <shaderMaterial
          ref={cloudsMaterialRef}
          transparent
          depthWrite={false}
          vertexShader={cloudsVert}
          fragmentShader={cloudsFrag}
          uniforms={cloudsUniforms}
        />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[visual.radius, 32, 24]} />
        <shaderMaterial
          ref={atmosphereMaterialRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          vertexShader={atmosphereVert}
          fragmentShader={atmosphereFrag}
          uniforms={atmosphereUniforms}
        />
      </mesh>
      {visual.satelliteTechs && visual.satelliteTechs.length > 0 ? (
        <Satellites techs={visual.satelliteTechs} radius={visual.radius * 2.2} color={visual.colorHighlight} />
      ) : null}
    </group>
  );
}
