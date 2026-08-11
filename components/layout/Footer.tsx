"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { profile } from "@/content/profile";
import { Icon, useHoverIcon } from "@/components/ui/hover-icon";
import { useLocalizedHref } from "@/lib/locale-paths";
import { QualityControl } from "@/components/space/QualityControl";
import GithubIcon from "@/icons/github-icon";
import LinkedinIcon from "@/icons/linkedin-icon";
import MailFilledIcon from "@/icons/mail-filled-icon";

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const external = !href.startsWith("mailto:");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="link-quiet inline-flex items-center gap-2 text-sm"
    >
      {children}
      <span>{label}</span>
    </a>
  );
}

export function Footer() {
  const { t } = useI18n();
  const toLocale = useLocalizedHref();
  const [ghRef, ghHover] = useHoverIcon();
  const [liRef, liHover] = useHoverIcon();
  const [mailRef, mailHover] = useHoverIcon();

  const sections = [
    { href: "/work", label: t.nav.work },
    { href: "/experience", label: t.nav.experience },
    { href: "/stack", label: t.nav.stack },
    { href: "/tools", label: t.nav.tools },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--bg-subtle)]">
      <div className="container-page py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-[0.9375rem] font-semibold tracking-tight">
              {profile.name}
              <span className="text-[var(--accent)]">.</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--fg-muted)]">
              {t.footer.role}
            </p>
            <p className="data mt-5">{t.footer.tech}</p>
          </div>

          <nav aria-label={t.footer.sections}>
            <h2 className="text-sm font-semibold">{t.footer.sections}</h2>
            <ul className="mt-3.5 space-y-2.5">
              {sections.map((item) => (
                <li key={item.href}>
                  <Link href={toLocale(item.href)} className="link-quiet text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold">{t.footer.elsewhere}</h2>
            <ul className="mt-3.5 space-y-2.5">
              <li {...ghHover}>
                <SocialLink href={profile.github} label="GitHub">
                  <Icon>
                    <GithubIcon ref={ghRef} size={16} strokeWidth={1.75} />
                  </Icon>
                </SocialLink>
              </li>
              <li {...liHover}>
                <SocialLink href={profile.linkedin} label="LinkedIn">
                  <Icon>
                    <LinkedinIcon ref={liRef} size={16} strokeWidth={1.75} />
                  </Icon>
                </SocialLink>
              </li>
              <li {...mailHover} className="break-all">
                <SocialLink href={`mailto:${profile.email}`} label={profile.email}>
                  <Icon>
                    <MailFilledIcon ref={mailRef} size={16} strokeWidth={1.75} />
                  </Icon>
                </SocialLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
          <p className="data">
            © {new Date().getFullYear()} {profile.name}. {t.footer.rights}.
          </p>
          <QualityControl />
        </div>
      </div>
    </footer>
  );
}
