import type { Metadata } from "next";
import { ExperienceView } from "@/components/experience/ExperienceView";
import { PREFIXED_TRANSLATIONS } from "@/lib/locale-translations";
import { alternatesFor } from "@/lib/alternates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "en" | "de" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = PREFIXED_TRANSLATIONS[locale];

  return {
    title: t.experience.title,
    description: t.experience.intro,
    alternates: alternatesFor("/experience", locale),
  };
}

export default function LocaleExperiencePage() {
  return <ExperienceView />;
}
