"use client";

import { Nebula } from "@/components/space/scene/Nebula";
import { Starfield } from "@/components/space/scene/Starfield";
import { CameraRig } from "@/components/space/scene/CameraRig";
import { Star } from "@/components/space/scene/Star";
import { SolarSystem } from "@/components/space/scene/SolarSystem";
import { SkillSystem } from "@/components/space/scene/SkillSystem";
import { Trajectory } from "@/components/space/scene/Trajectory";
import { CommsArray } from "@/components/space/scene/CommsArray";
import { StationBay } from "@/components/space/scene/StationBay";

/** Raíz de la escena 3D: un único universo persistente con tres regiones
 * (el sistema solar de los casos, la constelación de /stack, la
 * trayectoria de /experience), todas montadas siempre — la cámara es lo
 * único que viaja entre ellas según el POI activo, nunca se desmonta nada
 * al navegar dentro de un mismo layout raíz. */
export function SystemScene() {
  return (
    <>
      <Nebula />
      <Starfield />
      <Star />
      <SolarSystem />
      <SkillSystem />
      <Trajectory />
      <CommsArray />
      <StationBay />
      <CameraRig />
      <ambientLight intensity={0.6} />
    </>
  );
}
