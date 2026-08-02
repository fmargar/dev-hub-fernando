"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Github, Lock } from "lucide-react";
import { useI18n } from "@/i18n";
import { caseRef, getCase, getCases } from "@/content/cases";
import { media, type MediaKey } from "@/content/media";
import { richText } from "@/lib/rich-text";
import { Figure } from "@/components/case/Figure";
import type { CaseSection, CaseShot } from "@/content/types";

function Shot({ shot, priority = false }: { shot: CaseShot; priority?: boolean }) {
  const asset = media[shot.key as MediaKey];
  if (!asset) return null;

  return (
    <figure className="plate">
      <Image
        src={asset.src}
        alt={shot.alt}
        width={asset.width}
        height={asset.height}
        sizes="(min-width: 1024px) 46rem, 92vw"
        priority={priority}
      />
      <figcaption className="typed mt-2.5 px-1 pb-0.5">{shot.caption}</figcaption>
    </figure>
  );
}

function SectionBody({ section }: { section: CaseSection }) {
  return (
    <>
      {section.body && (
        <div className="body-copy mt-4 measure text-[var(--ink-soft)]">
          {section.body.map((paragraph, i) => (
            <p key={i}>{richText(paragraph)}</p>
          ))}
        </div>
      )}

      {section.pullQuote && (
        /* Anotación al margen: reglas arriba y abajo, sin barra de color. */
        <blockquote className="marginal my-9 measure">{richText(section.pullQuote)}</blockquote>
      )}

      {section.bullets && (
        <dl className="mt-7 measure border-t border-[var(--card-rule)]">
          {section.bullets.map((bullet, i) => (
            <div
              key={i}
              className="grid gap-1.5 border-b border-[var(--card-rule)] py-5 md:grid-cols-[13rem_1fr] md:gap-8"
            >
              {bullet.term && <dt className="text-sm font-bold leading-snug">{bullet.term}</dt>}
              <dd className="text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                {richText(bullet.text)}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {section.shots && section.shots.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {section.shots.map((shot) => (
            <Shot key={shot.key} shot={shot} />
          ))}
        </div>
      )}

      {section.callout && (
        /* Diligencia: la anotación que se añade al expediente. */
        <div
          className={`note mt-8 measure ${section.callout.tone === "warning" ? "note-warning" : ""}`}
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
  const position = all.findIndex((c) => c.slug === slug);
  const next = all[(position + 1) % all.length];

  const meta = [
    { label: t.work.meta.client, value: study.client },
    { label: t.work.meta.period, value: study.period },
    { label: t.work.meta.role, value: study.role },
  ];

  return (
    <article>
      <div className="drawer-front">
        <div className="container-page flex flex-wrap items-center gap-4 py-4">
          <Link href="/work" className="link-quiet inline-flex items-center gap-1.5 text-sm">
            <ArrowLeft className="h-3.5 w-3.5" />
            {t.work.backToIndex}
          </Link>
          <span className="drawer-plate ml-auto">{caseRef(study)}</span>
        </div>
      </div>

      <div className="container-page section">
        {/* La ficha, sacada del cajón y abierta. */}
        <div className="file">
          <div className="file-head">
            <span className="file-ref">
              {study.track === "professional" ? t.work.groups.professional : t.work.groups.personal}
            </span>
            <span className="file-ref">{study.period}</span>
          </div>

          <div className="file-body">
            <div className="grid gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div>
                <h1 className="display-1">{study.title}</h1>
                <p className="lead mt-5 measure text-[var(--ink-soft)]">{study.tagline}</p>

                <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-3">
                  {meta.map((item) => (
                    <div key={item.label}>
                      <dt className="typed uppercase">{item.label}</dt>
                      <dd className="mt-1 text-sm leading-snug">{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-7">
                  <h2 className="typed uppercase">{t.work.meta.stack}</h2>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {study.stack.map((tech) => (
                      <span key={tech} className="tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-7">
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
                    <p className="flex items-start gap-2.5 text-tiny text-[var(--ink-soft)] measure">
                      <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>
                        <span className="font-bold text-[var(--ink)]">{t.work.repoPrivate}.</span>{" "}
                        {study.repo.note}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {study.cover && <Shot shot={study.cover} priority />}
            </div>

            {study.metrics.length > 0 && (
              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-[var(--card-rule)] pt-7 md:grid-cols-4">
                {study.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt className="sr-only">{metric.label}</dt>
                    <dd>
                      <span className="block text-3xl font-bold tracking-tight">{metric.value}</span>
                      <span className="typed mt-1.5 block">{metric.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          <span className="file-hole" aria-hidden="true" />
        </div>

        {/* El contenido del expediente, hoja a hoja. */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_14rem] lg:gap-14">
          <div className="file min-w-0">
            <div className="file-body">
              {study.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="mb-14 scroll-mt-28 last:mb-0 md:mb-16"
                >
                  <h2 className="display-3">{section.heading}</h2>
                  <SectionBody section={section} />
                </section>
              ))}
            </div>
          </div>

          <aside className="hidden lg:block">
            <nav aria-label={t.work.onThisPage} className="sticky top-28">
              <h2 className="divider-card">{t.work.onThisPage}</h2>
              <ul className="border-t border-[var(--border)]">
                {study.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block border-b border-[var(--border)] py-2.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--brass)] transition-colors"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>

        {/* La siguiente ficha del cajón. */}
        <nav aria-label={t.work.nextCase} className="mt-12">
          <h2 className="divider-card">{t.work.nextCase}</h2>
          <Link href={`/work/${next.slug}`} className="file group block">
            <div className="file-head">
              <span className="file-ref">
                {caseRef(next)} · {next.client}
              </span>
              <span className="file-ref">{next.year}</span>
            </div>
            <div className="file-body !py-6">
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="display-3 group-hover:text-[var(--stamp)] transition-colors">
                  {next.title}
                </h3>
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 measure text-sm text-[var(--ink-soft)]">{next.tagline}</p>
            </div>
          </Link>
        </nav>
      </div>
    </article>
  );
}
