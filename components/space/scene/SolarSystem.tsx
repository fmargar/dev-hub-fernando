"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { getSolarSystemBodies } from "@/lib/space/bodies";
import { useLocalizedHref } from "@/lib/locale-paths";
import { CaseBody } from "@/components/space/scene/CaseBody";
import { BinaryTrade } from "@/components/space/scene/bodies/BinaryTrade";
import { StationHomelab } from "@/components/space/scene/bodies/StationHomelab";

function OrbitRing({ radius, color }: { radius: number; color: string }) {
  const ringColor = useMemo(() => new THREE.Color(color), [color]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.015, radius + 0.015, 96]} />
      <meshBasicMaterial color={ringColor} transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

/**
 * Los 5 casos como cuerpos del sistema, en el plano de la eclíptica. Es el
 * mapa lento: cada cuerpo es clicable y navega a su caso, pero es
 * exactamente lo mismo que ofrece la lista de enlaces reales en el HUD (ver
 * components/home/SystemMap.tsx) — la puerta rápida sigue existiendo si el
 * canvas nunca carga o el visitante prefiere teclado.
 */
export function SolarSystem() {
  const router = useRouter();
  const toLocale = useLocalizedHref();
  const bodies = useMemo(() => getSolarSystemBodies(), []);

  const goTo = (slug: string) => router.push(toLocale(`/work/${slug}`));

  return (
    <>
      {bodies.map((body) => (
        <OrbitRing key={`ring-${body.slug}`} radius={body.orbit.radius} color={body.visual.colorHighlight} />
      ))}

      {bodies.map((body) => {
        const onSelect = () => goTo(body.slug);
        if (body.kind === "binary") {
          return <BinaryTrade key={body.slug} visual={body.visual} orbit={body.orbit} onSelect={onSelect} />;
        }
        if (body.kind === "station") {
          return <StationHomelab key={body.slug} visual={body.visual} orbit={body.orbit} onSelect={onSelect} />;
        }
        return <CaseBody key={body.slug} visual={body.visual} orbit={body.orbit} onSelect={onSelect} />;
      })}
    </>
  );
}
