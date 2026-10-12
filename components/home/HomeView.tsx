"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { getCasesByTrack, resolveContentLocale } from "@/content/cases";
import { getExperience, getSkills, profile } from "@/content/profile";
import { WorkIndexGroup } from "@/components/work/WorkIndexList";
import { Icon, useHoverIcon } from "@/components/ui/hover-icon";
import { useLocalizedHref } from "@/lib/locale-paths";
import ArrowNarrowRightIcon from "@/icons/arrow-narrow-right-icon";
import DownloadIcon from "@/icons/download-icon";
import ExternalLinkIcon from "@/icons/external-link-icon";
import GithubIcon from "@/icons/github-icon";
import LinkedinIcon from "@/icons/linkedin-icon";
import MailFilledIcon from "@/icons/mail-filled-icon";

/* Las secciones de la portada llevan ids estables en español en los dos
   idiomas (#proyectos, #experiencia, #habilidades, #contacto): el README de
   GitHub y el CV enlazan aquí. */

/** Enlace de texto con la flecha animada. */
function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [arrowRef, arrowHover] = useHoverIcon();
  const toLocale = useLocalizedHref();

  return (
    <Link href={toLocale(href)} {...arrowHover} className="action text-sm">
      {children}
      <Icon>
        <ArrowNarrowRightIcon ref={arrowRef} size={16} strokeWidth={1.75} />
      </Icon>
    </Link>
  );
}

/**
 * Los cuatro destinos que un reclutador busca en los primeros segundos. El CV
 * manda; el resto son enlaces secundarios del mismo tamaño.
 */
function PrimaryLinks() {
  const { t } = useI18n();
  const [downloadRef, downloadHover] = useHoverIcon();
  const [extRef, extHover] = useHoverIcon();
  const [ghRef, ghHover] = useHoverIcon();
  const [inRef, inHover] = useHoverIcon();

  return (
    <div className="flex flex-wrap gap-2.5">
      <a href={profile.cv} download {...downloadHover} className="btn btn-primary">
        <Icon>
          <DownloadIcon ref={downloadRef} size={17} strokeWidth={1.75} />
        </Icon>
        {t.home.ctaCv}
        <span className="text-[0.8125rem] font-normal opacity-80">{t.home.ctaCvNote}</span>
      </a>
      <a
        href="https://adivinadle.com"
        target="_blank"
        rel="noopener noreferrer"
        {...extHover}
        className="btn btn-secondary"
      >
        {t.home.ctaAdivinadle}
        <Icon>
          <ExternalLinkIcon ref={extRef} size={16} strokeWidth={1.75} />
        </Icon>
      </a>
      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        {...ghHover}
        className="btn btn-secondary"
      >
        <Icon>
          <GithubIcon ref={ghRef} size={17} strokeWidth={1.75} />
        </Icon>
        GitHub
      </a>
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        {...inHover}
        className="btn btn-secondary"
      >
        <Icon>
          <LinkedinIcon ref={inRef} size={17} strokeWidth={1.75} />
        </Icon>
        LinkedIn
      </a>
    </div>
  );
}

/**
 * La pieza que distingue la portada: el flujo del LLM en el ERP, tal como lo
 * vive quien lo usa. Borrador de la IA, quién lo propone, quién lo revisa y el
 * sello de aprobación humana, que entra una sola vez al cargar.
 */
function ApprovalDemo() {
  const { t } = useI18n();
  const d = t.home.demo;

  return (
    <figure className="approval">
      <div className="approval-card" aria-hidden="true">
        <div className="approval-head">
          <span>{d.file}</span>
          <span className="approval-product">{d.product}</span>
        </div>

        <div className="approval-body">
          <span className="approval-badge">{d.draft}</span>
          <p className="approval-text">{d.text}</p>

          <dl className="approval-meta">
            <div>
              <dt>{d.proposedBy}</dt>
              <dd>{d.proposedByValue}</dd>
            </div>
            <div>
              <dt>{d.reviewer}</dt>
              <dd>{d.reviewerValue}</dd>
            </div>
          </dl>

          <div className="approval-actions">
            <span className="approval-btn">{d.reject}</span>
            <span className="approval-btn approval-btn-ok">{d.approve}</span>
          </div>
        </div>

        <span className="approval-stamp">{d.approved}</span>
      </div>
      <figcaption className="approval-caption">{d.caption}</figcaption>
    </figure>
  );
}

