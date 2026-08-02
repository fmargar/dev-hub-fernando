"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/i18n";
import { richText } from "@/lib/rich-text";

/**
 * Diagramas de los casos. Están construidos con HTML y los tokens del tema en
 * lugar de con SVG o imágenes: así se adaptan al ancho, se leen en claro y en
 * oscuro sin exportar dos versiones, y un lector de pantalla puede recorrerlos.
 * Los textos salen de las traducciones, no del componente.
 */

interface Step {
  label: string;
  note?: string;
}

function Box({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "accent" | "muted" }) {
  const toneClass =
    tone === "accent"
      ? "border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--accent)]"
      : tone === "muted"
        ? "border-[var(--line)] text-[var(--fg-subtle)]"
        : "border-[var(--line-strong)] text-[var(--fg)]";
  return (
    <div className={`rounded-lg border bg-[var(--surface)] px-3.5 py-3 text-xs leading-snug ${toneClass}`}>
      {children}
    </div>
  );
}

function Connector() {
  return (
    <div className="flex items-center gap-2 py-1.5 pl-3 md:justify-center md:py-0 md:pl-0" aria-hidden="true">
      <span className="hidden md:block h-px w-6 bg-[var(--line-strong)]" />
      <span className="md:hidden h-5 w-px bg-[var(--line-strong)]" />
    </div>
  );
}

function Flow({ steps, accentIndex }: { steps: Step[]; accentIndex?: number }) {
  return (
    <div className="flex flex-col md:flex-row md:items-stretch md:gap-0">
      {steps.map((step, i) => (
        <div key={step.label} className="contents">
          <div className="md:flex-1 md:min-w-0">
            <Box tone={i === accentIndex ? "accent" : "default"}>
              <span className="block font-medium">{step.label}</span>
              {step.note && <span className="mt-1 block text-micro text-[var(--fg-muted)]">{step.note}</span>}
            </Box>
          </div>
          {i < steps.length - 1 && <Connector />}
        </div>
      ))}
    </div>
  );
}

function VadosFlow() {
  const { t } = useI18n();
  const copy = t.figures.vadosFlow;

  return (
    <div className="space-y-4">
      <Flow steps={copy.steps} accentIndex={3} />
      <div className="flex items-start gap-3 rounded-md border border-dashed border-[var(--accent-line)] px-3 py-2.5">
        <span className="data shrink-0 pt-0.5">{copy.observerLabel}</span>
        <p className="text-xs text-[var(--fg-muted)]">{richText(copy.observerText)}</p>
      </div>
    </div>
  );
}

// Los nombres de zona y los identificadores de rol son literales del sistema:
// no se traducen.
const ZONES = ["Marbella", "San Pedro", "Nueva Andalucía", "Las Chapas"];
const ROLE_IDS: Record<string, string> = {
  Marbella: "admin_marbella",
  "San Pedro": "admin_sanpedro",
  "Nueva Andalucía": "admin_nueva_andalucia",
  "Las Chapas": "admin_las_chapas",
};

function VadosRoles() {
  const { t } = useI18n();
  const copy = t.figures.vadosRoles;

  return (
    <table className="w-full border-collapse text-xs">
      <caption className="sr-only">{copy.caption}</caption>
      <thead>
        <tr>
          <th scope="col" className="border-b border-[var(--line-strong)] py-2 pr-3 text-left font-medium">
            {copy.roleHeader}
          </th>
          {ZONES.map((zone) => (
            <th
              key={zone}
              scope="col"
              className="border-b border-[var(--line-strong)] px-2 py-2 text-left data font-normal"
            >
              {zone}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" className="border-b border-[var(--line)] py-2.5 pr-3 text-left data font-normal">
            superadmin
          </th>
          {ZONES.map((zone) => (
            <td key={zone} className="border-b border-[var(--line)] px-2 py-2.5 text-[var(--accent)]">
              {copy.readWrite}
            </td>
          ))}
        </tr>
        {ZONES.map((ownZone) => (
          <tr key={ownZone}>
            <th
              scope="row"
              className="border-b border-[var(--line)] py-2.5 pr-3 text-left data font-normal"
            >
              {ROLE_IDS[ownZone]}
            </th>
            {ZONES.map((zone) => (
              <td
                key={zone}
                className={`border-b border-[var(--line)] px-2 py-2.5 ${
                  zone === ownZone ? "text-[var(--accent)]" : "text-[var(--fg-muted)]"
                }`}
              >
                {zone === ownZone ? copy.readWrite : copy.readOnly}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MarbellaFacilArch() {
  const { t } = useI18n();
  const copy = t.figures.mfArch;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {[copy.nodeA, copy.nodeB].map((node) => (
          <Box key={node.label}>
            <span className="block font-medium">{node.label}</span>
            <span className="mt-1 block text-micro text-[var(--fg-muted)]">{node.note}</span>
          </Box>
        ))}
      </div>
      <div className="flex justify-center" aria-hidden="true">
        <span className="h-5 w-px bg-[var(--line-strong)]" />
      </div>
      <Box tone="accent">
        <span className="block font-medium">{copy.vpn.label}</span>
        <span className="mt-1 block text-micro text-[var(--fg-muted)]">{copy.vpn.note}</span>
      </Box>
      <div className="flex justify-center" aria-hidden="true">
        <span className="h-5 w-px bg-[var(--line-strong)]" />
      </div>
      <Box>
        <span className="block font-medium">{copy.db.label}</span>
        <span className="mt-1 block text-micro text-[var(--fg-muted)]">{copy.db.note}</span>
      </Box>
      <p className="pt-2 text-micro text-[var(--fg-muted)]">{copy.footnote}</p>
    </div>
  );
}

function HomelabNet() {
  const { t } = useI18n();
  const tones = ["accent", "default", "muted"] as const;

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {t.figures.homelabNet.paths.map((path: { scope: string; label: string; detail: string }, i: number) => (
        <div key={path.label}>
          <p className="data mb-2">{path.scope}</p>
          <Box tone={tones[i] ?? "default"}>
            <span className="block font-medium">{path.label}</span>
            <span className="mt-1 block text-micro text-[var(--fg-muted)]">{path.detail}</span>
          </Box>
        </div>
      ))}
    </div>
  );
}

function GalleryPipeline() {
  const { t } = useI18n();
  const copy = t.figures.galleryPipeline;

  return (
    <div className="space-y-4">
      <Flow steps={copy.steps} accentIndex={1} />
      <p className="text-micro text-[var(--fg-muted)]">{copy.footnote}</p>
    </div>
  );
}

const FIGURES: Record<string, () => ReactNode> = {
  "vados-flow": VadosFlow,
  "vados-roles": VadosRoles,
  "mf-arch": MarbellaFacilArch,
  "homelab-net": HomelabNet,
  "gallery-pipeline": GalleryPipeline,
};

export function Figure({ figureKey, caption }: { figureKey: string; caption: string }) {
  const { t } = useI18n();
  const Component = FIGURES[figureKey];
  if (!Component) return null;

  return (
    <figure className="my-10">
      <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--bg-subtle)] p-5 md:p-7">
        <div className="min-w-[18rem]">
          <Component />
        </div>
      </div>
      <figcaption className="shot-caption">
        <span className="data mr-2">{t.work.figureLabel}</span>
        {caption}
      </figcaption>
    </figure>
  );
}
