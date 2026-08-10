"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { getCasesByTrack, resolveContentLocale } from "@/content/cases";
import { getExperience, getSkills, profile } from "@/content/profile";
import { WorkIndexGroup } from "@/components/work/WorkIndexList";
import { Icon, useHoverIcon } from "@/components/ui/hover-icon";
import ArrowNarrowRightIcon from "@/icons/arrow-narrow-right-icon";
import DownloadIcon from "@/icons/download-icon";
import TerminalIcon from "@/icons/terminal-icon";
import SendHorizontalIcon from "@/icons/send-horizontal-icon";

/** Enlace de texto con la flecha animada. Se repite lo justo para tener nombre. */
function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [arrowRef, arrowHover] = useHoverIcon();

  return (
    <Link href={href} {...arrowHover} className="action text-sm">
      {children}
      <Icon>
        <ArrowNarrowRightIcon ref={arrowRef} size={16} strokeWidth={1.75} />
      </Icon>
    </Link>
  );
}

function Hero() {
  const { t, locale } = useI18n();
  const contentLocale = resolveContentLocale(locale);
  const [arrowRef, arrowHover] = useHoverIcon();
  const [downloadRef, downloadHover] = useHoverIcon();

  const current = getExperience(contentLocale).find((e) => e.end === null);

  const facts = [
    current && { label: t.home.facts.role, value: `${current.role} · ${current.company}` },
    { label: t.home.facts.location, value: profile.location },
    { label: t.home.facts.languages, value: t.home.facts.languagesValue },
    { label: t.home.facts.focus, value: t.home.specialties },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section className="hero-field">
      <div className="container-page pb-16 pt-20 md:pb-24 md:pt-32">
        <h1 className="display-1 max-w-[16ch]">
          {t.home.headline} <span className="text-[var(--accent)]">{t.home.headlineAccent}</span>.
        </h1>
        <p className="lead measure mt-7">{t.home.intro}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/work" {...arrowHover} className="btn btn-primary">
            {t.home.ctaWork}
            <Icon>
              <ArrowNarrowRightIcon ref={arrowRef} size={17} strokeWidth={1.75} />
            </Icon>
          </Link>
          <a href={profile.cv} download {...downloadHover} className="btn btn-secondary">
            <Icon>
              <DownloadIcon ref={downloadRef} size={17} strokeWidth={1.75} />
            </Icon>
            {t.home.ctaCv}
          </a>
        </div>

        {/* Fila de datos, no de cifras: dice quién es y desde dónde trabaja. */}
        <dl className="mt-16 grid gap-x-10 gap-y-6 border-t border-[var(--line)] pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="data">{fact.label}</dt>
              <dd className="mt-1.5 text-sm leading-snug">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function About() {
  const { t, locale } = useI18n();
  const skills = getSkills(resolveContentLocale(locale));

  return (
    <section className="container-page section-tight">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div>
          <h2 className="display-2 measure">{t.home.aboutHeading}</h2>
          <div className="body-copy measure mt-6">
            {t.home.about.map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-8">
            <ArrowLink href="/experience">{t.nav.experience}</ArrowLink>
          </p>
        </div>

        <div className="lg:pt-2">
          <h3 className="text-sm font-semibold">{t.home.stackHeading}</h3>
          <dl className="mt-4 border-t border-[var(--line)]">
            {skills.map((group) => (
              <div key={group.id} className="border-b border-[var(--line)] py-4">
                <dt className="text-sm font-medium">{group.label}</dt>
                <dd className="mt-2.5 flex flex-wrap gap-1.5">
                  {group.items.slice(0, 6).map((item) => (
                    <span key={item.id} className="chip">
                      {item.label}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5">
            <ArrowLink href="/stack">{t.home.stackAll}</ArrowLink>
          </p>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  const { t } = useI18n();
  const [terminalRef, terminalHover] = useHoverIcon();
  const [sendRef, sendHover] = useHoverIcon();

  return (
    <section className="container-page pb-[var(--space-section)]">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* El laboratorio es la pieza menor: fondo plano y sin sombra. */}
        <div className="surface-flat p-7 md:p-9">
          <Icon className="text-[var(--fg-subtle)]">
            <TerminalIcon ref={terminalRef} size={22} strokeWidth={1.75} />
          </Icon>
          <h2 className="display-3 mt-4">{t.home.labHeading}</h2>
          <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
            {t.home.labIntro}
          </p>
          <Link
            href="/tools"
            {...terminalHover}
            className="btn btn-secondary mt-7 h-10 min-h-0 text-sm"
          >
            {t.home.labCta}
          </Link>
        </div>

        <div className="surface p-7 md:p-9">
          <h2 className="display-2">{t.home.contactHeading}</h2>
          <p className="measure mt-3.5 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
            {t.home.contactIntro}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/contact" {...sendHover} className="btn btn-primary">
              {t.home.contactCta}
              <Icon>
                <SendHorizontalIcon ref={sendRef} size={17} strokeWidth={1.75} />
              </Icon>
            </Link>
            <a href={`mailto:${profile.email}`} className="link break-all text-sm">
              {profile.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeView() {
  const { t, locale } = useI18n();
  const { professional, personal } = getCasesByTrack(locale);

  return (
    <>
      <Hero />

      <div className="container-page section-tight">
        {/* Sin aparición al hacer scroll: la obra es lo que tiene que mandar y
            no puede empezar invisible esperando a un observador. */}
        <WorkIndexGroup
          label={t.work.groups.professional}
          note={t.work.groups.professionalNote}
          cases={professional.filter((c) => c.featured)}
          lead
        />
        <WorkIndexGroup
          label={t.work.groups.personal}
          note={t.work.groups.personalNote}
          cases={personal.filter((c) => c.featured)}
        />

        <p className="mt-10">
          <ArrowLink href="/work">{t.home.workAll}</ArrowLink>
        </p>
      </div>

      <About />
      <Closing />
    </>
  );
}
