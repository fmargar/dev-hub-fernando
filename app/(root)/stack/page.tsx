import type { Metadata } from "next";
import { StackView } from "@/components/stack/StackView";
import { es } from "@/i18n/translations/es";
import { alternatesFor } from "@/lib/alternates";

export const metadata: Metadata = {
  title: es.stackPage.title,
  description: es.stackPage.intro,
  alternates: alternatesFor("/stack", "es"),
};

export default function StackPage() {
  return <StackView />;
}
