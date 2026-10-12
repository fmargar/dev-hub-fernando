import { ImageResponse } from "next/og";
import { caseSlugs, getCase } from "@/content/cases";
import { profile } from "@/content/profile";
import { OgCard } from "@/lib/og-card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return caseSlugs.map((slug) => ({ slug }));
}

// Gemelo de app/(root)/work/[slug]/opengraph-image.tsx, con el título y
// cliente en el idioma de la URL. Solo tipografía, sin capturas.
export default async function Image({
  params,
}: {
  params: Promise<{ locale: "en"; slug: string }>;
}) {
  const { locale, slug } = await params;
  const study = getCase(locale, slug);
  const title = study?.title ?? profile.shortName;
  const client = study?.client ?? "";

  return new ImageResponse(
    <OgCard kicker={client} title={title} footer={`${profile.shortName} · fmargar.es`} />,
    { ...size }
  );
}
