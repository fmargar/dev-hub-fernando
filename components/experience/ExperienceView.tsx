"use client";

import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { useI18n } from "@/i18n";
import { resolveContentLocale } from "@/content/cases";
import { getCertifications, getExperience, getSkills, profile } from "@/content/profile";
import type { ExperienceEntry } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

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

function TimelineList({ entries }: { entries: ExperienceEntry[] }) {
  const { t } = useI18n();
  const formatRange = useDateRange();

  return (
    <ol className="border-t border-[var(--rule)]">
      {entries.map((entry) => (
        <li key={entry.id} className="border-b border-[var(--rule)] py-8">
          <div className="grid gap-4 md:grid-cols-[11rem_1fr] md:gap-8">
            <p className="font-mono text-xs text-muted-foreground md:pt-1.5">{formatRange(entry)}</p>

            <div className="min-w-0">
              <h3 className="display-3">{entry.role}</h3>
              <p className="mt-1 text-sm text-[var(--primary)]">{entry.company}</p>
              <p className="mt-3 measure text-sm text-muted-foreground">{entry.summary}</p>

              {entry.highlights.length > 0 && (
                <ul className="mt-4 measure space-y-2">
                  {entry.highlights.map((highlight, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="mt-2 h-px w-3 shrink-0 bg-[var(--rule-strong)]" aria-hidden="true" />
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

  return (
    <div className="container-page py-16 md:py-24">
      <header className="measure">
        <h1 className="display-1">{t.experience.title}</h1>
        <p className="body-copy mt-6">{t.experience.intro}</p>
        <a href={profile.cv} download className="btn btn-secondary mt-8">
          <Download className="h-4 w-4" />
          {t.experience.downloadCv}
        </a>
      </header>

      <section className="mt-20">
        <h2 className="eyebrow mb-6">{t.experience.sections.work}</h2>
        <TimelineList entries={work} />
      </section>

      <section className="mt-20">
        <h2 className="eyebrow mb-6">{t.experience.sections.education}</h2>
        <TimelineList entries={education} />
      </section>

      <section className="mt-20">
        <h2 className="eyebrow mb-6">{t.experience.sections.skills}</h2>
        <Reveal>
          <dl className="border-t border-[var(--rule)]">
            {skills.map((group) => (
              <div key={group.id} className="border-b border-[var(--rule)] py-7">
                <div className="grid gap-4 md:grid-cols-[11rem_1fr] md:gap-8">
                  <dt className="text-sm font-medium">{group.label}</dt>
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
        </Reveal>
      </section>

      <section className="mt-20">
        <h2 className="eyebrow mb-6">{t.experience.sections.certifications}</h2>
        <ul className="grid border-t border-[var(--rule)] sm:grid-cols-2">
          {certifications.map((cert) => (
            <li key={cert.id} className="border-b border-[var(--rule)] py-6 sm:px-6 sm:first:pl-0 sm:[&:nth-child(2n+1)]:pl-0">
              <p className="font-mono text-xs text-muted-foreground">{cert.year}</p>
              <h3 className="display-3 mt-2 text-lg">{cert.title}</h3>
              <p className="mt-1 text-sm text-[var(--primary)]">{cert.issuer}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cert.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
