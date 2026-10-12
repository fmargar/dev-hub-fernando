import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og-card";

export const alt = "Fernando Martínez · AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        kicker="LLM en producción · agentes de IA · full stack"
        title="Fernando Martínez, AI Engineer"
        footer="fmargar.es · Marbella, España"
      />
    ),
    { ...size }
  );
}
