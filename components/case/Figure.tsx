"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/i18n";

/**
 * Diagramas de los casos. Están construidos con HTML y los tokens del tema en
 * lugar de con SVG o imágenes: así se adaptan al ancho, se leen en claro y en
 * oscuro sin exportar dos versiones, y un lector de pantalla puede recorrerlos.
 */

function Box({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "accent" | "muted" }) {
  const toneClass =
    tone === "accent"
      ? "border-[var(--primary)] text-[var(--primary)]"
      : tone === "muted"
        ? "border-[var(--rule)] text-muted-foreground"
        : "border-[var(--rule-strong)]";
  return (
    <div className={`rounded-md border bg-[var(--background)] px-3 py-2.5 text-xs leading-snug ${toneClass}`}>
      {children}
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-1.5 pl-3 md:justify-center md:py-0 md:pl-0" aria-hidden="true">
      <span className="hidden md:block h-px w-6 bg-[var(--rule-strong)]" />
      <span className="md:hidden h-5 w-px bg-[var(--rule-strong)]" />
      {label && <span className="font-mono text-[10px] text-muted-foreground">{label}</span>}
    </div>
  );
}

function Flow({ steps }: { steps: { label: string; note?: string; tone?: "default" | "accent" | "muted" }[] }) {
  return (
    <div className="flex flex-col md:flex-row md:items-stretch md:gap-0">
      {steps.map((step, i) => (
        <div key={step.label} className="contents">
          <div className="md:flex-1 md:min-w-0">
            <Box tone={step.tone}>
              <span className="block font-medium">{step.label}</span>
              {step.note && <span className="mt-1 block text-[11px] text-muted-foreground">{step.note}</span>}
            </Box>
          </div>
          {i < steps.length - 1 && <Arrow />}
        </div>
      ))}
    </div>
  );
}

function VadosFlow() {
  return (
    <div className="space-y-4">
      <Flow
        steps={[
          { label: "React + Inertia", note: "el usuario actúa" },
          { label: "Middleware auth", note: "verifica la sesión" },
          { label: "Controlador + Policy", note: "valida y autoriza" },
          { label: "Eloquent + TerritorioScope", note: "filtra por zona", tone: "accent" },
          { label: "PostgreSQL" },
        ]}
      />
      <div className="flex items-start gap-3 rounded-md border border-dashed border-[var(--primary)] px-3 py-2.5">
        <span className="eyebrow shrink-0 pt-0.5">Observer</span>
        <p className="text-xs text-muted-foreground">
          En paralelo, <code className="font-mono">VadoObserver</code> escribe la auditoría (usuario, DNI, equipo y
          diferencia <code className="font-mono">old</code>/<code className="font-mono">new</code>) sin que el
          controlador intervenga.
        </p>
      </div>
    </div>
  );
}

const ZONES = ["Marbella", "San Pedro", "Nueva Andalucía", "Las Chapas"];

