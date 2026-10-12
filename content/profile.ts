import type { Certification, ContentLocale, ExperienceEntry, SkillGroup, SkillItem } from "./types";

export const profile = {
  name: "Fernando Máximo Martínez García",
  shortName: "Fernando Martínez",
  location: "Marbella, España",
  email: "fmargardeveloper@gmail.com",
  github: "https://github.com/fmargar",
  githubHandle: "fmargar",
  linkedin: "https://www.linkedin.com/in/fernando-maximo-martinez-garcia",
  site: "https://fmargar.es",
  cv: "/cv/fernando-martinez-cv.pdf",
} as const;

/* ── Trayectoria ────────────────────────────────────────────────────────────
   Fechas y textos alineados con el CV (~/docs/CV_maestro.md, 12/10/2026).
   ─────────────────────────────────────────────────────────────────────────── */

const experienceEs: ExperienceEntry[] = [
  {
    id: "uniformes-bahia",
    role: "Responsable de comercio electrónico",
    company: "Uniformes Bahía y Locura Segura",
    start: "2026-07-01",
    end: null,
    kind: "work",
    summary:
      "Desarrollo, datos e IA sobre Odoo (Python) y PrestaShop (PHP), en Marbella.",
    highlights: [
      "LLM en el ERP: módulo de Odoo que redacta la descripción de cada producto a partir de su ficha técnica con la API de OpenAI y un prompt propio. Entra como borrador, queda registrado quién la propone y un responsable la aprueba antes de publicarla.",
      "Instalador propio en Python sobre la API JSON-2 de Odoo para desplegar campos, vistas QWeb, acciones y tareas programadas: idempotente, con simulación y reversión. Ahora lo migramos a un módulo empaquetado y versionado.",
      "Incidente de producción: bots recorrían todas las combinaciones de filtros del catálogo y el equipo no podía trabajar. Los separé por patrón de navegación, no por user-agent, sin romper el rastreo de los buscadores, con reglas de seguridad en Cloudflare.",
      "Pipelines ETL (CSV, Excel, XML) hacia Odoo por XML-RPC y REST, scrapers con reintentos y modelado de un catálogo de alta cardinalidad.",
    ],
    cases: ["uniformes-bahia"],
  },
  {
    id: "ayuntamiento-marbella",
    role: "Desarrollador full stack (prácticas)",
    company: "Excmo. Ayuntamiento de Marbella",
    start: "2026-02-01",
    end: "2026-05-21",
    kind: "work",
    summary:
      "Sistema municipal de gestión de vados, desde la importación de los históricos hasta el despliegue en la intranet.",
    highlights: [
      "Laravel 12, React 18, Inertia.js y PostgreSQL.",
      "Importadores de datos heredados en dos formatos (IBM850) con saneado y deduplicación.",
      "Cinco roles con alcance territorial y auditoría automática de cada cambio.",
    ],
    cases: ["sistema-vados-marbella"],
  },
  {
    id: "asisa",
    role: "Desarrollador web (prácticas)",
    company: "ASISA",
    start: "2025-03-01",
    end: "2025-04-30",
    kind: "work",
    summary: "Desarrollo y personalización de páginas en WordPress: plugins y mejoras de interfaz.",
    highlights: [],
  },
  {
    id: "daw-salduba",
    role: "Técnico Superior en Desarrollo de Aplicaciones Web (DAW)",
    company: "I.E.S. Salduba",
    start: "2024-09-01",
    end: "2026-06-30",
    kind: "education",
    summary: "Proyecto final, Marbella Fácil: 10 con Matrícula de Honor.",
    highlights: [],
    cases: ["marbella-facil"],
  },
];

