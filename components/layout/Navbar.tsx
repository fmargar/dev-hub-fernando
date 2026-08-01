"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { useI18n, Locale } from "@/i18n";

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
        className="flex items-center gap-2 h-9 px-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-[var(--surface-subtle)] transition-colors"
      >
        <Image src={current.flag} alt="" width={18} height={18} className="rounded-[2px]" />
        <span className="hidden lg:inline font-mono text-xs uppercase">{current.code}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.nav.language}
          className="absolute right-0 top-full mt-2 w-44 rounded-md border border-[var(--rule)] bg-[var(--popover)] shadow-lg overflow-hidden z-50"
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
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-left hover:bg-[var(--surface-subtle)] transition-colors"
              >
                <Image src={lang.flag} alt="" width={18} height={18} className="rounded-[2px]" />
                <span className="flex-1">{lang.name}</span>
                {locale === lang.code && <Check className="h-3.5 w-3.5 text-[var(--accent-text)]" />}
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

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={t.nav.toggleTheme}
      className="flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-[var(--surface-subtle)] transition-colors"
    >
      {/* Qué icono toca depende del tema, que en servidor todavía no se conoce.
          Se pintan los dos y decide CSS, para no depender de un efecto de
          montaje ni arriesgar un desajuste de hidratación. */}
      <Moon className="h-4 w-4 dark:hidden" />
      <Sun className="hidden h-4 w-4 dark:block" />
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
    <header className="sticky top-0 z-40 w-full border-b border-[var(--rule)] bg-[var(--background)]/85 backdrop-blur-md">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-[var(--background)] focus:px-3 focus:py-2 focus:text-sm focus:shadow-md"
      >
        {t.nav.skipToContent}
      </a>

      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight hover:text-[var(--accent-text)] transition-colors"
        >
          Fernando Martínez
        </Link>

        <nav aria-label="Principal" className="hidden md:flex items-center gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive(link.href)
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-[var(--surface-subtle)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
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
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-md hover:bg-[var(--surface-subtle)] transition-colors"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-[var(--rule)] bg-[var(--background)]">
          <nav aria-label="Principal" className="container-page py-3 flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`py-3 border-b border-[var(--rule)] last:border-b-0 text-base ${
                  isActive(link.href) ? "text-foreground font-medium" : "text-muted-foreground"
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
