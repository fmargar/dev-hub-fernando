"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { useI18n } from "@/i18n";
import { getFeaturedCases } from "@/content/cases";
import { getExperience, getSkills, profile } from "@/content/profile";
import { resolveContentLocale } from "@/content/cases";
import { WorkIndexList } from "@/components/work/WorkIndexList";
import { Reveal } from "@/components/ui/Reveal";

export function HomeView() {
  const { t, locale } = useI18n();
  const contentLocale = resolveContentLocale(locale);
  const featured = getFeaturedCases(locale);
  const skills = getSkills(contentLocale);

  // El puesto "ahora" es la primera entrada de trayectoria sin fecha de fin.
  const current = getExperience(contentLocale).find((e) => e.end === null);
  const currentYear = current ? new Date(current.start).getFullYear() : null;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="container-page pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="measure">
          <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <span className="status-dot" aria-hidden="true" />
            {t.home.availability}
          </p>

          <h1 className="display-1 mt-6">{profile.shortName}</h1>

          <p className="mt-4 text-xl md:text-2xl text-muted-foreground">
            {t.home.role}
            <span className="mx-2 text-[var(--rule-strong)]">/</span>
            <span className="font-mono text-base md:text-lg">{t.home.specialties}</span>
          </p>

          <p className="body-copy mt-8">{t.home.intro}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/work" className="btn btn-primary">
              {t.home.ctaWork}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={profile.cv} download className="btn btn-secondary">
              <Download className="h-4 w-4" />
              {t.home.ctaCv}
            </a>
          </div>
        </div>
      </section>

      {/* ── Ahora ────────────────────────────────────────────────────────── */}
      {current && (
        <section className="border-y border-[var(--rule)] bg-[var(--surface-subtle)]">
          <div className="container-page py-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
              <span className="eyebrow sm:w-20 sm:shrink-0">{t.home.nowLabel}</span>
              <p className="text-sm">
                <span className="font-medium">{current.role}</span>
                <span className="text-muted-foreground"> · {current.company}</span>
                {currentYear && (
                  <span className="text-muted-foreground">
                    {" "}
                    ({t.home.nowSince} {currentYear})
                  </span>
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Trabajo seleccionado ─────────────────────────────────────────── */}
      <section className="container-page py-20 md:py-28">
        <Reveal>
          <p className="eyebrow">{t.home.workEyebrow}</p>
          <h2 className="display-2 mt-3">{t.home.workHeading}</h2>
          <p className="mt-4 measure text-muted-foreground">{t.home.workIntro}</p>
        </Reveal>

        <WorkIndexList cases={featured} />

        <div className="mt-10">
          <Link href="/work" className="link-quiet inline-flex items-center gap-1.5 text-sm">
            {t.home.workAll}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ── Sobre mí ─────────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--rule)]">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
            <div>
              <p className="eyebrow">{t.home.aboutEyebrow}</p>
            </div>
            <Reveal>
              <h2 className="display-2 measure">{t.home.aboutHeading}</h2>
              <div className="body-copy mt-6 measure">
                {t.home.about.map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/experience" className="link-quiet inline-flex items-center gap-1.5 text-sm">
                  {t.nav.experience}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Stack ────────────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--rule)]">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
            <div>
              <p className="eyebrow">{t.home.stackEyebrow}</p>
              <h2 className="display-3 mt-3">{t.home.stackHeading}</h2>
            </div>

            <Reveal>
              <dl className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
                {skills.map((group) => (
                  <div key={group.id} className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                    <dt className="text-sm font-medium">{group.label}</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span key={item} className="tag">
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8">
                <Link href="/stack" className="link-quiet inline-flex items-center gap-1.5 text-sm">
                  {t.home.stackAll}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Laboratorio ──────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--rule)]">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
            <div>
              <p className="eyebrow">{t.home.labEyebrow}</p>
            </div>
            <Reveal>
              <h2 className="display-2 measure">{t.home.labHeading}</h2>
              <p className="body-copy mt-6 measure">{t.home.labIntro}</p>
              <div className="mt-8">
                <Link href="/tools" className="btn btn-secondary">
                  {t.home.labCta}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Contacto ─────────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--rule)]">
        <div className="container-page py-20 md:py-28">
          <Reveal className="measure">
            <h2 className="display-2">{t.home.contactHeading}</h2>
            <p className="body-copy mt-6">{t.home.contactIntro}</p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/contact" className="btn btn-primary">
                {t.home.contactCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={`mailto:${profile.email}`} className="link-quiet text-sm break-all">
                {profile.email}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
