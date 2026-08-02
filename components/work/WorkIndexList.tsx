"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/content/types";
import { media, type MediaKey } from "@/content/media";
import { caseRef } from "@/content/cases";
import { useI18n } from "@/i18n";

/**
 * Fichas del cajón. La primera se muestra sacada y abierta; las demás asoman
 * detrás. No es una parrilla de tarjetas iguales: en un archivo unas fichas
 * están fuera y otras dentro.
 */
function LeadFile({ study }: { study: CaseStudy }) {
  const { t } = useI18n();
  const cover = study.cover ? media[study.cover.key as MediaKey] : null;

  return (
    <Link href={`/work/${study.slug}`} className="file group block">
      <div className="file-head">
        <span className="file-ref">
          {caseRef(study)} · {study.client}
        </span>
        <span className="file-ref">{study.year}</span>
      </div>

      <div className="file-body grid gap-7 md:grid-cols-[1.05fr_1fr] md:items-start">
        <div>
          <h3 className="display-2 group-hover:text-[var(--stamp)] transition-colors">
            {study.title}
          </h3>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-[var(--ink-soft)]">
            {study.tagline}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {study.stack.slice(0, 6).map((tech) => (
              <span key={tech} className="tag">
                {tech}
              </span>
            ))}
          </div>

          <span className="mt-7 inline-flex items-center gap-2 font-semibold uppercase tracking-wide text-sm">
            {t.work.read}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>

        {cover && study.cover && (
          <figure className="plate">
            <Image
              src={cover.src}
              alt={study.cover.alt}
              width={cover.width}
              height={cover.height}
              sizes="(min-width: 768px) 44vw, 92vw"
              priority
            />
          </figure>
        )}
      </div>
      <span className="file-hole" aria-hidden="true" />
    </Link>
  );
}

function FiledRow({ study }: { study: CaseStudy }) {
  const { t } = useI18n();

  return (
    <Link
      href={`/work/${study.slug}`}
      className="file group block transition-transform hover:-translate-y-0.5"
    >
      <div className="file-head">
        <span className="file-ref">{caseRef(study)}</span>
        <span className="file-ref">{study.year}</span>
      </div>
      <div className="file-body !pb-6">
        <h3 className="display-3 group-hover:text-[var(--stamp)] transition-colors">
          {study.title}
        </h3>
        <p className="typed mt-1">{study.client}</p>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
          {study.tagline}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {study.stack.slice(0, 4).map((tech) => (
            <span key={tech} className="tag">
              {tech}
            </span>
          ))}
        </div>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide">
          {t.work.read}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

/** Un separador del cajón con las fichas que guarda detrás. */
export function WorkIndexGroup({
  label,
  note,
  cases,
  lead = false,
}: {
  label: string;
  note?: string;
  cases: CaseStudy[];
  /** La primera ficha del grupo se saca y se abre. */
  lead?: boolean;
}) {
  if (cases.length === 0) return null;

  // Se saca la primera ficha que tenga captura: la que puede enseñar el trabajo
  // en vez de contarlo. Si ninguna la tiene, todas se quedan archivadas.
  const leadIndex = lead ? cases.findIndex((c) => Boolean(c.cover)) : -1;
  const showLead = leadIndex >= 0;
  const leadCase = showLead ? cases[leadIndex] : null;
  const filed = showLead ? cases.filter((_, i) => i !== leadIndex) : cases;

  return (
    <section className="mt-16 first:mt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="divider-card">{label}</h2>
        {note && <p className="typed-on-steel">{note}</p>}
      </div>

      <div className="border-t border-[var(--border)] pt-7 grid gap-6">
        {leadCase && <LeadFile study={leadCase} />}
        {filed.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {filed.map((study) => (
              <FiledRow key={study.slug} study={study} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
