/**
 * Nivel 0: el fondo cósmico completo en CSS puro, sin three ni WebGL. Es el
 * producto por defecto — el servidor lo emite siempre, y sube de nivel (fase
 * 4) solo si el cliente confirma capacidad tras montar. Nada aquí depende de
 * JavaScript para pintarse: si el canvas nunca llega a cargar, esto es lo que
 * ve el visitante, no una disculpa.
 */
export function SpaceFallback() {
  return (
    <div className="space-backdrop" aria-hidden="true">
      <div className="space-backdrop__nebula" />
      <div className="space-backdrop__stars space-backdrop__stars--far" />
      <div className="space-backdrop__stars space-backdrop__stars--mid" />
      <div className="space-backdrop__stars space-backdrop__stars--near" />
      <div className="space-backdrop__vignette" />
    </div>
  );
}
