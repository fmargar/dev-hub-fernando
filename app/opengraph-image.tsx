import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og-card";

export const alt = "Fernando Martínez · Desarrollador Full Stack · agentes de IA · integración de LLM";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        kicker="Desarrollador Full Stack · agentes de IA · integración de LLM"
        title="Fernando Martínez"
        footer="fmargar.es · Marbella, España"
      />
    ),
    { ...size }
  );
}