const experienceEn: ExperienceEntry[] = [
  {
    id: "uniformes-bahia",
    role: "E-commerce lead",
    company: "Uniformes Bahía y Locura Segura",
    start: "2026-07-01",
    end: null,
    kind: "work",
    summary: "Development, data and AI on Odoo (Python) and PrestaShop (PHP), in Marbella.",
    highlights: [
      "LLM inside the ERP: an Odoo module that writes each product description from its spec sheet with the OpenAI API and a custom prompt. It lands as a draft, records who proposed it, and a manager approves it before it is published.",
      "Custom Python installer on Odoo's JSON-2 API that deploys fields, QWeb views, server actions and scheduled jobs: idempotent, with dry run and rollback. Now being migrated to a packaged, versioned module.",
      "Production incident: bots were crawling every filter combination of the catalogue and the team could not work. I separated them by navigation pattern rather than user agent, without breaking search engine crawling, using Cloudflare security rules.",
      "ETL pipelines (CSV, Excel, XML) into Odoo over XML-RPC and REST, scrapers with retries, and modelling of a high-cardinality catalogue.",
    ],
    cases: ["uniformes-bahia"],
  },
  {
    id: "ayuntamiento-marbella",
    role: "Full stack developer (internship)",
    company: "Marbella City Council",
    start: "2026-02-01",
    end: "2026-05-21",
    kind: "work",
    summary:
      "Municipal driveway permit system, from importing legacy records to deployment on the intranet.",
    highlights: [
      "Laravel 12, React 18, Inertia.js and PostgreSQL.",
      "Importers for legacy data in two formats (IBM850) with cleaning and deduplication.",
      "Five roles with territorial scope and automatic auditing of every change.",
    ],
    cases: ["sistema-vados-marbella"],
  },
  {
    id: "asisa",
    role: "Web developer (internship)",
    company: "ASISA",
    start: "2025-03-01",
    end: "2025-04-30",
    kind: "work",
    summary: "Building and customising WordPress pages: plugins and interface improvements.",
    highlights: [],
  },
  {
    id: "daw-salduba",
    role: "Higher Diploma in Web Application Development (DAW)",
    company: "I.E.S. Salduba",
    start: "2024-09-01",
    end: "2026-06-30",
    kind: "education",
    summary: "Final project, Marbella Fácil: top grade (10) with honours.",
    highlights: [],
    cases: ["marbella-facil"],
  },
];

/* ── Certificaciones ────────────────────────────────────────────────────────
   AWS Cloud Practitioner Essentials es el curso oficial de fundamentos, no el
   examen de certificación: se nombra como tal para no dar a entender otra cosa.
   ─────────────────────────────────────────────────────────────────────────── */

const certificationsEs: Certification[] = [
  {
    id: "cambridge-b2",
    title: "English B2 First (FCE)",
    issuer: "Cambridge Assessment English",
    year: "2022",
    description: "Nivel B2 certificado: leo documentación, escribo y trabajo en inglés sin problema.",
  },
  {
    id: "aws-ccp",
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services · formación",
    year: "2025",
    description: "Fundamentos de la nube: servicios principales, responsabilidad compartida, seguridad y precios.",
  },
  {
    id: "cisco-cyber",
    title: "Cybersecurity Essentials",
    issuer: "Cisco Networking Academy",
    year: "2025",
    description: "Protección de datos, mitigación de amenazas y seguridad en redes corporativas.",
  },
];

const certificationsEn: Certification[] = [
  {
    id: "cambridge-b2",
    title: "English B2 First (FCE)",
    issuer: "Cambridge Assessment English",
    year: "2022",
    description: "Certified B2: I read documentation, write and work in English comfortably.",
  },
  {
    id: "aws-ccp",
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services · course",
    year: "2025",
    description: "Cloud fundamentals: core services, shared responsibility, security and pricing.",
  },
  {
    id: "cisco-cyber",
    title: "Cybersecurity Essentials",
    issuer: "Cisco Networking Academy",
    year: "2025",
    description: "Data protection, threat mitigation and security in corporate networks.",
  },
];

/* ── Competencias ───────────────────────────────────────────────────────────
   Los grupos del CV, cada uno enlazado al caso que lo demuestra. Sin
   porcentajes: una autoevaluación numérica no aporta información verificable.
   Los ids son la clave estable del icono (content/tech.ts) y viven una sola
   vez aquí; cada locale solo aporta las etiquetas, en el mismo orden.
   ─────────────────────────────────────────────────────────────────────────── */

const SKILL_IDS = {
  ia: ["openai", "prompts", "human-in-the-loop", "claude-code", "codex", "gemini", "mcp", "multi-agent", "context-engineering", "local-models", "quantization", "evals"],
  lenguajes: ["python", "php", "typescript", "javascript", "sql"],
  backend: ["laravel-12", "nodejs", "postgresql", "mysql", "redis", "rest-apis", "openapi", "etl", "odoo"],
  frontend: ["react", "astro", "svelte", "nextjs", "tailwindcss"],
  infra: ["docker", "ubuntu-server", "githubactions", "ci-cd", "playwright", "phpstan", "pest", "vitest", "nginx", "caddy", "cloudflare", "tailscale"],
} as const;

function skillItems(group: keyof typeof SKILL_IDS, labels: string[]): SkillItem[] {
  return SKILL_IDS[group].map((id, i) => ({ id, label: labels[i] }));
}

