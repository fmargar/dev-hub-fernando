import type { Metadata } from "next";
import { WorkIndexView } from "@/components/work/WorkIndexView";
import { es } from "@/i18n/translations/es";

export const metadata: Metadata = {
  title: es.work.title,
  description: es.work.intro,
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return <WorkIndexView />;
}
