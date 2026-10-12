import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og-card";
import { PREFIXED_LOCALES } from "@/lib/locale-paths";

export const alt = "Fernando Martínez · AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        kicker="LLMs in production · AI agents · full stack"
        title="Fernando Martínez, AI Engineer"
        footer="fmargar.es · Marbella, España"
      />
    ),
    { ...size }
  );
}
