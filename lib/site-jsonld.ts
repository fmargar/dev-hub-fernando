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
  DIRECTION: 2026 redesign, user-pinned brief, supersedes the prior standing
  exit (roll key e95bc100 / product-site direction). The site is a starship
  navigation console orbiting a system Fernando built: each route is a body,
  the camera travels between them, real content lives in an HTML HUD layered
  over the canvas. Thesis: the canvas carries scale, the HUD carries content —
  no reading happens inside WebGL, every 3D destination has a real <a> twin.
  BRAND COMMITMENT: dark permanently, no light mode; deep-space nebula base
  (cyan / magenta / violet); vermilion (#ff7a52) kept as the single accent for
  action, focus and active state — the one thing that survives from the prior
  world. Geist for prose; Geist Mono inverted to the instrument register —
  navigation, chips, buttons, telemetry, coordinates — never prose. A
  self-hosted display face carries .display-1/-2 only.
  CRAFT BAR (set by the user, unchanged): itshover, Linear, Stripe/Resend,
  studio portfolios. Their finish level is the floor, not their layouts —
  now applied to a different visual language, not the same product-site
  layout.
  STORY: the visitor approaches a body and finds the case behind it — the
  problem, the decision, what was left unresolved — same content as before,
  new frame.
  DEGRADATION: tier 0 (no WebGL / reduced-motion / save-data) is a complete
  CSS-only product on its own, not an apology. The server always emits tier 0;
  upgrading tiers happens client-side after mount.
  MOTION: itshover animated icons unchanged; camera moves via useFrame with
  critically-damped interpolation; warp transitions on route change. Canvas
  unmounts, not pauses, under reduced motion.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the
  finish review, the verdict, and a regenerated DESIGN.md written from the
  built world, not before it.
-->`;
