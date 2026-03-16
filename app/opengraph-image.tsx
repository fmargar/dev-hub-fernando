import { ImageResponse } from "next/og";

export const alt = "Fernando Martínez | Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "oklch(0.1 0.03 260)",
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
        {/* Orange glow */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(234,88,12,0.25) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: 200,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Role badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(234,88,12,0.15)",
            border: "1px solid rgba(234,88,12,0.3)",
            borderRadius: 100,
            padding: "8px 20px",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span style={{ color: "#fb923c", fontSize: 18, fontWeight: 700 }}>
            Full Stack Developer · DAW · Marbella, ES
          </span>
        </div>

        {/* Name */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 40 }}>
          <span style={{ fontSize: 88, fontWeight: 900, color: "white", lineHeight: 1 }}>
            Fernando
          </span>
          <span
            style={{
              fontSize: 88,
              fontWeight: 900,
              lineHeight: 1,
              background: "linear-gradient(90deg, #ea580c, #f97316, #fb923c)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Máximo
          </span>
        </div>

        {/* Stack tags */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["Next.js", "Laravel", "React", "PostgreSQL", "Docker", "AWS"].map((tech) => (
            <div
              key={tech}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "8px 20px",
                color: "rgba(255,255,255,0.7)",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* Domain watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 80,
            color: "rgba(255,255,255,0.2)",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          fmargar.es
        </div>
      </div>
    ),
    { ...size }
  );
}
