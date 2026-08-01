import type { Metadata } from "next";
import { ToolsView } from "@/components/tools/ToolsView";
import { es } from "@/i18n/translations/es";

export const metadata: Metadata = {
  title: es.tools.title,
  description: es.tools.description,
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return <ToolsView />;
}
