import type { CaseStudy } from "../types";

export const warduxEn: CaseStudy = {
  slug: "wardux",
  track: "personal",
  order: 5,
  featured: true,
  title: "Wardux",
  tagline:
    "A tech publication whose newsroom is two AI agents from different providers: one writes without being able to publish, the other reviews and publishes.",
  client: "Own product · wardux.com",
  period: "Sep 2026 – present",
  year: "2026–",
  role: "Product, architecture and pipeline design",
  summary:
    "News, guides and analysis on AI, hardware, software and video games. What matters for this role is the newsroom: an AI newsroom pipeline, running every day, where no model publishes on its own and the reviewer's corrections improve the writer.",
  cover: {
    key: "wdx-portada",
    alt: "wardux.com homepage with the tagline «Less smoke, more vision»",
    caption: "Homepage in production",
  },
  stack: ["Codex", "Claude", "Astro", "Laravel 13", "PostgreSQL", "Varnish", "Playwright", "systemd"],
  metrics: [
    { value: "90", label: "articles published" },
    { value: "2", label: "AI providers: one writes, one reviews" },
    { value: "25/09", label: "live since, 2026" },
    { value: "≥ 95", label: "Lighthouse required in CI" },
  ],
  sections: [
    {
      id: "pipeline",
      heading: "The pipeline",
      body: [
        "Every night, one agent (**Codex**) looks for news, writes, checks the facts and leaves each piece **\"in review\"**. It has no permission to publish.",
        "A watcher checks every few minutes for pieces waiting. Once they have been still for a while (to batch what arrives together), it launches a second agent from **another provider (Claude)** with its reviewer's manual: it corrects, publishes or sends back to draft, logs what it corrected and sends a single notification.",
      ],
      pullQuote: "No model publishes on its own: one writes, another from a different provider reviews.",
    },
    {
      id: "fiabilidad",
      heading: "Reliability",
      bullets: [
        { term: "Idempotent, with retries", text: "A review that does not finish cleanly is not counted as done and is retried; the same piece, unchanged, is never reviewed twice." },
        { term: "Never at the same time", text: "Reviews do not run while the other agent is writing or while another review is in progress." },
        { term: "Improvement loop", text: "What the reviewer corrects often moves into the writer's manual: the system learns from its own mistakes." },
      ],
    },
    {
      id: "web",
      heading: "The site",
      body: [
        "Server-mode Astro, Laravel 13 with Octane and PostgreSQL, Varnish caching with tag-based purges, a self-hosted S3-compatible image store, cookieless analytics, separate staging and production, and **per-commit deployment with automatic rollback**. CI runs Playwright e2e, broken-link checks and Lighthouse.",
      ],
    },
  ],
  links: [{ label: "wardux.com", href: "https://wardux.com", external: true }],
  repo: {
    visibility: "private",
    note: "The repository is private.",
  },
};
