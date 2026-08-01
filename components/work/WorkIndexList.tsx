"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/content/types";
import { useI18n } from "@/i18n";

/**
 * Índice de trabajo en tarjetas. Se usa igual en la home (solo los destacados)
 * y en /work (todos), siempre agrupado por tipo para que el trabajo con cliente
 * no se mezcle con los proyectos propios.
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
    <ul className="grid gap-5 lg:grid-cols-2">
      {cases.map((item) => (
        <li key={item.slug}>
          <Link
            href={`/work/${item.slug}`}
            className="panel panel-lit group flex h-full flex-col p-7"
          >
            <p className="index-number">
              {String(numbers[item.slug] ?? 0).padStart(2, "0")}
              <span className="text-muted-foreground"> — {item.client}</span>
            </p>

            <h3 className="display-3 mt-3.5 group-hover:text-[var(--accent)] transition-colors">
              {item.title}
            </h3>

            <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {item.tagline}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {item.stack.slice(0, 5).map((tech) => (
                <span key={tech} className="tag">
                  {tech}
                </span>
              ))}
              {item.stack.length > 5 && <span className="tag">+{item.stack.length - 5}</span>}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--rule)] pt-4">
              <span className="font-mono text-tiny text-muted-foreground">{item.year}</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
                {t.work.read}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Un bloque del índice: rótulo, nota breve y las tarjetas. */
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
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--rule)] pb-3">
        <h2 className="eyebrow">{label}</h2>
        {note && <p className="text-tiny text-muted-foreground">{note}</p>}
      </div>
      <WorkIndexList cases={cases} numbers={numbers} />
    </section>
  );
}
