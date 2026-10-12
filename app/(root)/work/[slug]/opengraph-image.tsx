import { ImageResponse } from "next/og";
import { caseSlugs, getCase } from "@/content/cases";
import { profile } from "@/content/profile";
import { OgCard } from "@/lib/og-card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return caseSlugs.map((slug) => ({ slug }));
}

// Solo tipografía, sin capturas: a 1200×630 se recortan mal y algunas
// pertenecen a una administración pública.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCase("es", slug);
  const title = study?.title ?? profile.shortName;
  const client = study?.client ?? "";

  return new ImageResponse(
    <OgCard kicker={client} title={title} footer={`${profile.shortName} · fmargar.es`} />,
    { ...size }
  );
}