const skillsEs: SkillGroup[] = [
  {
    id: "ia",
    label: "IA y LLM",
    items: skillItems("ia", ["OpenAI API", "Diseño de prompts", "Human-in-the-loop", "Claude Code", "Codex", "Gemini", "Servidores MCP", "Coordinación multiagente", "Context engineering", "Modelos en local (Qwen3-VL)", "Cuantización (bitsandbytes)", "Evaluación con conjunto de prueba"]),
    evidence: { caseSlug: "agentes-ia", label: "Ver el equipo de agentes" },
  },
  {
    id: "lenguajes",
    label: "Lenguajes",
    items: skillItems("lenguajes", ["Python", "PHP", "TypeScript", "JavaScript", "SQL"]),
    evidence: { caseSlug: "uniformes-bahia", label: "Ver el LLM en Odoo" },
  },
  {
    id: "backend",
    label: "Backend y datos",
    items: skillItems("backend", ["Laravel", "Node.js", "PostgreSQL", "MySQL", "Redis", "APIs REST", "OpenAPI", "ETL", "Odoo (XML-RPC, JSON-2)"]),
    evidence: { caseSlug: "adivinadle", label: "Ver la arquitectura de Adivinadle" },
  },
  {
    id: "frontend",
    label: "Frontend",
    items: skillItems("frontend", ["React", "Astro", "Svelte", "Next.js", "Tailwind CSS"]),
    evidence: { caseSlug: "adivinadle", label: "Ver la web de Adivinadle" },
  },
  {
    id: "infra",
    label: "DevOps y calidad",
    items: skillItems("infra", ["Docker", "Linux", "GitHub Actions", "CI/CD", "Playwright", "PHPStan", "Pest", "Vitest", "Nginx", "Caddy", "Cloudflare", "Tailscale"]),
    evidence: { caseSlug: "homelab", label: "Ver la infraestructura que administro" },
  },
];

const skillsEn: SkillGroup[] = [
  {
    id: "ia",
    label: "AI and LLMs",
    items: skillItems("ia", ["OpenAI API", "Prompt design", "Human-in-the-loop", "Claude Code", "Codex", "Gemini", "MCP servers", "Multi-agent coordination", "Context engineering", "Local models (Qwen3-VL)", "Quantisation (bitsandbytes)", "Evaluation with a test set"]),
    evidence: { caseSlug: "agentes-ia", label: "See the agent team" },
  },
  {
    id: "lenguajes",
    label: "Languages",
    items: skillItems("lenguajes", ["Python", "PHP", "TypeScript", "JavaScript", "SQL"]),
    evidence: { caseSlug: "uniformes-bahia", label: "See the LLM in Odoo" },
  },
  {
    id: "backend",
    label: "Backend and data",
    items: skillItems("backend", ["Laravel", "Node.js", "PostgreSQL", "MySQL", "Redis", "REST APIs", "OpenAPI", "ETL", "Odoo (XML-RPC, JSON-2)"]),
    evidence: { caseSlug: "adivinadle", label: "See Adivinadle's architecture" },
  },
  {
    id: "frontend",
    label: "Frontend",
    items: skillItems("frontend", ["React", "Astro", "Svelte", "Next.js", "Tailwind CSS"]),
    evidence: { caseSlug: "adivinadle", label: "See Adivinadle's web app" },
  },
  {
    id: "infra",
    label: "DevOps and quality",
    items: skillItems("infra", ["Docker", "Linux", "GitHub Actions", "CI/CD", "Playwright", "PHPStan", "Pest", "Vitest", "Nginx", "Caddy", "Cloudflare", "Tailscale"]),
    evidence: { caseSlug: "homelab", label: "See the infrastructure I run" },
  },
];

const experienceByLocale: Record<ContentLocale, ExperienceEntry[]> = {
  es: experienceEs,
  en: experienceEn,
};

const certificationsByLocale: Record<ContentLocale, Certification[]> = {
  es: certificationsEs,
  en: certificationsEn,
};

const skillsByLocale: Record<ContentLocale, SkillGroup[]> = {
  es: skillsEs,
  en: skillsEn,
};

export function getExperience(locale: ContentLocale): ExperienceEntry[] {
  return experienceByLocale[locale];
}

export function getCertifications(locale: ContentLocale): Certification[] {
  return certificationsByLocale[locale];
}

export function getSkills(locale: ContentLocale): SkillGroup[] {
  return skillsByLocale[locale];
}
