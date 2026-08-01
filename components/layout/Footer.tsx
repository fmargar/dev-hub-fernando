"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { profile } from "@/content/profile";

export function Footer() {
  const { t } = useI18n();

  const sections = [
    { href: "/work", label: t.nav.work },
    { href: "/experience", label: t.nav.experience },
    { href: "/stack", label: t.nav.stack },
    { href: "/tools", label: t.nav.tools },
    { href: "/contact", label: t.nav.contact },
  ];

  const elsewhere = [
    { href: profile.github, label: "GitHub" },
    { href: profile.linkedin, label: "LinkedIn" },
    { href: `mailto:${profile.email}`, label: profile.email },
  ];

  return (
    <footer className="border-t border-[var(--rule)] mt-24">
      <div className="container-page py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-lg font-bold tracking-tight">{profile.shortName}</p>
            <p className="mt-2 text-sm text-muted-foreground measure-tight">{t.footer.role}</p>
            <p className="mt-4 text-xs text-muted-foreground/70">{t.footer.tech}</p>
          </div>

          <nav aria-label={t.footer.sections}>
            <h2 className="eyebrow">{t.footer.sections}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {sections.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow">{t.footer.elsewhere}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {elsewhere.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
                    className="text-muted-foreground hover:text-foreground transition-colors break-all"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 pt-6 border-t border-[var(--rule)] text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} {profile.name}. {t.footer.rights}.
        </p>
      </div>
    </footer>
  );
}
