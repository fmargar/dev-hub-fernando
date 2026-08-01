"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/content/types";
import { useI18n } from "@/i18n";

/**
 * Índice de trabajo. Es el patrón principal del sitio: se usa igual en la home
 * (solo los destacados) y en /work (todos), y siempre agrupado por tipo, para
 * que el trabajo con cliente no se mezcle con los proyectos propios.
 */
export function WorkIndexList({
  cases,
  numbers,
}: {
  cases: CaseStudy[];
  numbers: Record<string, number>;
}) {
  const { t } = useI18n();

  return (
    <ol>
      {cases.map((item) => (
        <li key={item.slug} className="index-row">
          <Link href={`/work/${item.slug}`} className="group block py-8 md:py-10">
            <div className="grid gap-5 md:grid-cols-[5rem_1fr_14rem] md:items-start md:gap-8">
              <span className="index-numeral block" aria-hidden="true">
                {String(numbers[item.slug] ?? 0).padStart(2, "0")}
              </span>

              <div className="min-w-0">
                <h3 className="display-3 group-hover:text-[var(--accent-text)] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2.5 measure text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {item.tagline}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.stack.slice(0, 5).map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                  {item.stack.length > 5 && <span className="tag">+{item.stack.length - 5}</span>}
                </div>
              </div>

              <div className="md:text-right">
                <p className="text-sm">{item.client}</p>
                <p className="mt-1 font-mono text-tiny text-muted-foreground">{item.year}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground group-hover:text-[var(--accent-text)] transition-colors">
                  {t.work.read}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** Un bloque del índice: rótulo, nota breve y las filas. */
export function WorkIndexGroup({
  label,
  note,
  cases,
  numbers,
}: {
  label: string;
  note?: string;
  cases: CaseStudy[];
  numbers: Record<string, number>;
}) {
  if (cases.length === 0) return null;

  return (
    <section className="mt-14 first:mt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-4">
        <h2 className="eyebrow">{label}</h2>
        {note && <p className="text-tiny text-muted-foreground">{note}</p>}
      </div>
      <WorkIndexList cases={cases} numbers={numbers} />
    </section>
  );
}
