import type { Metadata } from "next";
import { ExperienceView } from "@/components/experience/ExperienceView";
import { es } from "@/i18n/translations/es";

export const metadata: Metadata = {
  title: es.experience.title,
  description: es.experience.intro,
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return <ExperienceView />;
}
