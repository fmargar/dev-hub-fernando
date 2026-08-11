"use client";

import { Nebula } from "@/components/space/scene/Nebula";
import { Starfield } from "@/components/space/scene/Starfield";
import { CameraRig } from "@/components/space/scene/CameraRig";
import { Star } from "@/components/space/scene/Star";
import { SolarSystem } from "@/components/space/scene/SolarSystem";
import { Trajectory } from "@/components/space/scene/Trajectory";
import { CommsArray } from "@/components/space/scene/CommsArray";
import { StationBay } from "@/components/space/scene/StationBay";
import { Effects } from "@/components/space/scene/Effects";

/** Raíz de la escena 3D: un único universo persistente (el sistema solar de
 * los casos, la trayectoria de /experience, la matriz de /contact, la
 * bahía de /tools), todas montadas siempre — la cámara es lo único que
 * viaja entre ellas según el POI activo. /stack no tiene región propia: sus
 * tecnologías viven como lunas de cada proyecto real en SolarSystem, así
 * que la página es HUD puro sobre la vista general del sistema. */
export function SystemScene() {
  return (
    <>
      <Nebula />
      <Starfield />
      <Star />
      <SolarSystem />
      <Trajectory />
      <CommsArray />
      <StationBay />
      <CameraRig />
      <Effects />
      <ambientLight intensity={0.6} />
    </>
  );
}
