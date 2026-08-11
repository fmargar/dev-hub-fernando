import type { Metadata } from "next";
import { WorkIndexView } from "@/components/work/WorkIndexView";
import { es } from "@/i18n/translations/es";
import { alternatesFor } from "@/lib/alternates";

export const metadata: Metadata = {
  title: es.work.title,
  description: es.work.intro,
  alternates: alternatesFor("/work", "es"),
};

export default function WorkPage() {
  return <WorkIndexView />;
}
