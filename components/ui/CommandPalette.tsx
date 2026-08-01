"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n, Locale } from "@/i18n";
import { useTheme } from "next-themes";
import { getCases } from "@/content/cases";
import { profile } from "@/content/profile";

interface Action {
  id: string;
  title: string;
  hint?: string;
  category: string;
  run: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [rawActiveIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const actions: Action[] = useMemo(() => {
    const go = (href: string) => () => {
      router.push(href);
      close();
    };
    const nav: Action[] = [
      { id: "nav-home", title: t.nav.home, category: t.nav.home, run: go("/") },
      { id: "nav-work", title: t.nav.work, category: t.nav.home, run: go("/work") },
      { id: "nav-experience", title: t.nav.experience, category: t.nav.home, run: go("/experience") },
      { id: "nav-stack", title: t.nav.stack, category: t.nav.home, run: go("/stack") },
      { id: "nav-tools", title: t.nav.tools, category: t.nav.home, run: go("/tools") },
      { id: "nav-contact", title: t.nav.contact, category: t.nav.home, run: go("/contact") },
    ];

    const cases: Action[] = getCases(locale).map((c) => ({
      id: `case-${c.slug}`,
      title: c.title,
      hint: c.client,
      category: t.work.title,
      run: go(`/work/${c.slug}`),
    }));

    const current = theme === "system" ? resolvedTheme : theme;
    const settings: Action[] = [
      {
        id: "cv",
        title: t.experience.downloadCv,
        category: t.nav.language,
        run: () => {
          window.open(profile.cv, "_blank", "noopener");
          close();
        },
      },
      { id: "lang-es", title: "Español", category: t.nav.language, run: () => { setLocale("es" as Locale); close(); } },
      { id: "lang-en", title: "English", category: t.nav.language, run: () => { setLocale("en" as Locale); close(); } },
      { id: "lang-de", title: "Deutsch", category: t.nav.language, run: () => { setLocale("de" as Locale); close(); } },
      {
        id: "theme",
        title: t.nav.toggleTheme,
        category: t.nav.language,
        run: () => {
          setTheme(current === "dark" ? "light" : "dark");
          close();
        },
      },
    ];

    return [...nav, ...cases, ...settings];
  }, [router, close, t, locale, setLocale, theme, resolvedTheme, setTheme]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.hint?.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
    );
  }, [actions, query]);

  // Abrir con ⌘K / Ctrl+K desde cualquier sitio.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // El índice se recorta al renderizar en lugar de corregirse en un efecto: al
  // filtrar, la lista se acorta y el índice guardado puede quedar fuera.
  const activeIndex = Math.min(rawActiveIndex, Math.max(results.length - 1, 0));

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(results.length ? (activeIndex + 1) % results.length : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(results.length ? (activeIndex - 1 + results.length) % results.length : 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[activeIndex]?.run();
    }
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={close}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.skipToContent}
        className="absolute left-1/2 top-[12%] -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg rounded-lg border border-[var(--rule)] bg-[var(--popover)] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 border-b border-[var(--rule)]">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            aria-label={t.nav.skipToContent}
            aria-activedescendant={results[activeIndex] ? `cmd-${results[activeIndex].id}` : undefined}
            className="flex-1 h-12 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
            placeholder="…"
          />
          <kbd className="hidden sm:inline font-mono text-micro text-muted-foreground border border-[var(--rule)] rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        <ul ref={listRef} role="listbox" className="max-h-80 overflow-y-auto py-1">
          {results.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-muted-foreground">—</li>
          )}
          {results.map((action, index) => (
            <li key={action.id}>
              <button
                type="button"
                id={`cmd-${action.id}`}
                data-index={index}
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={action.run}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  index === activeIndex ? "bg-[var(--surface-subtle)]" : ""
                }`}
              >
                <span className="flex-1 min-w-0">
                  <span className="block truncate">{action.title}</span>
                  {action.hint && (
                    <span className="block truncate text-xs text-muted-foreground">{action.hint}</span>
                  )}
                </span>
                <span className="eyebrow shrink-0">{action.category}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
