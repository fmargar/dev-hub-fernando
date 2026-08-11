import type { Metadata } from "next";
import { WorkIndexView } from "@/components/work/WorkIndexView";
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
    title: t.work.title,
    description: t.work.intro,
    alternates: alternatesFor("/work", locale),
  };
}

export default function LocaleWorkPage() {
  return <WorkIndexView />;
}
