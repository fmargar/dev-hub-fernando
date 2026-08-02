import type { CaseStudy } from "../types";

export const marbellaFacilEn: CaseStudy = {
  slug: "marbella-facil",
  track: "professional",
  order: 2,
  featured: true,
  title: "Marbella Fácil",
  tagline:
    "A tourism and civic services platform: bookings, gamification and live municipal data in one place.",
  client: "Final-year capstone project (DAW)",
  period: "Oct 2025 – May 2026",
  year: "2025–26",
  role: "Full stack and DevOps, in a pair",
  summary:
    "A platform that pulls together what is currently spread across five separate apps: a local business directory with table booking, beach conditions, public transport, a cultural calendar and an assistant that answers questions about the city. Laravel REST backend, decoupled React frontend, and a two-node infrastructure that took as much work as the code.",
  cover: {
    key: "mf-portada",
    alt: "Marbella Fácil public homepage over a panoramic view of the city",
    caption: "Public homepage",
  },
  stack: [
    "Laravel 12",
    "React 19",
    "Vite 7",
    "MySQL 8",
    "Laravel Sanctum",
    "Stripe / Cashier",
    "Groq (Llama 3)",
    "Leaflet",
    "Docker",
    "PHPUnit",
  ],
  metrics: [
    { value: "34+", label: "entities in the data model" },
    { value: "5", label: "functional modules" },
    { value: "2", label: "mirrored production nodes" },
    { value: ">80%", label: "coverage on critical modules" },
  ],
  sections: [
    {
      id: "contexto",
      heading: "Context",
      body: [
        "Marbella is a major tourist destination with completely fragmented municipal information. Planning an afternoon means visiting the council website, the bus company's site, a weather app, a restaurant aggregator and each business's social media.",
        "Global aggregators cover the commercial side well but hold none of the local public data; institutional portals hold the data but let you do nothing with it. Marbella Fácil sits in between: municipal information **and** the ability to act on it, with a model designed so small businesses pay no per-transaction commission.",
      ],
    },
    {
      id: "arquitectura",
      heading: "Architecture",
      body: [
        "Unlike the driveway permit system, here we did build a **decoupled architecture**: a Laravel 12 REST API and a React 19 SPA served by Vite, talking over Axios with interceptors that inject the token and centralise error handling. The reason is that the platform has four very different client types (visitor, registered user, business and administrator), and the separation let the interface evolve without touching the business layer.",
        "Authentication is Laravel Sanctum with custom middleware for role control. The data model spans more than 34 related entities in MySQL 8, with foreign keys, search indexes and audit tables.",
      ],
      figure: {
        key: "mf-arch",
        caption: "Two mirrored nodes serve the application; a single database is reached over the VPN.",
      },
    },
    {
      id: "modulos",
      heading: "The modules",
      shots: [
        {
          key: "mf-directorio",
          alt: "Restaurant directory with filters by price, area and features",
          caption: "Directory with filters by price, area and features",
        },
        {
          key: "mf-agenda",
          alt: "Cultural calendar showing the Feria de San Bernabé listing",
          caption: "Cultural calendar, with capacity and categories",
        },
        {
          key: "mf-resenas",
          alt: "Business reviews with the owner's reply and helpfulness votes",
          caption: "Reviews with owner replies and helpfulness votes",
        },
      ],
      bullets: [
        {
          term: "Bookings",
          text: "The transactional core. Each business defines its booking types, time slots and exceptions (closures, special hours). Users book against real availability and the business accepts or declines in real time, with states from pending to completed.",
        },
        {
          term: "Gamification",
          text: "Points for actions (daily login, posting reviews, attending events), levels with thresholds, and a catalogue of redeemable rewards. What closes the loop is physical validation: the user shows a QR code and the owner validates it from their panel, marking the reward as delivered. Every points transaction is kept in a history table.",
        },
        {
          term: "Smart city",
          text: "Beach conditions synced automatically against the AEMET weather API by station code, geo-referenced urban bus lines and stops with traffic estimates, an events calendar and local news.",
        },
        {
          term: "AI assistant",
          text: "A chat running on Groq Cloud with Llama 3, tuned with system prompts specialised in local information. It is capped at 20 requests per hour per IP through Laravel throttling, because an open AI endpoint is an invoice waiting to happen.",
        },
        {
          term: "Reviews and interaction",
          text: "Ratings with owner replies, helpfulness votes and nested comments, with moderation of reported content from the admin panel.",
        },
      ],
    },
    {
      id: "pagos",
      heading: "Two business models in one codebase",
      shots: [
        {
          key: "mf-panel",
          alt: "Business panel with statistics, bookings, menu, opening hours and subscription plan",
          caption: "Business panel: bookings, menu, opening hours and plan",
        },
      ],
      body: [
        "The platform supports two commercial paths without forking the code. On the private (SaaS) path, businesses subscribe through **Stripe Checkout** integrated with Laravel Cashier, synchronised by signed webhooks for sign-ups, renewals and cancellations.",
        "On the public (B2G) path, the idea is that a city council buys the licence and the directory stays free for local businesses. In that mode the payment flow is skipped and a business is approved administratively. Designing for both from the start avoided rewriting the business module for either scenario.",
      ],
    },
    {
      id: "infra",
      heading: "Infrastructure and deployment",
      pullQuote:
        "Infrastructure is part of the product: once shipping stopped being a chore, the pace of development changed.",
      body: [
        "This part was mine and it is where I learned the most. The database lived on a physical server at the school, behind the campus firewall, and the application had to run outside it.",
      ],
      bullets: [
        {
          term: "Two mirrored nodes",
          text: "Each running the full containerised stack, so one going down would not take the project offline.",
        },
        {
          term: "Deploy straight from the repository",
          text: "Nothing is uploaded by hand. Portainer stacks read their definition from GitHub and poll every five minutes: merging to the main branch rebuilds the nodes automatically.",
        },
        {
          term: "Tailscale to reach the database",
          text: "A WireGuard-based mesh network joins the nodes to the school server. The Laravel containers talk to the VPN's private address, so the MySQL port is never exposed to the internet.",
        },
        {
          term: "Cloudflare in front",
          text: "Reverse proxy and WAF, SSL/TLS in Strict mode, and the servers' real IP addresses hidden.",
        },
      ],
    },
    {
      id: "calidad",
      heading: "Testing",
      body: [
        "On the backend, PHPUnit with unit tests on the logic that hurts most when it breaks — points calculation and the booking availability engine — plus integration tests that fire real HTTP requests at the endpoints, checking Sanctum middleware and persistence. We kept coverage above 80% on the critical modules.",
        "On the frontend, ESLint with strict style rules. API contracts were validated in Postman before integration, so the frontend was never built against a response shape that later changed.",
      ],
    },
    {
      id: "aprendizaje",
      heading: "What I took away",
      body: [
        "That the hard part of a two-person project is not splitting up the code, it is agreeing on the contracts. Validating endpoints in Postman before touching the frontend saved us most of the failed integrations.",
        "And that infrastructure is part of the product. Portainer polling GitHub turned deployment into something we stopped thinking about, and that changed the pace of development more than any framework decision.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "public",
    href: "https://github.com/fmargarrobertogd75/proyecto-marbella-facil",
  },
};
