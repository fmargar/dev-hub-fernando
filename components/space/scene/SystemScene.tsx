"use client";

import { Nebula } from "@/components/space/scene/Nebula";
import { Starfield } from "@/components/space/scene/Starfield";
import { CameraRig } from "@/components/space/scene/CameraRig";

/** Raíz de la escena 3D. Sin cuerpos todavía — la fase 5 añade el sistema
 * de los 5 casos aquí dentro. */
export function SystemScene() {
  return (
    <>
      <Nebula />
      <Starfield />
      <CameraRig />
      <ambientLight intensity={0.6} />
    </>
  );
}
