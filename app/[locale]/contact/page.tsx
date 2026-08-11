import type { Metadata } from "next";
import { ContactView } from "@/components/contact/ContactView";
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
    title: t.contact.title,
    description: t.contact.intro,
    alternates: alternatesFor("/contact", locale),
  };
}

export default function LocaleContactPage() {
  return <ContactView />;
}
