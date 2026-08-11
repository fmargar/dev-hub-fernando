"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/lib/locale-paths";
import { useSpaceStore, hydrateSpacePreferences } from "@/lib/space/store";
import { detectTier, isToolsDetailRoute, prefersReducedMotion } from "@/lib/space/capability";
import { SpaceFallback } from "@/components/space/SpaceFallback";

// ssr:false solo es válido en un Client Component — por eso este módulo
// existe separado de SiteShell (Server Component): SiteShell monta
// SpaceStage sin más, y es SpaceStage quien decide si carga three.
const SpaceCanvas = dynamic(
  () => import("@/components/space/SpaceCanvas").then((m) => m.SpaceCanvas),
  { ssr: false },
);

const FIRST_FRAME_TIMEOUT_MS = 2500;

/**
 * Único punto de decisión del sistema espacial. El servidor emite siempre
 * SpaceFallback (nivel 0): el store arranca en tier:0 tanto en servidor
 * como en cliente, y solo sube en un useEffect posterior al montaje — así
 * que no hay desajuste de hidratación posible, la subida de nivel es
 * puramente un efecto secundario.
 */
export function SpaceStage() {
  const pathname = usePathname();
  const tier = useSpaceStore((s) => s.tier);
  const setDetectedTier = useSpaceStore((s) => s.setDetectedTier);
  const setReducedMotion = useSpaceStore((s) => s.setReducedMotion);
  const readyRef = useRef(false);

  useEffect(() => {
    hydrateSpacePreferences();
    setReducedMotion(prefersReducedMotion());
    setDetectedTier(detectTier());

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      setReducedMotion(mql.matches);
      setDetectedTier(detectTier());
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [setDetectedTier, setReducedMotion]);

  const { path } = stripLocale(pathname ?? "/");
  const forcedFallback = isToolsDetailRoute(path);
  const showCanvas = !forcedFallback && tier >= 1;

  // Salvaguarda del primer fotograma: si el canvas nunca llega a pintar
  // (dispositivo saturado, WebGL colgado...), cae a nivel 0 sin reintentar.
  useEffect(() => {
    if (!showCanvas) return;
    readyRef.current = false;
    const timeout = setTimeout(() => {
      if (!readyRef.current) setDetectedTier(0);
    }, FIRST_FRAME_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [showCanvas, setDetectedTier]);

  if (!showCanvas) {
    return <SpaceFallback />;
  }

  return <SpaceCanvas onReady={() => { readyRef.current = true; }} />;
}
