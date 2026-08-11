"use client";

import { Nebula } from "@/components/space/scene/Nebula";
import { Starfield } from "@/components/space/scene/Starfield";
import { CameraRig } from "@/components/space/scene/CameraRig";
import { Star } from "@/components/space/scene/Star";
import { SolarSystem } from "@/components/space/scene/SolarSystem";

/** Raíz de la escena 3D: la estrella en el origen, los 5 casos orbitándola
 * y la cámara que viaja entre ellos según el POI activo. */
export function SystemScene() {
  return (
    <>
      <Nebula />
      <Starfield />
      <Star />
      <SolarSystem />
      <CameraRig />
      <ambientLight intensity={0.6} />
    </>
  );
}
