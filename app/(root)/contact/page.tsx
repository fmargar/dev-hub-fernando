import type { Metadata } from "next";
import { ContactView } from "@/components/contact/ContactView";
import { es } from "@/i18n/translations/es";
import { alternatesFor } from "@/lib/alternates";

export const metadata: Metadata = {
  title: es.contact.title,
  description: es.contact.intro,
  alternates: alternatesFor("/contact", "es"),
};

export default function ContactPage() {
  return <ContactView />;
}