function VadosRoles() {
  return (
    <table className="w-full border-collapse text-xs">
      <caption className="sr-only">Permisos de lectura y escritura por rol y zona</caption>
      <thead>
        <tr>
          <th scope="col" className="border-b border-[var(--rule-strong)] py-2 pr-3 text-left font-medium">
            Rol
          </th>
          {ZONES.map((zone) => (
            <th
              key={zone}
              scope="col"
              className="border-b border-[var(--rule-strong)] px-2 py-2 text-left font-mono text-[10px] font-normal text-muted-foreground"
            >
              {zone}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" className="border-b border-[var(--rule)] py-2.5 pr-3 text-left font-mono text-[11px] font-normal">
            superadmin
          </th>
          {ZONES.map((zone) => (
            <td key={zone} className="border-b border-[var(--rule)] px-2 py-2.5 text-[var(--primary)]">
              lectura + escritura
            </td>
          ))}
        </tr>
        {ZONES.map((ownZone) => (
          <tr key={ownZone}>
            <th
              scope="row"
              className="border-b border-[var(--rule)] py-2.5 pr-3 text-left font-mono text-[11px] font-normal"
            >
              admin_{ownZone.toLowerCase().replace(/\s+/g, "_")}
            </th>
            {ZONES.map((zone) => (
              <td
                key={zone}
                className={`border-b border-[var(--rule)] px-2 py-2.5 ${
                  zone === ownZone ? "text-[var(--primary)]" : "text-muted-foreground"
                }`}
              >
                {zone === ownZone ? "lectura + escritura" : "solo lectura"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MarbellaFacilArch() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Box>
          <span className="block font-medium">Nodo A</span>
          <span className="mt-1 block text-[11px] text-muted-foreground">React SPA + API Laravel en contenedores</span>
        </Box>
        <Box>
          <span className="block font-medium">Nodo B (espejo)</span>
          <span className="mt-1 block text-[11px] text-muted-foreground">Misma pila, despliegue independiente</span>
        </Box>
      </div>
      <div className="flex justify-center" aria-hidden="true">
        <span className="h-5 w-px bg-[var(--rule-strong)]" />
      </div>
      <Box tone="accent">
        <span className="block font-medium">Tailscale · red mesh sobre WireGuard</span>
        <span className="mt-1 block text-[11px] text-muted-foreground">
          Túnel cifrado punto a punto; el puerto de MySQL nunca sale a internet
        </span>
      </Box>
      <div className="flex justify-center" aria-hidden="true">
        <span className="h-5 w-px bg-[var(--rule-strong)]" />
      </div>
      <Box>
        <span className="block font-medium">MySQL 8 · servidor del instituto</span>
        <span className="mt-1 block text-[11px] text-muted-foreground">Detrás del cortafuegos del centro</span>
      </Box>
      <p className="pt-2 text-[11px] text-muted-foreground">
        Delante de los dos nodos, Cloudflare actúa como proxy inverso y WAF con SSL/TLS en modo Strict. Portainer
        consulta GitHub cada cinco minutos y reconstruye los contenedores al detectar cambios.
      </p>
    </div>
  );
}

function HomelabNet() {
  const paths = [
    {
      label: "Cloudflare Tunnel",
      scope: "Público",
      detail: "Dominios y sitios. Túnel saliente: el router no abre ningún puerto entrante.",
      tone: "accent" as const,
    },
    {
      label: "Tailscale",
      scope: "Privado",
      detail: "Portainer, paneles internos y SSH. Solo alcanzable desde la red mesh.",
      tone: "default" as const,
    },
    {
      label: "Red ipvlan",
      scope: "Aislado",
      detail: "Un contenedor colocado en el segmento del segundo módem, sin NAT. Separación en capa 2.",
      tone: "muted" as const,
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {paths.map((path) => (
        <div key={path.label}>
          <p className="eyebrow mb-2">{path.scope}</p>
          <Box tone={path.tone}>
            <span className="block font-medium">{path.label}</span>
            <span className="mt-1 block text-[11px] text-muted-foreground">{path.detail}</span>
          </Box>
        </div>
      ))}
    </div>
  );
}

function GalleryPipeline() {
  return (
    <div className="space-y-4">
      <Flow
        steps={[
          { label: "Subida", note: "el cliente envía el fichero" },
          { label: "Comprobación de disco", note: "espacio libre y marcador", tone: "accent" },
          { label: "FFmpeg", note: "recompresión con hilos limitados" },
          { label: "YouTube API", note: "OAuth con refresh token" },
          { label: "Notificación", note: "push, ntfy, Discord o correo" },
        ]}
      />
      <p className="text-[11px] text-muted-foreground">
        Si la comprobación de disco falla, el proceso se detiene ahí: es preferible rechazar una subida a llenar el
        volumen y dejar la base de datos en solo lectura.
      </p>
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
      <div className="overflow-x-auto rounded-md border border-[var(--rule)] bg-[var(--surface-subtle)] p-4 md:p-6">
        <div className="min-w-[18rem]">
          <Component />
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-muted-foreground">
        <span className="eyebrow mr-2">{t.work.figureLabel}</span>
        {caption}
      </figcaption>
    </figure>
  );
}
