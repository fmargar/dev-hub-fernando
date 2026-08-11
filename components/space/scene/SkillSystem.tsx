"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { planetVert, planetFrag, atmosphereVert, atmosphereFrag } from "@/components/space/shaders/planet";
import { Satellites } from "@/components/space/scene/Satellites";
import { getSkillPlanets, type SkillPlanetConfig } from "@/lib/space/skills";

const LIGHT_DIR = new THREE.Vector3(1, 0.6, 0.5);

function SkillPlanet({ config }: { config: SkillPlanetConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => {
    const surface = new THREE.Color(config.color);
    return {
      uColorDeep: { value: surface.clone().multiplyScalar(0.35) },
      uColorSurface: { value: surface },
      uColorHighlight: { value: surface.clone().lerp(new THREE.Color("#ffffff"), 0.55) },
      uLightDir: { value: LIGHT_DIR },
      uSeed: { value: config.seed },
      uZonePartitions: { value: 0 },
      uCityLights: { value: 0 },
      uCityTint: { value: new THREE.Color("#5ee7ff") },
    };
  }, [config.color, config.seed]);

  const atmosphereUniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(config.color) }, uIntensity: { value: 0.7 } }),
    [config.color],
  );

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.06;
  });

  return (
    <group position={config.position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[config.radius, 48, 32]} />
        <shaderMaterial uniforms={uniforms} vertexShader={planetVert} fragmentShader={planetFrag} />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[config.radius, 32, 24]} />
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
      <Satellites count={config.satelliteCount} radius={config.radius * 2.4} color={config.color} />
    </group>
  );
}

/** Los 5 grupos de habilidades como constelación fija (no orbitan nada: no
 * hay "estrella" del stack, son una fila de mundos). Las lunas son
 * tecnologías del grupo — el recuento real de content/profile.ts, no un
 * número inventado. Vive lejos del sistema solar (lib/space/skills.ts,
 * SKILLS_ORIGIN); la cámara solo llega aquí cuando el POI es "stack". */
export function SkillSystem() {
  const planets = useMemo(() => getSkillPlanets(), []);
  return (
    <>
      {planets.map((p) => (
        <SkillPlanet key={p.groupId} config={p} />
      ))}
    </>
  );
}
