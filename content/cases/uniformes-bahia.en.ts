import type { CaseStudy } from "../types";

export const uniformesBahiaEn: CaseStudy = {
  slug: "uniformes-bahia",
  track: "professional",
  order: 1,
  featured: true,
  title: "An LLM inside the ERP, with human approval",
  tagline:
    "Product descriptions generated with the OpenAI API that land as drafts and are only published once a person approves them.",
  client: "Uniformes Bahía y Locura Segura",
  period: "Jul 2026 – present",
  year: "2026–",
  role: "E-commerce lead",
  summary:
    "My current job. I run development, data and AI for the online store on Odoo and PrestaShop. The piece that best defines me: an Odoo module that puts an LLM to work writing product copy without taking the final say away from anyone.",
  stack: ["Python", "Odoo", "OpenAI API", "PHP", "PrestaShop", "XML-RPC", "JSON-2", "Cloudflare"],
  metrics: [],
  sections: [
    {
      id: "llm",
      heading: "The LLM proposes, a person decides",
      body: [
        "A large catalogue needs a good description per product, and writing them by hand does not scale. The module takes each product's **spec sheet** and generates the description with the **OpenAI API** and a custom prompt.",
        "What matters is what happens next. The proposal **lands as a draft**, the system records **who proposed it**, and a manager **approves or rejects** it before it is published. No text reaches the store without a person having read it.",
      ],
      pullQuote: "Human-in-the-loop is not decoration: it is what lets you put an LLM inside a system a business depends on.",
    },
    {
      id: "despliegue",
      heading: "Deploying Odoo the way you deploy software",
      body: [
        "Odoo customisations (fields, QWeb views, server actions and scheduled jobs) used to be made by hand in the UI. I wrote a **Python installer on the JSON-2 API** that deploys them from code: **idempotent**, with a **dry run** first and **rollback**. We are now migrating it to a packaged, versioned module.",
      ],
    },
    {
      id: "incidente",
      heading: "A production incident",
      body: [
        "Bots were crawling every filter combination in the catalogue and the team could not work. Blocking by user agent did not help: they posed as normal browsers.",
        "I separated them by **navigation pattern** instead of user agent, with **Cloudflare** security rules, without breaking search engine crawling or the links customers share.",
      ],
    },
    {
      id: "datos",
      heading: "Data and catalogue",
      bullets: [
        {
          term: "ETL pipelines",
          text: "Loads from CSV, Excel and XML into Odoo over XML-RPC and REST, with scrapers that retry instead of leaving gaps.",
        },
        {
          term: "High-cardinality catalogue",
          text: "Every garment multiplies by sizes and colours. The model separates products from variants, with standardised identifiers so both systems tell the same story.",
        },
        {
          term: "PrestaShop and analytics",
          text: "PHP development on the store and conversion tracking to know what works.",
        },
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "Internal company work; the code is not public.",
  },
};
