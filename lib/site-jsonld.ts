import { profile } from "@/content/profile";

// Invariante por idioma a propósito: los campos de schema.org (jobTitle,
// address...) no se traducen por convención, y el sitio en sí no cambia de
// identidad entre /  /en  /de. Compartido entre los dos layouts raíz.
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.shortName,
  url: profile.site,
  email: `mailto:${profile.email}`,
  jobTitle: "Full stack developer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Marbella",
    addressCountry: "ES",
  },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: ["Laravel", "React", "Next.js", "PostgreSQL", "Docker", "TypeScript"],
};

export const directionContract = `<!--
  DIRECTION: standing exit taken by the user after four rejected worlds. The
  category convention is the commitment, not the fallback: a modern product
  site, played straight, at full craft fidelity, with no irony and no smuggled
  quirk. Roll key e95bc100 was overridden by the brief, which wins.
  BRAND COMMITMENT: light by default with a designed dark counterpart; warm
  neutral base; one accent (vermilion) spent only on primary action, focus and
  active state; Geist for interface, Geist Mono reserved for the record
  register — metadata labels, machine values, code — never for UI chrome.
  CRAFT BAR (set by the user): itshover, Linear, Stripe/Resend, studio
  portfolios. Their finish level is the floor, not their layouts.
  STORY: the visitor lands on the work itself — real screenshots of shipped
  software — and can walk into any case to find the problem, the decision and
  what was left unresolved.
  FIRST VIEWPORT: glass navbar, a headline at display scale over a faint
  two-focus accent field, two actions with animated icons, and a hairline row of
  facts. No metric strip, no eyebrow, no card grid.
  MOTION: itshover animated icons driven from their parent's hover, short
  reveals on scroll, 0.16-0.22s eases. Everything off under reduced motion.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the
  finish review, the verdict, and DESIGN.md
-->`;
