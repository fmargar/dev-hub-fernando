"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Github, Lock } from "lucide-react";
import { useI18n } from "@/i18n";
import { getCase, getCaseNumbers, getCases } from "@/content/cases";
import { richText } from "@/lib/rich-text";
import { Figure } from "@/components/case/Figure";
import { Reveal } from "@/components/ui/Reveal";
import type { CaseSection } from "@/content/types";

function SectionBody({ section }: { section: CaseSection }) {
  return (
    <>
      {section.body && (
        <div className="body-copy mt-5 measure">
          {section.body.map((paragraph, i) => (
            // El primer párrafo entra como entradilla: da una puerta de acceso
            // al texto en vez de soltar un bloque uniforme.
            <p key={i} className={i === 0 ? "lead" : undefined}>
              {richText(paragraph)}
            </p>
          ))}
        </div>
      )}

      {section.pullQuote && (
        <blockquote className="pull-quote my-10 measure">{richText(section.pullQuote)}</blockquote>
      )}

      {section.bullets && (
        // En escritorio el término va en su propia columna: así se recorre la
        // lista de un vistazo sin tener que leerla entera.
        <dl className="mt-7 measure border-t border-[var(--rule)]">
          {section.bullets.map((bullet, i) => (
            <div
              key={i}
              className="grid gap-1.5 border-b border-[var(--rule)] py-5 md:grid-cols-[13rem_1fr] md:gap-8"
            >
              {bullet.term && <dt className="text-sm font-semibold leading-snug">{bullet.term}</dt>}
              <dd className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                {richText(bullet.text)}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {section.callout && (
        <div
          className={`callout mt-8 measure ${section.callout.tone === "note" ? "callout-note" : ""}`}
        >
          <p className="text-[0.9375rem] leading-relaxed">{richText(section.callout.text)}</p>
        </div>
      )}

      {section.figure && <Figure figureKey={section.figure.key} caption={section.figure.caption} />}
    </>
  );
}

export function CaseView({ slug }: { slug: string }) {
  const { t, locale } = useI18n();
  const study = getCase(locale, slug);

  if (!study) return null;

  const all = getCases(locale);
  const numbers = getCaseNumbers(locale);
  const position = all.findIndex((c) => c.slug === slug);
  const next = all[(position + 1) % all.length];

  const meta = [
    { label: t.work.meta.client, value: study.client },
    { label: t.work.meta.period, value: study.period },
    { label: t.work.meta.role, value: study.role },
  ];

  return (
    <article>
      {/* ── Cabecera: titular a la izquierda, ficha de datos a la derecha ── */}
      <header className="container-page pt-10 pb-14 md:pt-14">
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t.work.backToIndex}
        </Link>

        <div className="page-grid mt-10">
          <div className="col-wide">
            <div className="flex items-start gap-5">
              <span className="index-number shrink-0" aria-hidden="true">
                {String(numbers[study.slug] ?? 0).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="eyebrow">
                  {study.track === "professional"
                    ? t.work.groups.professional
                    : t.work.groups.personal}
                </p>
                <h1 className="display-1 mt-3">{study.title}</h1>
              </div>
            </div>
            <p className="lead mt-7 measure text-muted-foreground">{study.tagline}</p>

            {/* El stack va en la columna ancha, no en la ficha: son muchas
                etiquetas y ahí caben en una línea en vez de alargar el raíl y
                dejar un hueco debajo del titular. */}
            <div className="mt-9">
              <p className="eyebrow">{t.work.meta.stack}</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {study.stack.map((tech) => (
                  <span key={tech} className="tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="col-side">
            <dl className="border-t border-[var(--rule)]">
              {meta.map((item) => (
                <div key={item.label} className="border-b border-[var(--rule)] py-3.5">
                  <dt className="eyebrow">{item.label}</dt>
                  <dd className="mt-1.5 text-sm leading-snug">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5">
              {study.repo.visibility === "public" && study.repo.href ? (
                <a
                  href={study.repo.href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary w-full"
                >
                  <Github className="h-4 w-4" />
                  {t.work.repoPublic}
                </a>
              ) : (
                <p className="flex items-start gap-2.5 text-tiny text-muted-foreground">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    <span className="font-medium text-foreground">{t.work.repoPrivate}.</span>{" "}
                    {study.repo.note}
                  </span>
                </p>
              )}
            </div>
          </aside>
        </div>
      </header>

      {/* ── Métricas ─────────────────────────────────────────────────────── */}
      {study.metrics.length > 0 && (
        <section className="border-y border-[var(--rule)] bg-[var(--surface-subtle)]">
          <div className="container-page py-9">
            <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {study.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="sr-only">{metric.label}</dt>
                  <dd>
                    <span className="stat-value block">
                      {metric.value}
                    </span>
                    <span className="mt-1.5 block text-tiny text-muted-foreground">
                      {metric.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* ── Cuerpo ───────────────────────────────────────────────────────── */}
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_14rem] lg:gap-16">
          <div className="min-w-0">
            {study.sections.map((section) => (
              <Reveal key={section.id}>
                <section id={section.id} className="mb-16 scroll-mt-24 last:mb-0 md:mb-20">
                  <h2 className="display-3">{section.heading}</h2>
                  <SectionBody section={section} />
                </section>
              </Reveal>
            ))}
          </div>

          {/* Índice lateral: solo tiene sentido cuando cabe al lado del texto. */}
          <aside className="hidden lg:block">
            <nav aria-label={t.work.onThisPage} className="sticky top-24">
              <p className="eyebrow">{t.work.onThisPage}</p>
              <ul className="mt-3 space-y-2 border-l border-[var(--rule)]">
                {study.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block border-l border-transparent -ml-px pl-3 text-sm text-muted-foreground hover:border-[var(--accent)] hover:text-foreground transition-colors"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </div>

      {/* ── Siguiente caso ───────────────────────────────────────────────── */}
      <nav className="border-t border-[var(--rule)]" aria-label={t.work.nextCase}>
        <div className="container-page py-12">
          <Link href={`/work/${next.slug}`} className="group block">
            <p className="eyebrow">{t.work.nextCase}</p>
            <div className="mt-3 flex items-baseline justify-between gap-6">
              <h2 className="display-3 group-hover:text-[var(--accent)] transition-colors">
                {next.title}
              </h2>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-2 measure text-sm text-muted-foreground">{next.tagline}</p>
          </Link>
        </div>
      </nav>
    </article>
  );
}
