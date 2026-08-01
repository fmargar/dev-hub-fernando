import type { CaseStudy } from "../types";

export const uniformesBahiaEn: CaseStudy = {
  slug: "uniformes-bahia",
  track: "professional",
  order: 3,
  featured: true,
  title: "Connecting the online channel to the ERP",
  tagline:
    "Syncing a high-cardinality catalogue between the online store and Odoo without breaking referential integrity.",
  client: "Uniformes Bahía",
  period: "Jul 2026 – present",
  year: "2026–",
  role: "E-commerce lead",
  summary:
    "My current role. The catalogue lives in Odoo and the online sales channel has to mirror it exactly: same products, same variants, same identifiers. The challenge is not moving data around — it is keeping both systems telling the same story while the catalogue changes every day.",
  stack: ["Odoo", "XML-RPC", "REST", "Relational modelling", "Technical SEO"],
  metrics: [],
  sections: [
    {
      id: "contexto",
      heading: "Context",
      body: [
        "A workwear catalogue is a textbook case of **high cardinality**: every garment multiplies by size, colour and sometimes by sector or safety standard. One product becomes dozens of real references, and all of them have to exist in both systems under the same identifier.",
        "The ERP, Odoo, is the source of truth. The online channel has to be a faithful reflection of it, and the problem shows up the moment it stops being one: a variant that exists in the store but no longer in the ERP is an order that cannot be fulfilled.",
      ],
    },
    {
      id: "integracion",
      heading: "The integration",
      body: [
        "Synchronisation builds on the interfaces Odoo exposes — **XML-RPC** for model operations and REST where it fits better — on the premise that no write may leave the catalogue in an intermediate state.",
      ],
      bullets: [
        {
          term: "Referential integrity comes first",
          text: "A variant cannot exist without its parent product, and a product cannot lose variants that were already selling. Operations are ordered so that relationship never breaks mid-sync.",
        },
        {
          term: "Standardised SKUs",
          text: "Identifiers followed different conventions depending on who created the product. Unifying them is what allows both sides to be matched automatically: without a stable identifier, every sync becomes a manual reconciliation.",
        },
        {
          term: "Explicit parent-child relationships",
          text: "The model separates the product from its variants instead of treating every size-and-colour combination as a standalone item. That is what lets a large catalogue be browsed and filtered in the store without duplicating product pages.",
        },
      ],
    },
    {
      id: "automatizacion",
      heading: "Automation and technical layer",
      body: [
        "Beyond synchronisation, the channel has to keep itself running: automated data flows instead of manual uploads, plus **technical SEO** work on metadata and product page structure, which decides whether a large catalogue gets found or stays invisible.",
      ],
    },
    {
      id: "en-curso",
      heading: "Ongoing",
      callout: {
        tone: "note",
        text: "This is my current role, so the case is open and will grow as the project does. The other case studies on this site are finished and documented with their technical reports.",
      },
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "Internal company work; the code is not public.",
  },
};
