"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { resolveContentLocale } from "@/content/cases";
import { getCertifications, getExperience, getSkills, profile } from "@/content/profile";
import { Icon, useHoverIcon } from "@/components/ui/hover-icon";
import ArrowNarrowRightIcon from "@/icons/arrow-narrow-right-icon";
import DownloadIcon from "@/icons/download-icon";
import ExternalLinkIcon from "@/icons/external-link-icon";
import type { ExperienceEntry } from "@/content/types";

function useDateRange() {
  const { t, locale } = useI18n();
  const formatter = new Intl.DateTimeFormat(
    locale === "es" ? "es-ES" : locale === "de" ? "de-DE" : "en-GB",
    { month: "short", year: "numeric" },
  );

  return (entry: ExperienceEntry) => {
    const start = formatter.format(new Date(entry.start));
    const end = entry.end ? formatter.format(new Date(entry.end)) : t.experience.present;
    return `${start} — ${end}`;
  };
}

function CaseLink({ slug, label }: { slug: string; label: string }) {
  const [arrowRef, arrowHover] = useHoverIcon();

  return (
    <Link href={`/work/${slug}`} {...arrowHover} className="action text-sm">
      {label}
      <Icon>
        <ArrowNarrowRightIcon ref={arrowRef} size={16} strokeWidth={1.75} />
      </Icon>
    </Link>
  );
}

function VerifyLink({ href, label }: { href: string; label: string }) {
  const [externalRef, externalHover] = useHoverIcon();

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      {...externalHover}
      className="action mt-3.5 text-sm"
    >
      {label}
      <Icon>
        <ExternalLinkIcon ref={externalRef} size={15} strokeWidth={1.75} />
      </Icon>
    </a>
  );
}

/** Cada puesto es una fila con su rango de fechas a la izquierda. */
function Timeline({ entries }: { entries: ExperienceEntry[] }) {
  const { t } = useI18n();
  const formatRange = useDateRange();

  return (
    <ol className="border-t border-[var(--line)]">
      {entries.map((entry) => (
        <li key={entry.id} className="border-b border-[var(--line)] py-8 last:border-b-0">
          <div className="grid gap-4 md:grid-cols-[11rem_1fr] md:gap-10">
            <p className="data md:pt-1.5">{formatRange(entry)}</p>

            <div className="min-w-0">
              <h3 className="display-3">{entry.role}</h3>
              <p className="mt-1.5 text-sm font-medium text-[var(--fg-muted)]">{entry.company}</p>
              <p className="measure mt-4 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
                {entry.summary}
              </p>

              {entry.highlights.length > 0 && (
                <ul className="measure mt-4 space-y-2.5">
                  {entry.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]"
                    >
                      <span
                        className="mt-[0.7em] h-px w-3 shrink-0 bg-[var(--line-strong)]"
                        aria-hidden="true"
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              {entry.cases && entry.cases.length > 0 && (
                <p className="mt-5">
                  {entry.cases.map((slug) => (
                    <CaseLink key={slug} slug={slug} label={t.experience.relatedCase} />
                  ))}
                </p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ExperienceView() {
  const { t, locale } = useI18n();
  const contentLocale = resolveContentLocale(locale);
  const [downloadRef, downloadHover] = useHoverIcon();
  const entries = getExperience(contentLocale);
  const certifications = getCertifications(contentLocale);
  const skills = getSkills(contentLocale);

  const work = entries.filter((e) => e.kind === "work");
  const education = entries.filter((e) => e.kind === "education");

  return (
    <>
      <div className="page-head">
        <div className="container-page">
          <h1 className="display-1">{t.experience.title}</h1>
          <p className="lead measure mt-5">{t.experience.intro}</p>
          <a
            href={profile.cv}
            download
            {...downloadHover}
            className="btn btn-secondary mt-8 h-10 min-h-0 text-sm"
          >
            <Icon>
              <DownloadIcon ref={downloadRef} size={16} strokeWidth={1.75} />
            </Icon>
            {t.experience.downloadCv}
          </a>
        </div>
      </div>

      <div className="container-page section">
        <section>
          <h2 className="display-2">{t.experience.sections.work}</h2>
          <div className="mt-7">
            <Timeline entries={work} />
          </div>
        </section>

        <section className="mt-20">
          <h2 className="display-2">{t.experience.sections.education}</h2>
          <div className="mt-7">
            <Timeline entries={education} />
          </div>
        </section>

        <section className="mt-20">
          <h2 className="display-2">{t.experience.sections.skills}</h2>
          <dl className="mt-7 border-t border-[var(--line)]">
            {skills.map((group) => (
              <div key={group.id} className="border-b border-[var(--line)] py-7">
                <div className="grid gap-4 md:grid-cols-[11rem_1fr] md:gap-10">
                  <dt className="text-sm font-semibold md:pt-0.5">{group.label}</dt>
                  <dd>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span key={item} className="chip">
                          {item}
                        </span>
                      ))}
                    </div>
                    {group.evidence && (
                      <p className="mt-4">
                        <CaseLink slug={group.evidence.caseSlug} label={group.evidence.label} />
                      </p>
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-20">
          <h2 className="display-2">{t.experience.sections.certifications}</h2>
          <ul className="mt-7 grid gap-5 sm:grid-cols-2">
            {certifications.map((cert) => (
              <li key={cert.id} className="surface flex flex-col p-6">
                <p className="data">{cert.year}</p>
                <h3 className="mt-2 text-lg font-semibold leading-tight">{cert.title}</h3>
                <p className="mt-1.5 text-sm font-medium text-[var(--fg-muted)]">{cert.issuer}</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
                  {cert.description}
                </p>
                {/* El enlace solo aparece si hay credencial pública. */}
                {cert.verifyUrl && (
                  <VerifyLink href={cert.verifyUrl} label={t.experience.verifyCredential} />
                )}
              </li>
            ))}
          </ul>

          <div className="note measure mt-8">
            <div>
              <h3 className="text-sm font-semibold text-[var(--fg)]">
                {t.experience.references.title}
              </h3>
              <p className="mt-2">{t.experience.references.text}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
