import type { Metadata } from "next";
import { es } from "@/i18n/translations/es";
import { profile } from "@/content/profile";

const SLUG = "text-encryptor";

// Los metadatos se generan en servidor, donde no hay contexto de idioma; se usa
// el español, que es el idioma por defecto del documento (<html lang="es">).
export function generateMetadata(): Metadata {
  const tool = es.tools.list[SLUG];

  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: `/tools/${SLUG}` },
    openGraph: {
      type: "website",
      title: tool.title,
      description: tool.description,
      url: `${profile.site}/tools/${SLUG}`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
