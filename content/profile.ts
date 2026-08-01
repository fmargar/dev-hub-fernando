import type { Certification, ContentLocale, ExperienceEntry, SkillGroup } from "./types";

export const profile = {
  name: "Fernando Máximo Martínez García",
  shortName: "Fernando Martínez",
  location: "Marbella, España",
  email: "fmargardeveloper@gmail.com",
  github: "https://github.com/fmargar",
  githubHandle: "fmargar",
  linkedin: "https://linkedin.com/in/fmargar",
  site: "https://fmargar.es",
  cv: "/cv/fernando-martinez-cv.pdf",
} as const;

/* ── Trayectoria ────────────────────────────────────────────────────────────
   Las fechas son las del CV. El puesto del Ayuntamiento terminó el 21/05/2026
   (fecha de fin de las prácticas recogida en la memoria del proyecto).
   ─────────────────────────────────────────────────────────────────────────── */

const experienceEs: ExperienceEntry[] = [
  {
    id: "uniformes-bahia",
    role: "Responsable de comercio electrónico",
    company: "Uniformes Bahía",
    start: "2026-07-01",
    end: null,
    kind: "work",
    summary:
      "Integración del canal de venta online con el ERP y modelado del catálogo de producto.",
    highlights: [
      "Diseño e integración de APIs (XML-RPC y REST) para sincronizar catálogos masivos con Odoo manteniendo la integridad referencial.",
      "Modelado relacional de catálogos de alta cardinalidad: estandarización de SKUs y relaciones padre-hijo para variantes de producto.",
      "Automatización de flujos de datos y optimización técnica (SEO y metadatos) del canal de e-commerce.",
    ],
  },
  {
    id: "ayuntamiento-marbella",
    role: "Desarrollador web full stack (prácticas)",
    company: "Excmo. Ayuntamiento de Marbella",
    start: "2026-02-01",
    end: "2026-05-21",
    kind: "work",
    summary:
      "Sistema de gestión de vados del término municipal, desde la importación de los históricos hasta el despliegue en intranet.",
    highlights: [
      "Desarrollo bajo patrón MVC con Laravel 12, React 18 e Inertia.js.",
      "Diseño del esquema en PostgreSQL con Eloquent, incluido el módulo de geolocalización con Leaflet y CartoCiudad.",
      "Importadores masivos que normalizan datos heredados en TSV y dBASE con codificación IBM850.",
      "Control de acceso por rol y territorio, y auditoría automática de cada cambio mediante Observer.",
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
    summary: "Mantenimiento y optimización de portales corporativos.",
    highlights: [
      "Mantenimiento técnico de portales de alta disponibilidad y mejoras de rendimiento.",
      "Configuración de módulos y colaboración en el diseño de interfaces responsivas.",
    ],
  },
  {
    id: "daw-salduba",
    role: "Técnico Superior en Desarrollo de Aplicaciones Web (DAW)",
    company: "I.E.S. Salduba",
    start: "2024-09-01",
    end: "2026-06-30",
    kind: "education",
    summary:
      "Formación full stack: Java (Spring Boot), PHP (Laravel), bases de datos, despliegue y trabajo con Git.",
    highlights: [
      "Proyecto intermodular de fin de ciclo: Marbella Fácil, plataforma de servicios turísticos y ciudadanos.",
    ],
    cases: ["marbella-facil"],
  },
  {
    id: "alcampo",
    role: "Vendedor técnico",
    company: "Alcampo",
    start: "2024-06-01",
    end: "2024-09-01",
    kind: "work",
    summary: "Asesoramiento en hardware y resolución de incidencias técnicas de cara al público.",
    highlights: [],
  },
];

const experienceEn: ExperienceEntry[] = [
  {
    id: "uniformes-bahia",
    role: "E-commerce lead",
    company: "Uniformes Bahía",
    start: "2026-07-01",
    end: null,
    kind: "work",
    summary: "Integrating the online sales channel with the ERP and modelling the product catalogue.",
    highlights: [
      "Designed and integrated XML-RPC and REST APIs to sync large catalogues with Odoo while preserving referential integrity.",
      "Relational modelling of high-cardinality catalogues: SKU standardisation and parent-child relationships for product variants.",
      "Automated data flows and technical optimisation (SEO and metadata) of the e-commerce channel.",
    ],
  },
  {
    id: "ayuntamiento-marbella",
    role: "Full stack web developer (internship)",
    company: "Marbella City Council",
    start: "2026-02-01",
    end: "2026-05-21",
    kind: "work",
    summary:
      "Driveway permit management system for the municipality, from importing legacy records to intranet deployment.",
    highlights: [
      "MVC development with Laravel 12, React 18 and Inertia.js.",
      "PostgreSQL schema design with Eloquent, including the geolocation module built on Leaflet and CartoCiudad.",
      "Bulk importers that normalise legacy TSV and dBASE data encoded in IBM850.",
      "Role- and district-scoped access control, plus automatic audit logging of every change through an Observer.",
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
    summary: "Maintenance and optimisation of corporate portals.",
    highlights: [
      "Technical maintenance of high-availability portals and performance improvements.",
      "Module configuration and collaboration on responsive interface design.",
    ],
  },
  {
    id: "daw-salduba",
    role: "Higher Diploma in Web Application Development (DAW)",
    company: "I.E.S. Salduba",
    start: "2024-09-01",
    end: "2026-06-30",
    kind: "education",
    summary:
      "Full stack training: Java (Spring Boot), PHP (Laravel), databases, deployment and version control.",
    highlights: [
      "Capstone project: Marbella Fácil, a tourism and civic services platform.",
    ],
    cases: ["marbella-facil"],
  },
  {
    id: "alcampo",
    role: "Technical sales assistant",
    company: "Alcampo",
    start: "2024-06-01",
    end: "2024-09-01",
    kind: "work",
    summary: "Hardware advice and troubleshooting in a customer-facing role.",
    highlights: [],
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
    description: "Nivel intermedio-alto certificado, suficiente para trabajar en entornos técnicos en inglés.",
  },
  {
    id: "aws-ccp",
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services · formación",
    year: "2025",
    description: "Fundamentos de la nube: servicios principales, modelo de responsabilidad compartida, seguridad y precios.",
  },
  {
    id: "cisco-cyber",
    title: "Cybersecurity Essentials",
    issuer: "Cisco Networking Academy",
    year: "2025",
    description: "Protección de datos, mitigación de amenazas y seguridad en redes corporativas.",
  },
  {
    id: "react-testing",
    title: "React avanzado y testing",
    issuer: "Formación complementaria",
    year: "2025",
    description: "Patrones de React, pruebas unitarias con Jest y Vitest, y end-to-end con Cypress.",
  },
];

const certificationsEn: Certification[] = [
  {
    id: "cambridge-b2",
    title: "English B2 First (FCE)",
    issuer: "Cambridge Assessment English",
    year: "2022",
    description: "Upper-intermediate certified level, enough to work in English-speaking technical environments.",
  },
  {
    id: "aws-ccp",
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services · course",
    year: "2025",
    description: "Cloud fundamentals: core services, the shared responsibility model, security and pricing.",
  },
  {
    id: "cisco-cyber",
    title: "Cybersecurity Essentials",
    issuer: "Cisco Networking Academy",
    year: "2025",
    description: "Data protection, threat mitigation and corporate network security.",
  },
  {
    id: "react-testing",
    title: "Advanced React and testing",
    issuer: "Continuing education",
    year: "2025",
    description: "React patterns, unit testing with Jest and Vitest, and end-to-end testing with Cypress.",
  },
];

/* ── Competencias ───────────────────────────────────────────────────────────
   Agrupadas y enlazadas al caso que las demuestra. Sin porcentajes: una
   autoevaluación numérica no aporta información verificable.
   ─────────────────────────────────────────────────────────────────────────── */

const skillsEs: SkillGroup[] = [
  {
    id: "backend",
    label: "Backend",
    items: ["PHP", "Laravel 12", "Symfony", "Java", "Spring Boot", "Node.js", "Express", "Python", "APIs REST", "Eloquent ORM"],
    evidence: { caseSlug: "sistema-vados-marbella", label: "Ver cómo lo apliqué en el sistema de vados" },
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["React 18 / 19", "Next.js", "TypeScript", "JavaScript (ES6+)", "Inertia.js", "Tailwind CSS", "Vite"],
    evidence: { caseSlug: "marbella-facil", label: "Ver cómo lo apliqué en Marbella Fácil" },
  },
  {
    id: "datos",
    label: "Bases de datos",
    items: ["PostgreSQL", "MySQL", "MariaDB", "Modelado relacional", "Migraciones", "Auditoría y trazabilidad"],
    evidence: { caseSlug: "sistema-vados-marbella", label: "Ver el modelo de datos del sistema de vados" },
  },
  {
    id: "infra",
    label: "Infraestructura y DevOps",
    items: ["Docker", "Docker Compose", "Portainer", "Nginx", "Ubuntu Server", "Cloudflare", "Tailscale", "Git / GitHub", "CI/CD"],
    evidence: { caseSlug: "homelab", label: "Ver la infraestructura que administro" },
  },
  {
    id: "calidad",
    label: "Testing y calidad",
    items: ["PHPUnit", "Jest", "Vitest", "Cypress", "ESLint", "Postman"],
    evidence: { caseSlug: "marbella-facil", label: "Ver la estrategia de pruebas de Marbella Fácil" },
  },
];

const skillsEn: SkillGroup[] = [
  {
    id: "backend",
    label: "Backend",
    items: ["PHP", "Laravel 12", "Symfony", "Java", "Spring Boot", "Node.js", "Express", "Python", "REST APIs", "Eloquent ORM"],
    evidence: { caseSlug: "sistema-vados-marbella", label: "See how I applied it in the permit system" },
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["React 18 / 19", "Next.js", "TypeScript", "JavaScript (ES6+)", "Inertia.js", "Tailwind CSS", "Vite"],
    evidence: { caseSlug: "marbella-facil", label: "See how I applied it in Marbella Fácil" },
  },
  {
    id: "datos",
    label: "Databases",
    items: ["PostgreSQL", "MySQL", "MariaDB", "Relational modelling", "Migrations", "Auditing and traceability"],
    evidence: { caseSlug: "sistema-vados-marbella", label: "See the permit system's data model" },
  },
  {
    id: "infra",
    label: "Infrastructure and DevOps",
    items: ["Docker", "Docker Compose", "Portainer", "Nginx", "Ubuntu Server", "Cloudflare", "Tailscale", "Git / GitHub", "CI/CD"],
    evidence: { caseSlug: "homelab", label: "See the infrastructure I run" },
  },
  {
    id: "calidad",
    label: "Testing and quality",
    items: ["PHPUnit", "Jest", "Vitest", "Cypress", "ESLint", "Postman"],
    evidence: { caseSlug: "marbella-facil", label: "See the testing strategy in Marbella Fácil" },
  },
];

export function getExperience(locale: ContentLocale): ExperienceEntry[] {
  return locale === "es" ? experienceEs : experienceEn;
}

export function getCertifications(locale: ContentLocale): Certification[] {
  return locale === "es" ? certificationsEs : certificationsEn;
}

export function getSkills(locale: ContentLocale): SkillGroup[] {
  return locale === "es" ? skillsEs : skillsEn;
}
