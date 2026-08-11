"use client";

import { Stars } from "@react-three/drei";
import { useSpaceStore } from "@/lib/space/store";

/** Presupuesto de partículas por nivel — ver plan de degradación (fase 4). */
const STAR_COUNT: Record<number, number> = {
  0: 0,
  1: 6000,
  2: 18000,
  3: 40000,
};

export function Starfield() {
  const tier = useSpaceStore((s) => s.tier);
  const count = STAR_COUNT[tier] ?? STAR_COUNT[1];

  if (count === 0) return null;

  return <Stars radius={300} depth={120} count={count} factor={3} saturation={0} fade speed={0.15} />;
}
