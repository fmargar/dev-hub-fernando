import "./globals.css";

/**
 * Red de seguridad fuera de los dos grupos (app/(root) y app/[locale]): una
 * ruta que no encaja limpiamente en ninguno de los dos (p. ej. una URL
 * arbitraria de un solo segmento que tampoco es "en" ni "de") no tiene un
 * layout raíz común del que colgar — sin este fichero, Next no sabe a qué
 * not-found.tsx recurrir y revienta con un NoFallbackError interno en vez de
 * dar un 404 normal. Autocontenido y monolingüe en español por el mismo
 * motivo que global-error.tsx: se renderiza sin <html>/<body> propios y sin
 * el I18nProvider de ningún grupo.
 */
export default function NotFound() {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <div className="page-head">
          <div className="container-page">
            <h1 className="display-1">404</h1>
            <p className="lead measure mt-5">Página no encontrada</p>
            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
              El enlace está roto o la página se ha movido. Prueba desde el inicio.
            </p>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- fuera del router de ningún grupo, next/link no es fiable aquí */}
            <a href="/" className="btn btn-secondary mt-8 h-10 min-h-0 text-sm">
              Volver al inicio
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
