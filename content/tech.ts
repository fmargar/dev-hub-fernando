import type { LucideIcon } from "lucide-react";
import {
  Webhook,
  Link2,
  Network,
  History,
  ScrollText,
  Workflow,
  FlaskConical,
} from "lucide-react";

export type TechEntry =
  | { kind: "brand"; src: string }
  | { kind: "glyph"; icon: LucideIcon };

/**
 * Única fuente de verdad del icono por tecnología, keyed por SkillItem.id
 * (no por el label traducible — ver content/types.ts).
 *
 * Los logos de marca son monocromos (`fill="currentColor"`), sacados de
 * simple-icons y guardados en public/tech/. Sin variantes claro/oscuro: al
 * heredar el color del texto no hace falta conmutar por tema.
 *
 * Los "glyph" son conceptos sin marca (APIs REST, migraciones...) o marcas
 * sin fuente monocroma fiable disponible (PHPUnit): un icono neutro de
 * Lucide en vez de inventar un logotipo o dejar el hueco vacío.
 */
export const TECH: Record<string, TechEntry> = {
  // Backend
  php: { kind: "brand", src: "/tech/php.svg" },
  "laravel-12": { kind: "brand", src: "/tech/laravel.svg" },
  symfony: { kind: "brand", src: "/tech/symfony.svg" },
  java: { kind: "brand", src: "/tech/java.svg" },
  "spring-boot": { kind: "brand", src: "/tech/spring-boot.svg" },
  nodejs: { kind: "brand", src: "/tech/nodejs.svg" },
  express: { kind: "brand", src: "/tech/express.svg" },
  python: { kind: "brand", src: "/tech/python.svg" },
  "rest-apis": { kind: "glyph", icon: Webhook },
  "eloquent-orm": { kind: "glyph", icon: Link2 },

  // Frontend
  react: { kind: "brand", src: "/tech/react.svg" },
  nextjs: { kind: "brand", src: "/tech/nextjs.svg" },
  typescript: { kind: "brand", src: "/tech/typescript.svg" },
  javascript: { kind: "brand", src: "/tech/javascript.svg" },
  inertiajs: { kind: "brand", src: "/tech/inertia.svg" },
  tailwindcss: { kind: "brand", src: "/tech/tailwindcss.svg" },
  vite: { kind: "brand", src: "/tech/vite.svg" },

  // Datos
  postgresql: { kind: "brand", src: "/tech/postgresql.svg" },
  mysql: { kind: "brand", src: "/tech/mysql.svg" },
  mariadb: { kind: "brand", src: "/tech/mariadb.svg" },
  "relational-modeling": { kind: "glyph", icon: Network },
  migrations: { kind: "glyph", icon: History },
  auditing: { kind: "glyph", icon: ScrollText },

  // Infraestructura
  docker: { kind: "brand", src: "/tech/docker.svg" },
  "docker-compose": { kind: "brand", src: "/tech/docker.svg" },
  portainer: { kind: "brand", src: "/tech/portainer.svg" },
  nginx: { kind: "brand", src: "/tech/nginx.svg" },
  "ubuntu-server": { kind: "brand", src: "/tech/ubuntu.svg" },
  cloudflare: { kind: "brand", src: "/tech/cloudflare.svg" },
  tailscale: { kind: "brand", src: "/tech/tailscale.svg" },
  "git-github": { kind: "brand", src: "/tech/github.svg" },
  "ci-cd": { kind: "glyph", icon: Workflow },

  // Calidad
  phpunit: { kind: "glyph", icon: FlaskConical },
  postman: { kind: "brand", src: "/tech/postman.svg" },
  eslint: { kind: "brand", src: "/tech/eslint.svg" },
  jest: { kind: "brand", src: "/tech/jest.svg" },
  vitest: { kind: "brand", src: "/tech/vitest.svg" },
  cypress: { kind: "brand", src: "/tech/cypress.svg" },
};
