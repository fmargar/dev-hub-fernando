import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseView } from "@/components/case/CaseView";
import { caseSlugs, getCase } from "@/content/cases";
import { profile } from "@/content/profile";
import { alternatesFor, ogLocaleFor } from "@/lib/alternates";
import { localizePath } from "@/lib/locale-paths";

export function generateStaticParams() {
  return caseSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "en" | "de"; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const study = getCase(locale, slug);
  if (!study) return {};

  return {
    title: study.title,
    description: study.tagline,
    alternates: alternatesFor(`/work/${slug}`, locale),
    openGraph: {
      type: "article",
      title: study.title,
      description: study.tagline,
      url: `${profile.site}${localizePath(`/work/${slug}`, locale)}`,
      locale: ogLocaleFor(locale),
    },
  };
}

const IN_LANGUAGE: Record<"en" | "de", string> = { en: "en-US", de: "de-DE" };

export default async function LocaleCasePage({
  params,
}: {
  params: Promise<{ locale: "en" | "de"; slug: string }>;
}) {
  const { locale, slug } = await params;
  const study = getCase(locale, slug);
  if (!study) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.tagline,
    author: { "@type": "Person", name: profile.name, url: profile.site },
    inLanguage: IN_LANGUAGE[locale],
    mainEntityOfPage: `${profile.site}${localizePath(`/work/${slug}`, locale)}`,
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
