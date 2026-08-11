"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useSpaceStore } from "@/lib/space/store";
import { SystemScene } from "@/components/space/scene/SystemScene";

const DPR_BY_TIER: Record<number, [number, number] | number> = {
  1: 1,
  2: [1, 1.5],
  3: [1, 2],
};

/** Nunca se importa estáticamente: SpaceStage lo carga con next/dynamic
 * ssr:false, así que `three` (~165-190 KB gzip) solo entra en el navegador
 * de quien sube a nivel ≥1. */
export function SpaceCanvas({ onReady }: { onReady?: () => void }) {
  const tier = useSpaceStore((s) => s.tier);
  const interactive = useSpaceStore((s) => s.interactive);
  const setDetectedTier = useSpaceStore((s) => s.setDetectedTier);
  const dpr = DPR_BY_TIER[tier] ?? 1;
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  // Pestaña oculta: nada que renderizar, nada que gastar en batería.
  useEffect(() => {
    const onVisibility = () => setFrameloop(document.hidden ? "never" : "always");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <Canvas
      className="space-canvas"
      style={{ pointerEvents: interactive ? "auto" : "none" }}
      dpr={dpr}
      gl={{ antialias: tier >= 2, powerPreference: "high-performance" }}
      camera={{ fov: 55, near: 0.1, far: 2000, position: [0, 3, 14] }}
      frameloop={frameloop}
      onCreated={({ gl }) => {
        onReady?.();
        // Pérdida de contexto WebGL (memoria agotada, driver caído...): nivel
        // 0 permanente para la sesión, no se reintenta.
        gl.domElement.addEventListener("webglcontextlost", () => setDetectedTier(0));
      }}
    >
      <SystemScene />
    </Canvas>
  );
}
