export type ContentLocale = "es" | "en" | "de";

/** Una viñeta puede llevar un término en negrita antes del texto. */
export interface CaseBullet {
  term?: string;
  text: string;
}

export interface CaseSection {
  id: string;
  heading: string;
  /** Párrafos. Admiten **negrita** y `código` (ver lib/rich-text.tsx). */
  body?: string[];
  bullets?: CaseBullet[];
  /** Clave del diagrama a renderizar bajo la sección (ver components/case/Figure.tsx). */
  figure?: {
    key: string;
    caption: string;
  };
}

export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface CaseStudy {
  slug: string;
  /** Orden en el índice de trabajo; menor primero. */
  order: number;
  /** Aparece en la home. */
  featured: boolean;
  title: string;
  /** Una línea que resume el proyecto. Se usa en el índice y en metadatos. */
  tagline: string;
  client: string;
  /** Texto ya formateado, p. ej. "Feb – May 2026". */
  period: string;
  /** Año o rango corto para la columna del índice. */
  year: string;
  role: string;
  /** 2-3 frases. Encabeza la página del caso. */
  summary: string;
  stack: string[];
  metrics: CaseMetric[];
  sections: CaseSection[];
  links: CaseLink[];
  repo: {
    visibility: "public" | "private";
    href?: string;
    /** Por qué no hay enlace, cuando el repositorio es privado. */
    note?: string;
  };
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  /** ISO. */
  start: string;
  /** ISO, o null si sigue en curso. */
  end: string | null;
  kind: "work" | "education";
  summary: string;
  highlights: string[];
  /** Slugs de casos que documentan este puesto. */
  cases?: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
  /** Caso que demuestra el grupo, en vez de un porcentaje autoasignado. */
  evidence?: {
    caseSlug: string;
    label: string;
  };
}
