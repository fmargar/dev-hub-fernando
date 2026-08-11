"use client";

import { useSpaceStore, type SpaceTier } from "@/lib/space/store";

const TIER_OPTIONS: { label: string; value: SpaceTier | null }[] = [
  { label: "AUTO", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
];

/**
 * Conmutador de fidelidad, visible en el pie. Etiquetas cortas y sin
 * traducir a propósito (AUTO/1/2/3, 3D ON/OFF): son código de instrumento,
 * no prosa, coherente con el registro invertido de la fase 3 — añadir
 * claves de i18n para esto sería sobre-ingeniería para un control tan
 * pequeño.
 */
export function QualityControl() {
  const tier = useSpaceStore((s) => s.tier);
  const qualityOverride = useSpaceStore((s) => s.qualityOverride);
  const setQualityOverride = useSpaceStore((s) => s.setQualityOverride);
  const optOut = useSpaceStore((s) => s.optOut);
  const setOptOut = useSpaceStore((s) => s.setOptOut);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="data">3D · nivel {tier}</span>
      <div className="flex items-center gap-1" role="group" aria-label="Fidelidad del sistema espacial">
        {TIER_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            type="button"
            disabled={optOut}
            onClick={() => setQualityOverride(opt.value)}
            aria-pressed={qualityOverride === opt.value}
            className="btn btn-ghost h-7 min-h-0 px-2 text-xs disabled:opacity-40"
            style={qualityOverride === opt.value ? { color: "var(--accent)" } : undefined}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setOptOut(!optOut)}
        aria-pressed={optOut}
        className="btn btn-ghost h-7 min-h-0 px-2 text-xs"
        style={optOut ? { color: "var(--accent)" } : undefined}
      >
        {optOut ? "3D OFF" : "3D ON"}
      </button>
    </div>
  );
}
