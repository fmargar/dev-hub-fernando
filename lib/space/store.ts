import { create } from "zustand";
import type { HomelabStats } from "@/lib/space/live";

export type SpaceTier = 0 | 1 | 2 | 3;

const OPT_OUT_KEY = "space-opt-out";
const QUALITY_KEY = "space-quality-override";

function readOptOut(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

function readQualityOverride(): SpaceTier | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(QUALITY_KEY);
    if (raw === "1" || raw === "2" || raw === "3") return Number(raw) as SpaceTier;
    return null;
  } catch {
    return null;
  }
}

interface SpaceState {
  /** Nivel de fidelidad activo. El servidor renderiza siempre 0; sube tras montar. */
  tier: SpaceTier;
  /** Techo detectado por capability.ts, antes de aplicar un override manual. */
  detectedTier: SpaceTier;
  /** Override explícito del visitante (QualityControl, fase 9). null = automático. */
  qualityOverride: SpaceTier | null;
  /** POI actual, escrito por SpaceRouteSync a partir de la ruta. */
  poi: string;
  /** Elemento del DOM bajo el puntero que pide resaltar su cuerpo (ScanTarget, fase 7). */
  hovered: string | null;
  /** Transición de cámara entre POIs en curso (WarpOverlay). */
  warping: boolean;
  /** El canvas acepta punteros — solo cuando el mapa del sistema está enfocado. */
  interactive: boolean;
  live: HomelabStats | null;
  reducedMotion: boolean;
  /** Preferencia persistida: el visitante apagó el 3D a propósito. */
  optOut: boolean;

  setDetectedTier: (tier: SpaceTier) => void;
  setQualityOverride: (tier: SpaceTier | null) => void;
  setPoi: (poi: string) => void;
  setHovered: (id: string | null) => void;
  setWarping: (warping: boolean) => void;
  setInteractive: (interactive: boolean) => void;
  setLive: (live: HomelabStats | null) => void;
  setReducedMotion: (reduced: boolean) => void;
  setOptOut: (optOut: boolean) => void;
}

function effectiveTier(detected: SpaceTier, override: SpaceTier | null, optOut: boolean): SpaceTier {
  if (optOut) return 0;
  if (override !== null) return Math.min(override, detected) as SpaceTier;
  return detected;
}

export const useSpaceStore = create<SpaceState>((set) => ({
  tier: 0,
  detectedTier: 0,
  qualityOverride: null,
  poi: "system",
  hovered: null,
  warping: false,
  interactive: false,
  live: null,
  reducedMotion: false,
  optOut: false,

  setDetectedTier: (detectedTier) =>
    set((s) => ({ detectedTier, tier: effectiveTier(detectedTier, s.qualityOverride, s.optOut) })),

  setQualityOverride: (qualityOverride) => {
    try {
      if (qualityOverride === null) window.localStorage.removeItem(QUALITY_KEY);
      else window.localStorage.setItem(QUALITY_KEY, String(qualityOverride));
    } catch {
      // localStorage puede fallar en privado/incógnito estricto; el override
      // simplemente no persiste entre visitas, no es un error que romper nada.
    }
    set((s) => ({ qualityOverride, tier: effectiveTier(s.detectedTier, qualityOverride, s.optOut) }));
  },

  setPoi: (poi) => set({ poi }),
  setHovered: (hovered) => set({ hovered }),
  setWarping: (warping) => set({ warping }),
  setInteractive: (interactive) => set({ interactive }),
  setLive: (live) => set({ live }),

  setReducedMotion: (reducedMotion) =>
    set((s) => ({ reducedMotion, tier: effectiveTier(s.detectedTier, s.qualityOverride, s.optOut) })),

  setOptOut: (optOut) => {
    try {
      if (optOut) window.localStorage.setItem(OPT_OUT_KEY, "1");
      else window.localStorage.removeItem(OPT_OUT_KEY);
    } catch {
      // idem: preferencia solo de sesión si localStorage no está disponible.
    }
    set((s) => ({ optOut, tier: effectiveTier(s.detectedTier, s.qualityOverride, optOut) }));
  },
}));

// Hidratación de las dos preferencias persistidas. Se llama una vez desde
// SpaceStage en useEffect (nunca en ámbito de módulo: en el servidor
// `window` no existe, y llamarlo ahí produciría el mismo desajuste de
// hidratación que ya sufrió el idioma en localStorage — ver i18n/context.tsx).
export function hydrateSpacePreferences() {
  const optOut = readOptOut();
  const qualityOverride = readQualityOverride();
  useSpaceStore.setState((s) => ({
    optOut,
    qualityOverride,
    tier: effectiveTier(s.detectedTier, qualityOverride, optOut),
  }));
}
