import { ImageResponse } from "next/og";
import { caseSlugs, getCase } from "@/content/cases";
import { profile } from "@/content/profile";

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
    (
      <div
        style={{
          background: "#070912",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,122,82,0.18) 0%, transparent 70%)",
          }}
        />

        {client && (
          <span style={{ color: "#ff7a52", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
            {client}
          </span>
        )}

        <span
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 900,
            color: "white",
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          {title}
        </span>

        <span
          style={{
            marginTop: 40,
            color: "rgba(255,255,255,0.5)",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          {profile.shortName} · fmargar.es
        </span>
      </div>
    ),
    { ...size }
  );
}
