"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Github, Lock } from "lucide-react";
import { useI18n } from "@/i18n";
import { getCase, getCases } from "@/content/cases";
import { richText } from "@/lib/rich-text";
import { Figure } from "@/components/case/Figure";
import { Reveal } from "@/components/ui/Reveal";

export function CaseView({ slug }: { slug: string }) {
  const { t, locale } = useI18n();
  const study = getCase(locale, slug);

  if (!study) return null;

  const all = getCases(locale);
  const index = all.findIndex((c) => c.slug === slug);
  const next = all[(index + 1) % all.length];

  const meta = [
    { label: t.work.meta.client, value: study.client },
    { label: t.work.meta.period, value: study.period },
    { label: t.work.meta.role, value: study.role },
  ];

  return (
    <article>
      {/* ── Cabecera ─────────────────────────────────────────────────────── */}
      <header className="container-page pt-12 pb-12 md:pt-16">
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t.work.backToIndex}
        </Link>

        <p className="eyebrow mt-10">
          {String(index + 1).padStart(2, "0")} · {study.year}
        </p>
        <h1 className="display-1 mt-4 measure">{study.title}</h1>
        <p className="mt-6 measure text-xl text-muted-foreground">{study.tagline}</p>

        <dl className="mt-12 grid gap-x-8 gap-y-6 border-t border-[var(--rule)] pt-8 sm:grid-cols-3">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="eyebrow">{item.label}</dt>
              <dd className="mt-2 text-sm">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8">
          <p className="eyebrow">{t.work.meta.stack}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {study.stack.map((tech) => (
              <span key={tech} className="tag">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {study.repo.visibility === "public" && study.repo.href ? (
            <a
              href={study.repo.href}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              <Github className="h-4 w-4" />
              {t.work.repoPublic}
            </a>
          ) : (
            <p className="flex items-start gap-2.5 text-sm text-muted-foreground measure">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                <span className="font-medium text-foreground">{t.work.repoPrivate}.</span>{" "}
                {study.repo.note}
              </span>
            </p>
          )}
        </div>
      </header>

      {/* ── Métricas ─────────────────────────────────────────────────────── */}
      {study.metrics.length > 0 && (
        <section className="border-y border-[var(--rule)] bg-[var(--surface-subtle)]">
          <div className="container-page py-8">
            <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {study.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="sr-only">{metric.label}</dt>
                  <dd>
                    <span className="block font-serif text-3xl font-semibold">{metric.value}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{metric.label}</span>
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
                  <h2 className="display-3 measure">{section.heading}</h2>

                  {section.body && (
                    <div className="body-copy mt-5 measure">
                      {section.body.map((paragraph, i) => (
                        <p key={i}>{richText(paragraph)}</p>
                      ))}
                    </div>
                  )}

                  {section.bullets && (
                    <ul className="mt-6 measure divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
                      {section.bullets.map((bullet, i) => (
                        <li key={i} className="py-4">
                          {bullet.term && (
                            <p className="text-sm font-medium">{bullet.term}</p>
                          )}
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {richText(bullet.text)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.figure && (
                    <Figure figureKey={section.figure.key} caption={section.figure.caption} />
                  )}
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
                      className="block border-l border-transparent -ml-px pl-3 text-sm text-muted-foreground hover:border-[var(--primary)] hover:text-foreground transition-colors"
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
              <h2 className="display-3 group-hover:text-[var(--primary)] transition-colors">{next.title}</h2>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-2 measure text-sm text-muted-foreground">{next.tagline}</p>
          </Link>
        </div>
      </nav>
    </article>
  );
}
