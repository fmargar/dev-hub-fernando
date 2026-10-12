import { profile } from "@/content/profile";

// Invariante por idioma a propósito: los campos de schema.org (jobTitle,
// address...) no se traducen por convención, y el sitio en sí no cambia de
// identidad entre / y /en. Compartido entre los dos layouts raíz.
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.shortName,
  url: profile.site,
  email: `mailto:${profile.email}`,
  jobTitle: "AI Engineer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Marbella",
    addressCountry: "ES",
  },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: ["Large language models", "AI agents", "Human-in-the-loop", "Python", "OpenAI API", "Laravel", "TypeScript", "Astro", "PostgreSQL", "Docker", "Odoo"],
};
