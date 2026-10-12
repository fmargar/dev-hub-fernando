import type { CaseStudy } from "../types";

export const adivinadleEn: CaseStudy = {
  slug: "adivinadle",
  track: "personal",
  order: 4,
  featured: true,
  title: "Adivinadle",
  tagline:
    "Daily games about guessing video game characters: a complete product in production, built by directing AI agents.",
  client: "Own product · adivinadle.com",
  period: "Sep 2026 – present",
  year: "2026–",
  role: "Product, architecture, review and operations",
  summary:
    "Every day there is a secret character in each game and everyone plays the same challenge. I designed it, decided every piece and took it to production by directing AI agents (Claude Code and Codex): they write the code; I bring the product, the architecture, the review and the quality system that lets nothing through without tests.",
  cover: {
    key: "adv-portada",
    alt: "adivinadle.com homepage: a detective's desk with one folder per game",
    caption: "Homepage in production: one folder per game and today's progress",
  },
  stack: [
    "Laravel 13 + Octane",
    "PostgreSQL",
    "Redis",
    "Astro 7",
    "Svelte 5",
    "TypeScript",
    "OpenAPI",
    "Playwright",
    "PHPStan",
    "Docker",
    "Caddy",
  ],
  metrics: [
    { value: "9", label: "games with 4 modes each" },
    { value: "~1,800", label: "characters with curated data" },
    { value: "1.5–1.7 s", label: "LCP measured in CI" },
    { value: "0", label: "CLS: nothing jumps on load" },
  ],
  sections: [
    {
      id: "producto",
      heading: "The product",
      body: [
        "Nine games and four modes: **classic** by attributes, **symbols**, **description** and **silhouette**. The challenge changes at midnight Spanish time and the answer never leaves the API while it is in play: challenges are generated deterministically from a secret seed, and without it the site refuses to start.",
        "It is a Spanish-language, mobile-first site, installable as an app, with a daily reminder through **its own Web Push**, with no external service.",
      ],
      shots: [
        {
          key: "adv-clasico",
          alt: "Adivinadle classic mode with the coloured guess table and the clue board",
          caption: "Classic mode: every guess tells you how close you are",
        },
      ],
    },
    {
      id: "arquitectura",
      heading: "Architecture",
      body: [
        "API on **Laravel 13 with Octane**, PostgreSQL and Redis; web on **Astro 7**, server-rendered with **Svelte 5** islands. Between them sits a versioned **OpenAPI contract** in its own package, with comparator test cases both sides must pass: if the API changes the shape of a response, the web's CI goes red.",
        "Data comes from per-game importers (wikis and public APIs) synced weekly. The loader guards content quality on the way in: for example, no two characters may share more than two of their four symbols, and no symbol may give the name away.",
      ],
    },
    {
      id: "calidad",
      heading: "Quality that does not rely on remembering",
      bullets: [
        {
          term: "Mandatory CI",
          text: "PHPStan at the maximum level and Pest on the API; type checks and Vitest on the web. Nothing reaches production without passing.",
        },
        {
          term: "e2e on mobile and desktop",
          text: "Playwright with accessibility audits (axe) and Lighthouse on every change: LCP of 1.5 to 1.7 s and CLS 0, measured, not estimated.",
        },
        {
          term: "Independent reviews",
          text: "Before launch, another model reviews the product the way a player would and the way an auditor would. Its findings are addressed and written down.",
        },
      ],
      pullQuote:
        "AI generating the code does not make it production-ready: quality comes from the system around it.",
    },
    {
      id: "operacion",
      heading: "Production",
      body: [
        "Self-hosted on my server, behind Cloudflare, with daily backups, security headers, rate limiting and scheduled external monitoring that checks the site responds and today's challenge exists.",
        "One deployment once left the API unresponsive for a few minutes because migrations regenerated images before letting it start. The fix went to the root: migrations only migrate, the script prepares images with the new version while the old one keeps serving, and a test guards that order.",
      ],
      shots: [
        {
          key: "adv-movil",
          alt: "Adivinadle on a phone: logo, instructions and the game folders",
          caption: "The mobile version, which is where people play",
        },
      ],
    },
  ],
  links: [{ label: "adivinadle.com", href: "https://adivinadle.com", external: true }],
  repo: {
    visibility: "private",
    note: "The repository is private for now.",
  },
};
