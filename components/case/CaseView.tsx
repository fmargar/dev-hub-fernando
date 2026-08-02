"use client";

import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";
import { useI18n } from "@/i18n";
import { getCase, getCases } from "@/content/cases";
import { media, type MediaKey } from "@/content/media";
import { richText } from "@/lib/rich-text";
import { Figure } from "@/components/case/Figure";
import { Icon, useHoverIcon } from "@/components/ui/hover-icon";
import ArrowNarrowLeftIcon from "@/icons/arrow-narrow-left-icon";
import ArrowNarrowRightIcon from "@/icons/arrow-narrow-right-icon";
import GithubIcon from "@/icons/github-icon";
import InfoCircleIcon from "@/icons/info-circle-icon";
import TriangleAlertIcon from "@/icons/triangle-alert-icon";
import type { CaseSection, CaseShot } from "@/content/types";

function Shot({
  shot,
  priority = false,
  sizes = "(min-width: 1024px) 46rem, 92vw",
}: {
  shot: CaseShot;
  priority?: boolean;
  sizes?: string;
}) {
  const asset = media[shot.key as MediaKey];
  if (!asset) return null;

  return (
    <figure>
      <div className="shot">
        <Image
          src={asset.src}
          alt={shot.alt}
          width={asset.width}
          height={asset.height}
          sizes={sizes}
          priority={priority}
        />
      </div>
      <figcaption className="shot-caption">{shot.caption}</figcaption>
    </figure>
  );
}

function Callout({ tone, text }: { tone: "note" | "warning"; text: string }) {
  const [iconRef, iconHover] = useHoverIcon();
  const Glyph = tone === "warning" ? TriangleAlertIcon : InfoCircleIcon;

  return (
    <div
      {...iconHover}
      className={`note measure mt-8 ${tone === "warning" ? "note-warning" : ""}`}
    >
      <Icon className="note-icon mt-0.5">
        <Glyph ref={iconRef} size={17} strokeWidth={1.75} />
      </Icon>
      <p>{richText(text)}</p>
    </div>
  );
}

