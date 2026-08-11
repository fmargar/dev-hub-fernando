"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useSpaceStore } from "@/lib/space/store";

/** Solo nivel ≥2 (escritorio o superior) — el coste de un paso de
 * postprocesado extra no es para gama baja. El umbral de luminancia deja
 * pasar los materiales realmente brillantes (estrella, satélites, luces de
 * ciudad, bahías) sin lavar la nebulosa de fondo, que se queda por debajo. */
export function Effects() {
  const tier = useSpaceStore((s) => s.tier);
  if (tier < 2) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.55} luminanceThreshold={0.3} luminanceSmoothing={0.25} mipmapBlur />
    </EffectComposer>
  );
}
