/**
 * Tarjeta Open Graph común a la portada y a las fichas de proyecto. Fondo de
 * cobalto entero (el acento del sitio), tipografía grande y nada más: en una
 * previsualización de LinkedIn o WhatsApp se lee a tamaño de miniatura.
 */
export function OgCard({ kicker, title, footer }: { kicker: string; title: string; footer: string }) {
  return (
    <div
      style={{
        background: "#2340e0",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        fontFamily: "system-ui, sans-serif",
        color: "white",
      }}
    >
      <span style={{ fontSize: 30, fontWeight: 600, color: "rgba(255,255,255,0.82)" }}>{kicker}</span>
      <span
        style={{
          display: "flex",
          fontSize: title.length > 40 ? 68 : 96,
          fontWeight: 800,
          lineHeight: 1.04,
          letterSpacing: "-0.03em",
          maxWidth: 1040,
        }}
      >
        {title}
      </span>
      <span style={{ fontSize: 26, fontWeight: 600, color: "rgba(255,255,255,0.82)" }}>{footer}</span>
    </div>
  );
}
