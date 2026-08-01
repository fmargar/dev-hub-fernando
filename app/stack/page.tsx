import type { Metadata } from "next";
import { StackView } from "@/components/stack/StackView";
import { es } from "@/i18n/translations/es";

export const metadata: Metadata = {
  title: es.stackPage.title,
  description: es.stackPage.intro,
  alternates: { canonical: "/stack" },
};

export default function StackPage() {
  return <StackView />;
}
