import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // three no publica ESM puro en todos sus submódulos; sin esto Next no
  // transpila el paquete y next build falla en la escena 3D.
  transpilePackages: ["three"],
  async redirects() {
    return [
      // La sección se llamaba /projects antes del rediseño.
      { source: "/projects", destination: "/work", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // El aislamiento cross-origin solo lo necesita FFmpeg.wasm, que usa
        // SharedArrayBuffer. Aplicarlo a todo el sitio bloquearía cualquier
        // imagen o recurso externo que se añada en el futuro.
        source: "/tools/video-crunch",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
