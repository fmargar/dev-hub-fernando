"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Check, Menu, X, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { useI18n, Locale } from "@/i18n";
import { profile } from "@/content/profile";
import { Icon, useHoverIcon } from "@/components/ui/hover-icon";
import MoonIcon from "@/icons/moon-icon";
import WorldIcon from "@/icons/world-icon";
import MagnifierIcon from "@/icons/magnifier-icon";

const LANGUAGES: { code: Locale; flag: string; name: string }[] = [
  { code: "es", flag: "/bandera-spain.svg", name: "Español" },
  { code: "en", flag: "/bandera-uk.svg", name: "English" },
  { code: "de", flag: "/bandera-germany.svg", name: "Deutsch" },
];

function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [globeRef, globeHover] = useHoverIcon();
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
        {...globeHover}
        className="btn btn-ghost h-9 min-h-0 gap-1.5 px-2.5 text-sm"
      >
        <Icon>
          <WorldIcon ref={globeRef} size={17} strokeWidth={1.75} />
        </Icon>
        <span className="uppercase">{current.code}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.nav.language}
          className="surface absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden p-1"
          style={{ boxShadow: "var(--shadow-lg)" }}
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
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-[var(--surface-2)]"
              >
                <Image src={lang.flag} alt="" width={16} height={16} />
                <span className="flex-1">{lang.name}</span>
                {locale === lang.code && (
                  <Check className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                )}
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
  const [moonRef, moonHover] = useHoverIcon();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={t.nav.toggleTheme}
      {...moonHover}
      className="btn btn-ghost h-9 min-h-0 w-9 px-0"
    >
      {isDark ? (
        <Sun className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
      ) : (
        <Icon>
          <MoonIcon ref={moonRef} size={17} strokeWidth={1.75} />
        </Icon>
      )}
    </button>
  );
}

/** Abre la paleta de comandos disparando el mismo atajo que la registra. */
function SearchButton() {
  const { t } = useI18n();
  const [glassRef, glassHover] = useHoverIcon();

  const open = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
    );
  };

  return (
    <button
      type="button"
      onClick={open}
      aria-label={t.nav.search}
      {...glassHover}
      className="btn btn-secondary hidden h-9 min-h-0 gap-2 px-2.5 text-sm text-[var(--fg-muted)] sm:inline-flex"
    >
      <Icon>
        <MagnifierIcon ref={glassRef} size={15} strokeWidth={1.75} />
      </Icon>
      <span className="kbd border-b">⌘K</span>
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
    <header className="glass sticky top-0 z-40 w-full border-b border-[var(--line)]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-[var(--surface)] focus:px-3 focus:py-2 focus:text-sm focus:shadow-[var(--shadow-md)]"
      >
        {t.nav.skipToContent}
      </a>

      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-[0.9375rem] font-semibold tracking-tight">
          {profile.shortName}
          <span className="text-[var(--accent)]">.</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-0.5 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive(link.href)
                  ? "text-[var(--accent)]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchButton />
          <div className="hidden items-center gap-0.5 md:flex">
            <LanguageSelector />
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            className="btn btn-ghost h-9 min-h-0 w-9 px-0 md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-[var(--line)] bg-[var(--bg)] md:hidden">
          <nav aria-label="Principal" className="container-page flex flex-col py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`border-b border-[var(--line)] py-3 text-base last:border-b-0 ${
                  isActive(link.href) ? "text-[var(--accent)]" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="container-page flex items-center justify-between pb-4">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
