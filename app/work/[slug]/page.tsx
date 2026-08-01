import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseView } from "@/components/case/CaseView";
import { caseSlugs, getCase } from "@/content/cases";
import { profile } from "@/content/profile";

export function generateStaticParams() {
  return caseSlugs.map((slug) => ({ slug }));
}

// Los metadatos se generan en servidor, donde no hay contexto de idioma; se usa
// el español, que es el idioma por defecto del documento (<html lang="es">).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCase("es", slug);
  if (!study) return {};

  return {
    title: study.title,
    description: study.tagline,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      type: "article",
      title: study.title,
      description: study.tagline,
      url: `${profile.site}/work/${slug}`,
    },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCase("es", slug);
  if (!study) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.tagline,
    author: { "@type": "Person", name: profile.name, url: profile.site },
    inLanguage: "es-ES",
    mainEntityOfPage: `${profile.site}/work/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <CaseView slug={slug} />
    </>
  );
}
