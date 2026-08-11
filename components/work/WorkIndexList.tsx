"use client";

import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "@/content/types";
import { media, type MediaKey } from "@/content/media";
import { useI18n } from "@/i18n";
import { Icon, useHoverIcon } from "@/components/ui/hover-icon";
import { useLocalizedHref } from "@/lib/locale-paths";
import ArrowNarrowRightIcon from "@/icons/arrow-narrow-right-icon";

/**
 * El caso que abre el grupo: tarjeta ancha con la captura a sangre por un
 * lateral. Es la única pieza de esta página que se lleva una imagen grande, y
 * por eso el resto no necesita competir.
 */
function LeadCase({ study }: { study: CaseStudy }) {
  const { t } = useI18n();
  const toLocale = useLocalizedHref();
  const [arrowRef, arrowHover] = useHoverIcon();
  const cover = study.cover ? media[study.cover.key as MediaKey] : null;

  return (
    <Link
      href={toLocale(`/work/${study.slug}`)}
      {...arrowHover}
      className="surface surface-lift group block overflow-hidden"
    >
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="flex flex-col justify-center p-7 md:p-9">
          <p className="data">
            {study.client} · {study.year}
          </p>
          <h3 className="display-2 mt-3 transition-colors group-hover:text-[var(--accent)]">
            {study.title}
          </h3>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
            {study.tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {study.stack.slice(0, 6).map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>

          <span className="action mt-7">
            {t.work.read}
            <Icon>
              <ArrowNarrowRightIcon ref={arrowRef} size={17} strokeWidth={1.75} />
            </Icon>
          </span>
        </div>

        {cover && study.cover && (
          <div className="relative min-h-[15rem] border-t border-[var(--line)] bg-[var(--surface-2)] md:min-h-0 md:border-l md:border-t-0">
            <Image
              src={cover.src}
              alt={study.cover.alt}
              fill
              sizes="(min-width: 768px) 48vw, 100vw"
              className="object-cover object-left-top"
              priority
            />
          </div>
        )}
      </div>
    </Link>
  );
}

/**
 * El resto va en filas separadas por filete, no en tarjetas iguales: así el
 * caso destacado sigue siendo el que manda y la lista se lee de un vistazo.
 */
function CaseRow({ study }: { study: CaseStudy }) {
  const { t } = useI18n();
  const toLocale = useLocalizedHref();
  const [arrowRef, arrowHover] = useHoverIcon();

  return (
    <li className="border-b border-[var(--line)] last:border-b-0">
      <Link
        href={toLocale(`/work/${study.slug}`)}
        {...arrowHover}
        className="group -mx-4 grid gap-x-8 gap-y-3 rounded-xl px-4 py-7 transition-colors hover:bg-[var(--bg-subtle)] md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)_auto] md:items-baseline"
      >
        <p className="data md:pt-1">{study.year}</p>

        <div className="min-w-0">
          <h3 className="display-3 transition-colors group-hover:text-[var(--accent)]">
            {study.title}
          </h3>
          <p className="mt-1.5 text-sm text-[var(--fg-subtle)]">{study.client}</p>
          <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
            {study.tagline}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {study.stack.slice(0, 5).map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <span className="action text-sm md:pt-1">
          {t.work.read}
          <Icon>
            <ArrowNarrowRightIcon ref={arrowRef} size={16} strokeWidth={1.75} />
          </Icon>
        </span>
      </Link>
    </li>
  );
}

export function WorkIndexGroup({
  label,
  note,
  cases,
  lead = false,
}: {
  label: string;
  note?: string;
  cases: CaseStudy[];
  /** El primer caso con captura se saca a tarjeta ancha. */
  lead?: boolean;
}) {
  if (cases.length === 0) return null;

  // Lidera el primero que tenga captura: el que puede enseñar el trabajo en vez
  // de contarlo. Si ninguno la tiene, todos se quedan en la lista.
  const leadIndex = lead ? cases.findIndex((c) => Boolean(c.cover)) : -1;
  const leadCase = leadIndex >= 0 ? cases[leadIndex] : null;
  const rest = leadCase ? cases.filter((_, i) => i !== leadIndex) : cases;

  return (
    <section className="mt-20 first:mt-0">
      <h2 className="display-2">{label}</h2>
      {note && <p className="lead measure mt-3">{note}</p>}

      <div className="mt-9">
        {leadCase && <LeadCase study={leadCase} />}
        {rest.length > 0 && (
          <ul className={leadCase ? "mt-4 border-t border-[var(--line)]" : ""}>
            {rest.map((study) => (
              <CaseRow key={study.slug} study={study} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
