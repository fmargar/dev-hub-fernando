"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { useI18n } from "@/i18n";
import { getCaseNumbers, getCasesByTrack, resolveContentLocale } from "@/content/cases";
import { getExperience, getSkills, profile } from "@/content/profile";
import { WorkIndexGroup } from "@/components/work/WorkIndexList";
import { Reveal } from "@/components/ui/Reveal";

export function HomeView() {
  const { t, locale } = useI18n();
  const contentLocale = resolveContentLocale(locale);
  const skills = getSkills(contentLocale);
  const numbers = getCaseNumbers(locale);

  const { professional, personal } = getCasesByTrack(locale);
  const featuredProfessional = professional.filter((c) => c.featured);
  const featuredPersonal = personal.filter((c) => c.featured);

  // El puesto actual es la primera entrada de trayectoria sin fecha de fin.
  const current = getExperience(contentLocale).find((e) => e.end === null);

  const facts = [
    current && { label: t.home.facts.role, value: `${current.role} · ${current.company}` },
    { label: t.home.facts.location, value: profile.location },
    { label: t.home.facts.languages, value: t.home.facts.languagesValue },
    { label: t.home.facts.focus, value: t.home.specialties },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      {/* ── Hero: titular a la izquierda y ficha de datos a la derecha, para
             que en escritorio no quede media pantalla vacía ───────────────── */}
      <section className="container-page pt-16 pb-16 md:pt-24 md:pb-24">
        <div className="page-grid items-end">
          <div className="col-wide">
            <h1 className="display-1">{profile.shortName}</h1>
            <p className="mt-5 text-xl md:text-2xl text-muted-foreground">{t.home.role}</p>
            <p className="lead mt-7 measure">{t.home.intro}</p>

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
          </div>

          <aside className="col-side">
            <dl className="border-t border-[var(--rule)]">
              {facts.map((fact) => (
                <div key={fact.label} className="border-b border-[var(--rule)] py-3.5">
                  <dt className="eyebrow">{fact.label}</dt>
                  <dd className="mt-1.5 text-sm leading-snug">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a href={profile.github} target="_blank" rel="noreferrer" className="link-quiet">
                GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="link-quiet">
                LinkedIn
              </a>
              <a href={`mailto:${profile.email}`} className="link-quiet">
                Email
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Trabajo seleccionado ─────────────────────────────────────────── */}
      <section className="container-page section border-t border-[var(--rule)]">
        <Reveal>
          <div className="page-grid">
            <div className="rail">
              <p className="eyebrow">{t.home.workEyebrow}</p>
            </div>
            <div className="rail-body">
              <h2 className="display-2">{t.home.workHeading}</h2>
              <p className="lead mt-4 measure text-muted-foreground">{t.home.workIntro}</p>
            </div>
          </div>
        </Reveal>

        <div className="mt-14">
          <WorkIndexGroup
            label={t.work.groups.professional}
            note={t.work.groups.professionalNote}
            cases={featuredProfessional}
            numbers={numbers}
          />
          <WorkIndexGroup
            label={t.work.groups.personal}
            note={t.work.groups.personalNote}
            cases={featuredPersonal}
            numbers={numbers}
          />
        </div>

        <div className="mt-10">
          <Link href="/work" className="link-quiet inline-flex items-center gap-1.5 text-sm">
            {t.home.workAll}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ── Sobre mí ─────────────────────────────────────────────────────── */}
      <section className="container-page section border-t border-[var(--rule)]">
        <div className="page-grid">
          <div className="rail">
            <p className="eyebrow">{t.home.aboutEyebrow}</p>
          </div>
          <Reveal className="rail-body">
            <h2 className="display-2 measure">{t.home.aboutHeading}</h2>
            <div className="body-copy mt-6 measure">
              {t.home.about.map((paragraph: string, i: number) => (
                <p key={i} className={i === 0 ? "lead" : undefined}>
                  {paragraph}
                </p>
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
      </section>

      {/* ── Stack ────────────────────────────────────────────────────────── */}
      <section className="container-page section border-t border-[var(--rule)]">
        <div className="page-grid">
          <div className="rail">
            <p className="eyebrow">{t.home.stackEyebrow}</p>
            <h2 className="display-3 mt-3">{t.home.stackHeading}</h2>
          </div>

          <Reveal className="rail-body">
            <dl className="border-t border-[var(--rule)]">
              {skills.map((group) => (
                <div
                  key={group.id}
                  className="grid gap-2 border-b border-[var(--rule)] py-5 sm:grid-cols-[11rem_1fr] sm:gap-8"
                >
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
      </section>

      {/* ── Laboratorio ──────────────────────────────────────────────────── */}
      <section className="container-page section border-t border-[var(--rule)]">
        <div className="page-grid">
          <div className="rail">
            <p className="eyebrow">{t.home.labEyebrow}</p>
          </div>
          <Reveal className="rail-body">
            <h2 className="display-2 measure">{t.home.labHeading}</h2>
            <p className="lead mt-6 measure text-muted-foreground">{t.home.labIntro}</p>
            <div className="mt-8">
              <Link href="/tools" className="btn btn-secondary">
                {t.home.labCta}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Contacto ─────────────────────────────────────────────────────── */}
      <section className="container-page section border-t border-[var(--rule)]">
        <Reveal>
          <div className="page-grid items-end">
            <div className="col-wide">
              <h2 className="display-2 measure">{t.home.contactHeading}</h2>
              <p className="lead mt-6 measure text-muted-foreground">{t.home.contactIntro}</p>
            </div>
            <div className="col-side">
              <Link href="/contact" className="btn btn-primary w-full">
                {t.home.contactCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="link-quiet mt-4 block break-all text-sm"
              >
                {profile.email}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
