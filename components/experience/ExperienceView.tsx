"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { useI18n } from "@/i18n";
import { resolveContentLocale } from "@/content/cases";
import { getCertifications, getExperience, getSkills, profile } from "@/content/profile";
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

/** Cada puesto es una hoja del historial, con su rango de fechas mecanografiado. */
function TimelineList({ entries }: { entries: ExperienceEntry[] }) {
  const { t } = useI18n();
  const formatRange = useDateRange();

  return (
    <ol>
      {entries.map((entry) => (
        <li key={entry.id} className="border-b border-[var(--card-rule)] py-7 last:border-b-0">
          <div className="grid gap-4 md:grid-cols-[11rem_1fr] md:gap-8">
            <p className="typed md:pt-1.5">{formatRange(entry)}</p>

            <div className="min-w-0">
              <h3 className="display-3">{entry.role}</h3>
              <p className="mt-1 text-sm font-bold">{entry.company}</p>
              <p className="mt-3 measure text-sm text-[var(--ink-soft)]">{entry.summary}</p>

              {entry.highlights.length > 0 && (
                <ul className="mt-4 measure space-y-2">
                  {entry.highlights.map((highlight, i) => (
                    <li key={i} className="flex gap-3 text-sm text-[var(--ink-soft)]">
                      <span
                        className="mt-2 h-px w-3 shrink-0 bg-[var(--ink-soft)]"
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
                    <Link
                      key={slug}
                      href={`/work/${slug}`}
                      className="link-quiet inline-flex items-center gap-1.5 text-sm"
                    >
                      {t.experience.relatedCase}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
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
  const entries = getExperience(contentLocale);
  const certifications = getCertifications(contentLocale);
  const skills = getSkills(contentLocale);

  const work = entries.filter((e) => e.kind === "work");
  const education = entries.filter((e) => e.kind === "education");

  const sheets = [
    { id: "work", title: t.experience.sections.work, node: <TimelineList entries={work} /> },
    {
      id: "education",
      title: t.experience.sections.education,
      node: <TimelineList entries={education} />,
    },
  ];

  return (
    <>
      <div className="drawer-front">
        <div className="container-page flex flex-wrap items-center gap-5 py-6">
          <span className="drawer-pull" aria-hidden="true" />
          <span className="drawer-plate">{t.experience.title}</span>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            {t.experience.intro}
          </p>
          <a href={profile.cv} download className="btn btn-secondary ml-auto">
            <Download className="h-4 w-4" />
            {t.experience.downloadCv}
          </a>
        </div>
      </div>

      <div className="container-page section grid gap-8">
        {sheets.map((sheet) => (
          <section key={sheet.id}>
            <h2 className="divider-card">{sheet.title}</h2>
            <div className="file">
              <div className="file-body">{sheet.node}</div>
            </div>
          </section>
        ))}

        <section>
          <h2 className="divider-card">{t.experience.sections.skills}</h2>
          <div className="file">
            <div className="file-body">
              <dl>
                {skills.map((group) => (
                  <div
                    key={group.id}
                    className="border-b border-[var(--card-rule)] py-6 last:border-b-0"
                  >
                    <div className="grid gap-4 md:grid-cols-[11rem_1fr] md:gap-8">
                      <dt className="text-sm font-bold">{group.label}</dt>
                      <dd>
                        <div className="flex flex-wrap gap-1.5">
                          {group.items.map((item) => (
                            <span key={item} className="tag">
                              {item}
                            </span>
                          ))}
                        </div>
                        {group.evidence && (
                          <Link
                            href={`/work/${group.evidence.caseSlug}`}
                            className="link-quiet mt-4 inline-flex items-center gap-1.5 text-sm"
                          >
                            {group.evidence.label}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section>
          <h2 className="divider-card">{t.experience.sections.certifications}</h2>
          <div className="file">
            <div className="file-body">
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {certifications.map((cert) => (
                  <li key={cert.id} className="border-b border-[var(--card-rule)] py-5">
                    <p className="typed">{cert.year}</p>
                    <h3 className="mt-1.5 text-lg font-bold leading-tight">{cert.title}</h3>
                    <p className="mt-1 text-sm font-bold text-[var(--ink-soft)]">{cert.issuer}</p>
                    <p className="mt-2.5 text-sm leading-relaxed text-[var(--ink-soft)]">
                      {cert.description}
                    </p>
                    {/* El enlace solo aparece si hay credencial pública. */}
                    {cert.verifyUrl && (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="link-quiet mt-3 inline-flex items-center gap-1.5 text-sm"
                      >
                        {t.experience.verifyCredential}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>

              <div className="note mt-8 measure">
                <h3 className="text-sm font-bold">{t.experience.references.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {t.experience.references.text}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
