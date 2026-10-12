import type { CaseStudy } from "../types";

export const calculoExactoEn: CaseStudy = {
  slug: "calculo-exacto",
  track: "personal",
  order: 6,
  featured: true,
  title: "Cálculo Exacto",
  tagline:
    "Spanish payroll and tax calculators validated against the Tax Agency's official service, to the cent.",
  client: "Own product · in preparation",
  period: "Oct 2026 – present",
  year: "2026–",
  role: "Product, architecture and validation",
  summary:
    "Net salary, severance, unemployment, pensions, taxes and the working calendar of all 8,132 Spanish municipalities, always with the formula explained and the official source alongside. Not published yet. What makes it interesting is how the results are proven correct.",
  stack: ["TypeScript", "Astro", "Svelte", "Vitest", "pnpm monorepo"],
  metrics: [
    { value: "46", label: "cases checked against the Tax Agency" },
    { value: "€0.00", label: "difference allowed" },
    { value: "1,257", label: "automated tests passing" },
    { value: "2", label: "errata found in an official publication" },
  ],
  sections: [
    {
      id: "validacion",
      heading: "Validating results against the official source",
      body: [
        "The net salary engine is checked against **the Spanish Tax Agency's own withholding calculation service**: 46 cases, one per branch of the algorithm, and the result has to match **to the cent**. The official responses are stored, so the test runs offline on every change.",
        "The comparison caught a real bug in disability deductions, now fixed. And reconciling the regional tax scales turned up **two errata in an official Treasury publication**.",
      ],
      pullQuote: "A result that cannot be checked against the source does not get published.",
    },
    {
      id: "normativa",
      heading: "Every legal figure with its origin",
      body: [
        "No legal figure lives outside a dedicated regulations package, and each carries its Official Gazette reference and effective date. A TypeScript monorepo with Astro and Svelte, with separate packages for regulations, the calculation engine, the calendar and templates.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "The repository is private and the site is not published yet.",
  },
};
