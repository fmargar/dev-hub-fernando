import type { Metadata } from "next";
import { StackView } from "@/components/stack/StackView";
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
    title: t.stackPage.title,
    description: t.stackPage.intro,
    alternates: alternatesFor("/stack", locale),
  };
}

export default function LocaleStackPage() {
  return <StackView />;
}
