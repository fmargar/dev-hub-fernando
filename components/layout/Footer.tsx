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
    /* El fondo del cajón: lo que queda cuando se sacan todas las fichas. */
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--steel-dark)] text-[var(--on-steel)]">
      <div className="container-page py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-semibold text-[var(--brass)]" style={{ letterSpacing: "0.09em" }}>
              {profile.shortName.toUpperCase()}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--on-steel-soft)]">
              {t.footer.role}
            </p>
            <p className="typed-on-steel mt-5">{t.footer.tech}</p>
          </div>

          <nav aria-label={t.footer.sections}>
            <h2 className="typed-on-steel uppercase">{t.footer.sections}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {sections.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-quiet">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="typed-on-steel uppercase">{t.footer.elsewhere}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {elsewhere.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
                    className="link-quiet break-all"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="typed-on-steel mt-11 border-t border-[var(--border)] pt-6">
          © {new Date().getFullYear()} {profile.name}. {t.footer.rights}.
        </p>
      </div>
    </footer>
  );
}
