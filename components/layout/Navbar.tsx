"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Check, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { useI18n, Locale } from "@/i18n";
import { profile } from "@/content/profile";

const LANGUAGES: { code: Locale; flag: string; name: string }[] = [
  { code: "es", flag: "/bandera-spain.svg", name: "Español" },
  { code: "en", flag: "/bandera-uk.svg", name: "English" },
  { code: "de", flag: "/bandera-germany.svg", name: "Deutsch" },
];

function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.nav.language}
        className="typed-on-steel flex items-center gap-2 px-2 py-1.5 hover:text-[var(--brass)] transition-colors"
      >
        <Image src={current.flag} alt="" width={16} height={16} />
        <span className="uppercase">{current.code}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.nav.language}
          className="file absolute right-0 top-full mt-2 w-44 overflow-hidden z-50"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={locale === lang.code}
                onClick={() => {
                  setLocale(lang.code);
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-left hover:bg-[#e5dbc4] transition-colors"
              >
                <Image src={lang.flag} alt="" width={16} height={16} />
                <span className="flex-1">{lang.name}</span>
                {locale === lang.code && <Check className="h-3.5 w-3.5" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  const onDesk = resolvedTheme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(onDesk ? "dark" : "light")}
      aria-label={t.nav.toggleTheme}
      className="typed-on-steel px-2 py-1.5 hover:text-[var(--brass)] transition-colors"
    >
      {/* En un archivo el estado se rotula, no se dibuja con un icono. */}
      {onDesk ? "MESA" : "CAJÓN"}
    </button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/work", label: t.nav.work },
    { href: "/experience", label: t.nav.experience },
    { href: "/stack", label: t.nav.stack },
    { href: "/tools", label: t.nav.tools },
    { href: "/contact", label: t.nav.contact },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--background)]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-[var(--card)] focus:text-[var(--ink)] focus:px-3 focus:py-2 focus:text-sm"
      >
        {t.nav.skipToContent}
      </a>

      <div className="container-page">
        <div className="flex items-end justify-between gap-4 pt-4">
          <Link
            href="/"
            className="pb-2 font-semibold text-[var(--brass)] hover:opacity-80 transition-opacity"
            style={{ letterSpacing: "0.09em" }}
          >
            {profile.shortName.toUpperCase()}
          </Link>

          {/* Las pestañas de separador son la navegación del cajón. */}
          <nav aria-label="Principal" className="tab-strip hidden md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="tab"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 pb-1.5">
            <div className="hidden md:flex items-center gap-1">
              <LanguageSelector />
              <ThemeToggle />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
              className="md:hidden flex items-center justify-center h-9 w-9"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-[var(--border)]">
          <nav aria-label="Principal" className="container-page py-2 flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`py-3 border-b border-[var(--border)] last:border-b-0 text-base ${
                  isActive(link.href) ? "text-[var(--brass)]" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="container-page pb-4 flex items-center justify-between">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
