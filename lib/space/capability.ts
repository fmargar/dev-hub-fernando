import type { SpaceTier } from "@/lib/space/store";

/**
 * Techo de fidelidad detectado, nunca 3 (esa cota solo la activa un
 * conmutador explícito del visitante, fase 9 — ver QualityControl).
 * Puro y síncrono a propósito: se llama una vez desde SpaceStage en
 * useEffect, nunca en render ni en ámbito de módulo. El servidor emite
 * siempre nivel 0; esta función nunca corre ahí (`navigator`/`matchMedia`
 * no existen), así que no hay desajuste de hidratación posible: la subida
 * de nivel es puramente un efecto secundario post-montaje.
 */

export function probeWebgl2(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!canvas.getContext("webgl2");
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

function isSlowConnection(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
}

function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrowViewport = window.innerWidth < 768;

  if (typeof memory === "number" && memory <= 4) return true;
  if (typeof cores === "number" && cores <= 4) return true;
  if (coarsePointer && narrowViewport) return true;
  return false;
}

export function detectTier(): SpaceTier {
  if (prefersReducedMotion()) return 0;
  if (!probeWebgl2()) return 0;
  if (isSlowConnection()) return 0;
  if (isLowEndDevice()) return 1;
  return 2;
}

/** Las 33 herramientas de detalle necesitan la CPU entera (FFmpeg.wasm...). */
export function isToolsDetailRoute(strippedPath: string): boolean {
  return strippedPath.startsWith("/tools/");
}