function SectionBody({ section }: { section: CaseSection }) {
  return (
    <>
      {section.body && (
        <div className="body-copy measure mt-5">
          {section.body.map((paragraph, i) => (
            <p key={i}>{richText(paragraph)}</p>
          ))}
        </div>
      )}

      {section.pullQuote && (
        <blockquote className="quote measure my-10">{richText(section.pullQuote)}</blockquote>
      )}

      {section.bullets && (
        <dl className="measure mt-8 border-t border-[var(--line)]">
          {section.bullets.map((bullet, i) => (
            <div
              key={i}
              className="grid gap-1.5 border-b border-[var(--line)] py-5 md:grid-cols-[12rem_1fr] md:gap-8"
            >
              {bullet.term && <dt className="text-sm font-semibold leading-snug">{bullet.term}</dt>}
              <dd className="text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
                {richText(bullet.text)}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {section.shots && section.shots.length > 0 && (
        <div className="mt-9 grid gap-7 sm:grid-cols-2">
          {section.shots.map((shot) => (
            <Shot key={shot.key} shot={shot} sizes="(min-width: 640px) 22rem, 92vw" />
          ))}
        </div>
      )}

      {section.callout && <Callout tone={section.callout.tone} text={section.callout.text} />}

      {section.figure && <Figure figureKey={section.figure.key} caption={section.figure.caption} />}
    </>
  );
}

function NextCase({ slug, title, tagline, label }: Record<"slug" | "title" | "tagline" | "label", string>) {
  const [arrowRef, arrowHover] = useHoverIcon();

  return (
    <nav aria-label={label} className="border-t border-[var(--line)] pt-10">
      <p className="data">{label}</p>
      <Link
        href={`/work/${slug}`}
        {...arrowHover}
        className="group mt-3 flex items-baseline justify-between gap-6"
      >
        <span className="min-w-0">
          <span className="display-2 block transition-colors group-hover:text-[var(--accent)]">
            {title}
          </span>
          <span className="measure mt-2 block text-[0.9375rem] text-[var(--fg-muted)]">
            {tagline}
          </span>
        </span>
        <Icon className="text-[var(--fg-muted)]">
          <ArrowNarrowRightIcon ref={arrowRef} size={26} strokeWidth={1.5} />
        </Icon>
      </Link>
    </nav>
  );
}

export function CaseView({ slug }: { slug: string }) {
  const { t, locale } = useI18n();
  const [backRef, backHover] = useHoverIcon();
  const [repoRef, repoHover] = useHoverIcon();
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
      <div className="container-page pt-8">
        <Link href="/work" {...backHover} className="action text-sm text-[var(--fg-muted)]">
          <Icon>
            <ArrowNarrowLeftIcon ref={backRef} size={16} strokeWidth={1.75} />
          </Icon>
          {t.work.backToIndex}
        </Link>
      </div>

      {/* Cabecera: el título manda y la captura entra a lo ancho justo debajo. */}
      <header className="container-page pb-12 pt-9 md:pb-16">
        <p className="data">
          {study.track === "professional" ? t.work.groups.professional : t.work.groups.personal}
        </p>
        <h1 className="display-1 mt-3 max-w-[18ch]">{study.title}</h1>
        <p className="lead measure mt-5">{study.tagline}</p>

        <dl className="mt-10 grid gap-x-10 gap-y-6 border-t border-[var(--line)] pt-8 sm:grid-cols-3">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="data">{item.label}</dt>
              <dd className="mt-1.5 text-sm leading-snug">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="flex flex-wrap gap-1.5">
            {study.stack.map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>

          {study.repo.visibility === "public" && study.repo.href ? (
            <a
              href={study.repo.href}
              target="_blank"
              rel="noreferrer"
              {...repoHover}
              className="btn btn-secondary h-10 min-h-0 text-sm"
            >
              <Icon>
                <GithubIcon ref={repoRef} size={16} strokeWidth={1.75} />
              </Icon>
              {t.work.repoPublic}
            </a>
          ) : (
            <p className="measure flex items-start gap-2 text-tiny text-[var(--fg-subtle)]">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                <span className="font-semibold text-[var(--fg)]">{t.work.repoPrivate}.</span>{" "}
                {study.repo.note}
              </span>
            </p>
          )}
        </div>
      </header>

      {study.cover && (
        <div className="container-page">
          <Shot shot={study.cover} priority sizes="(min-width: 1024px) 68rem, 94vw" />
        </div>
      )}

      {study.metrics.length > 0 && (
        <div className="container-page mt-14">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-7 border-y border-[var(--line)] py-8 md:grid-cols-4">
            {study.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <span className="block text-2xl font-semibold tracking-tight">
                    {metric.value}
                  </span>
                  <span className="mt-1.5 block text-sm text-[var(--fg-muted)]">
                    {metric.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="container-page section-tight grid gap-12 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-16">
        <div className="min-w-0">
          {study.sections.map((section) => (
            <section key={section.id} id={section.id} className="mb-16 scroll-mt-28 last:mb-0">
              <h2 className="display-2">{section.heading}</h2>
              <SectionBody section={section} />
            </section>
          ))}
        </div>

        <aside className="hidden lg:block">
          <nav aria-label={t.work.onThisPage} className="sticky top-28">
            <p className="data">{t.work.onThisPage}</p>
            <ul className="mt-3 space-y-2.5 border-l border-[var(--line)] pl-4">
              {study.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="link-quiet block text-sm leading-snug hover:text-[var(--accent)]"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      <div className="container-page pb-[var(--space-section)]">
        <NextCase
          slug={next.slug}
          title={next.title}
          tagline={next.tagline}
          label={t.work.nextCase}
        />
      </div>
    </article>
  );
}
