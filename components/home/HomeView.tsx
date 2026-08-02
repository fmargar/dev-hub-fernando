"use client";

import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { useI18n } from "@/i18n";
import { getCasesByTrack, resolveContentLocale } from "@/content/cases";
import { getExperience, getSkills, profile } from "@/content/profile";
import { WorkIndexGroup } from "@/components/work/WorkIndexList";

export function HomeView() {
  const { t, locale } = useI18n();
  const contentLocale = resolveContentLocale(locale);
  const skills = getSkills(contentLocale);

  const { professional, personal } = getCasesByTrack(locale);
  const featuredProfessional = professional.filter((c) => c.featured);
  const featuredPersonal = personal.filter((c) => c.featured);

  const current = getExperience(contentLocale).find((e) => e.end === null);

  const facts = [
    current && { label: t.home.facts.role, value: `${current.role} · ${current.company}` },
    { label: t.home.facts.location, value: profile.location },
    { label: t.home.facts.languages, value: t.home.facts.languagesValue },
    { label: t.home.facts.focus, value: t.home.specialties },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      {/* ── El frente del cajón ───────────────────────────────────────────── */}
      <section className="drawer-front">
        <div className="container-page py-9 md:py-12">
          <div className="flex flex-wrap items-center gap-5">
            <span className="drawer-pull" aria-hidden="true" />
            <span className="drawer-plate">{t.home.drawerLabel}</span>
          </div>

          <h1 className="display-1 mt-8 max-w-[19ch]">
            {t.home.headline} {t.home.headlineAccent}.
          </h1>
          <p className="lead mt-6 measure text-[var(--muted-foreground)]">{t.home.intro}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/work" className="btn btn-primary">
              {t.home.ctaWork}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={profile.cv} download className="btn btn-secondary">
              <Download className="h-4 w-4" />
              {t.home.ctaCv}
            </a>
          </div>

          {/* La chapa atornillada al frente: quién firma este cajón. */}
          <dl className="mt-11 grid gap-x-10 gap-y-5 border-t border-[var(--border)] pt-7 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="typed-on-steel uppercase">{fact.label}</dt>
                <dd className="mt-1.5 text-sm leading-snug">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Las fichas ───────────────────────────────────────────────────── */}
      <section className="container-page section">
        <WorkIndexGroup
          label={t.work.groups.professional}
          note={t.work.groups.professionalNote}
          cases={featuredProfessional}
          lead
        />
        <WorkIndexGroup
          label={t.work.groups.personal}
          note={t.work.groups.personalNote}
          cases={featuredPersonal}
        />

        <p className="mt-9">
          <Link href="/work" className="link-quiet inline-flex items-center gap-1.5 text-sm">
            {t.home.workAll}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </section>

      {/* ── Quién firma ──────────────────────────────────────────────────── */}
      <section className="container-page pb-[var(--space-section)]">
        <div className="file">
          <div className="file-head">
            <span className="file-ref">{t.home.aboutRef}</span>
          </div>
          <div className="file-body grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="display-2 measure">{t.home.aboutHeading}</h2>
              <div className="body-copy mt-5 measure text-[var(--ink-soft)]">
                {t.home.about.map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-7">
                <Link
                  href="/experience"
                  className="link-quiet inline-flex items-center gap-1.5 text-sm"
                >
                  {t.nav.experience}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </p>
            </div>

            <div>
              <h3 className="typed uppercase">{t.home.stackHeading}</h3>
              <dl className="mt-3 border-t border-[var(--card-rule)]">
                {skills.map((group) => (
                  <div key={group.id} className="border-b border-[var(--card-rule)] py-4">
                    <dt className="text-sm font-semibold">{group.label}</dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {group.items.slice(0, 6).map((item) => (
                        <span key={item} className="tag">
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5">
                <Link href="/stack" className="link-quiet inline-flex items-center gap-1.5 text-sm">
                  {t.home.stackAll}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </p>
            </div>
          </div>
          <span className="file-hole" aria-hidden="true" />
        </div>
      </section>

      {/* ── El cajón de al lado ──────────────────────────────────────────── */}
      <section className="container-page pb-[var(--space-section)]">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="file">
            <div className="file-head">
              <span className="file-ref">{t.home.labRef}</span>
            </div>
            <div className="file-body">
              <h2 className="display-3">{t.home.labHeading}</h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                {t.home.labIntro}
              </p>
              <Link href="/tools" className="btn btn-secondary mt-6">
                {t.home.labCta}
              </Link>
            </div>
          </div>

          <div className="file">
            <div className="file-head">
              <span className="file-ref">{t.home.contactRef}</span>
            </div>
            <div className="file-body">
              <h2 className="display-3">{t.home.contactHeading}</h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                {t.home.contactIntro}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link href="/contact" className="btn btn-primary">
                  {t.home.contactCta}
                </Link>
                <a href={`mailto:${profile.email}`} className="link-quiet break-all text-sm">
                  {profile.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
