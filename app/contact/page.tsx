import type { Metadata } from "next";
import { ContactView } from "@/components/contact/ContactView";
import { es } from "@/i18n/translations/es";

export const metadata: Metadata = {
  title: es.contact.title,
  description: es.contact.intro,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactView />;
}