function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero-field">
      <div className="container-page grid items-center gap-14 pb-14 pt-14 md:pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:pb-20 lg:pt-24">
        <div>
          <p className="text-sm text-[var(--fg-muted)]">{t.home.location}</p>
          <h1 className="hero-name mt-5">
            {profile.shortName}
            <span className="hero-role">{t.home.role}</span>
          </h1>
          <p className="mt-5 text-[1.0625rem] font-medium">{t.home.tags}</p>
          <p className="lead measure mt-4">{t.home.intro}</p>
          <div className="mt-9">
            <PrimaryLinks />
          </div>
        </div>

        <ApprovalDemo />
      </div>

      {/* Cuatro pruebas, cada una lleva a su proyecto. */}
      <div className="container-page pb-4">
        <ul className="proof">
          {t.home.proof.map((item: { value: string; text: string; href: string }) => (
            <ProofItem key={item.href} {...item} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProofItem({ value, text, href }: { value: string; text: string; href: string }) {
  const toLocale = useLocalizedHref();
  return (
    <li>
      <Link href={toLocale(href)} className="proof-item group">
        <span className="proof-value">{value}</span>
        <span className="proof-text">{text}</span>
      </Link>
    </li>
  );
}

function formatPeriod(start: string, end: string | null, locale: string, present: string) {
  const fmt = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
    month: "short",
    year: "numeric",
  });
  const from = fmt.format(new Date(start));
  return `${from} – ${end ? fmt.format(new Date(end)) : present}`;
}

function Experience() {
  const { t, locale } = useI18n();
  const toLocale = useLocalizedHref();
  const entries = getExperience(resolveContentLocale(locale)).filter((e) => e.kind === "work");

  return (
    <section id="experiencia" className="container-page section-tight scroll-mt-20">
      <h2 className="display-2">{t.home.experienceHeading}</h2>
      <ol className="mt-8 border-t border-[var(--line)]">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="grid gap-x-10 gap-y-3 border-b border-[var(--line)] py-7 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
          >
            <p className="data md:pt-1">
              {formatPeriod(entry.start, entry.end, locale, t.home.present)}
            </p>
            <div className="min-w-0">
              <h3 className="display-3">{entry.role}</h3>
              <p className="mt-1 text-[0.9375rem] text-[var(--fg-muted)]">{entry.company}</p>
              <p className="measure mt-3 text-[0.9375rem] leading-relaxed">{entry.summary}</p>
              {entry.highlights.length > 0 && (
                <ul className="measure mt-3 list-disc space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)] marker:text-[var(--line-strong)]">
                  {entry.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
              {entry.cases?.[0] && (
                <p className="mt-4">
                  <Link href={toLocale(`/work/${entry.cases[0]}`)} className="link text-sm">
                    {t.work.read}
                  </Link>
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-8">
        <ArrowLink href="/experience">{t.home.experienceAll}</ArrowLink>
      </p>
    </section>
  );
}

function Skills() {
  const { t, locale } = useI18n();
  const skills = getSkills(resolveContentLocale(locale));

  return (
    <section id="habilidades" className="container-page section-tight scroll-mt-20">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <h2 className="display-2 measure">{t.home.aboutHeading}</h2>
          <div className="body-copy measure mt-6">
            {t.home.about.map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <h3 className="mt-12 text-sm font-semibold">{t.home.educationHeading}</h3>
          <ul className="mt-4 space-y-3 border-t border-[var(--line)] pt-4 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
            {t.home.education.map((line: string) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t.home.stackHeading}</h3>
          <dl className="mt-4 border-t border-[var(--line)]">
            {skills.map((group) => (
              <div key={group.id} className="border-b border-[var(--line)] py-4">
                <dt className="text-sm font-medium">{group.label}</dt>
                <dd className="mt-2.5 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span key={item.id} className={group.id === "ia" ? "chip chip-accent" : "chip"}>
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

function Contact() {
  const { t } = useI18n();
  const toLocale = useLocalizedHref();
  const [mailRef, mailHover] = useHoverIcon();

  return (
    <section id="contacto" className="container-page scroll-mt-20 pb-[var(--space-section)]">
      <div className="contact-band">
        <div>
          <h2 className="display-2">{t.home.contactHeading}</h2>
          <p className="measure mt-3.5 text-[1.0625rem] leading-relaxed">{t.home.contactIntro}</p>
          <p className="mt-6">
            <a href={`mailto:${profile.email}`} {...mailHover} className="contact-mail">
              <Icon>
                <MailFilledIcon ref={mailRef} size={20} />
              </Icon>
              {profile.email}
            </a>
          </p>
        </div>
        <div className="flex flex-wrap content-end gap-2.5 lg:justify-end">
          <Link href={toLocale("/contact")} className="btn contact-btn">
            {t.home.contactCta}
          </Link>
          <a href={profile.cv} download className="btn contact-btn-ghost">
            {t.home.ctaCv}
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn contact-btn-ghost">
            LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn contact-btn-ghost">
            GitHub
          </a>
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

      <section id="proyectos" className="container-page section-tight scroll-mt-20">
        <h2 className="display-2">{t.home.workHeading}</h2>
        <p className="lead measure mt-4">{t.home.workIntro}</p>
        <div className="mt-6">
          <WorkIndexGroup
            label={t.work.groups.personal}
            note={t.work.groups.personalNote}
            cases={personal.filter((c) => c.featured)}
            lead
          />
          <WorkIndexGroup
            label={t.work.groups.professional}
            note={t.work.groups.professionalNote}
            cases={professional.filter((c) => c.featured)}
          />
        </div>
        <p className="mt-10">
          <ArrowLink href="/work">{t.home.workAll}</ArrowLink>
        </p>
      </section>

      <Experience />
      <Skills />
      <Contact />
    </>
  );
}
