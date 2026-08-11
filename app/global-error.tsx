"use client";

import "./globals.css";

// Se renderiza fuera del layout raíz cuando ese layout mismo falla, así que no
// hay <html>/<body> ni providers (idioma, tema) disponibles: monolingüe en
// español a propósito, no es un descuido de i18n.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <div className="page-head">
          <div className="container-page">
            <h1 className="display-2">Algo ha fallado</h1>
            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
              Se ha producido un error inesperado. Puedes reintentar o volver al inicio.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={reset} className="btn btn-secondary h-10 min-h-0 text-sm">
                Reintentar
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- fuera del router raíz, next/link no es fiable aquí */}
              <a href="/" className="btn btn-secondary h-10 min-h-0 text-sm">
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
