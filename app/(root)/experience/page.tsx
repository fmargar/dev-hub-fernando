import type { Metadata } from "next";
import { ExperienceView } from "@/components/experience/ExperienceView";
import { es } from "@/i18n/translations/es";
import { alternatesFor } from "@/lib/alternates";

export const metadata: Metadata = {
  title: es.experience.title,
  description: es.experience.intro,
  alternates: alternatesFor("/experience", "es"),
};

export default function ExperiencePage() {
  return <ExperienceView />;
}
