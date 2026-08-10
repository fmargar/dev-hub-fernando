export type ToolCategory =
  | "image"
  | "video"
  | "code"
  | "text"
  | "security"
  | "conversion"
  | "dev"
  | "sports";

export interface ToolMeta {
  slug: string;
  category: ToolCategory;
  tags: string[];
}

// Datos estáticos: slug, categoría y etiquetas de búsqueda.
// Título y descripción viven en t.tools.list[slug] (i18n/translations/*.ts),
// keyed por el mismo slug — sin acoplamiento por posición.
export const TOOLS: ToolMeta[] = [
  // ── Imagen y color ────────────────────────────────────────────────────────
  { slug: "bg-remover", category: "image", tags: ["fondo", "background", "eliminar", "ia", "ai", "bg", "remover"] },
  { slug: "image-forge", category: "image", tags: ["convertir", "redimensionar", "webp", "avif", "png", "jpg"] },
  { slug: "image-compressor", category: "image", tags: ["comprimir", "optimizar", "peso", "compress"] },
  { slug: "exif-reader", category: "image", tags: ["exif", "metadatos", "gps", "camara", "fecha"] },
  { slug: "color-blindness", category: "image", tags: ["daltonismo", "colores", "accesibilidad", "vision", "deuteranopia", "protanopia"] },
  { slug: "palette-extractor", category: "image", tags: ["paleta", "color", "hex", "rgb", "hsl", "dominante"] },
  { slug: "image-color-picker", category: "image", tags: ["color", "picker", "capturar", "cuentagotas", "hex"] },
  { slug: "gradient-generator", category: "image", tags: ["gradiente", "css", "color", "linear", "radial", "conic"] },
  { slug: "favicon-generator", category: "image", tags: ["favicon", "icono", "pwa", "manifest"] },
  // ── Vídeo ─────────────────────────────────────────────────────────────────
  { slug: "video-crunch", category: "video", tags: ["video", "comprimir", "gif", "ffmpeg", "wasm"] },
  // ── Código ────────────────────────────────────────────────────────────────
  { slug: "snippet-generator", category: "code", tags: ["snippet", "imagen", "codigo", "compartir"] },
  { slug: "json-formatter", category: "code", tags: ["json", "formatear", "validar", "minificar"] },
  { slug: "svg-to-datauri", category: "code", tags: ["svg", "data uri", "css", "html", "inline"] },
  { slug: "code-beautifier", category: "code", tags: ["beautifier", "format", "html", "css", "js", "minify"] },
  // ── Texto ─────────────────────────────────────────────────────────────────
  { slug: "word-counter", category: "text", tags: ["palabras", "contador", "texto", "lectura", "estadisticas"] },
  { slug: "text-diff", category: "text", tags: ["diff", "comparar", "texto", "diferencias"] },
  { slug: "lorem-ipsum", category: "text", tags: ["lorem", "ipsum", "placeholder", "texto"] },
  { slug: "markdown-editor", category: "text", tags: ["markdown", "editor", "preview", "md"] },
  // ── Seguridad ─────────────────────────────────────────────────────────────
  { slug: "password-generator", category: "security", tags: ["password", "contrasena", "seguridad", "generador"] },
  { slug: "hash-generator", category: "security", tags: ["hash", "sha", "md5", "sha256", "integridad"] },
  { slug: "base64", category: "security", tags: ["base64", "encode", "decode", "codificar"] },
  { slug: "text-encryptor", category: "security", tags: ["encrypt", "aes", "cifrar", "seguridad"] },
  { slug: "jwt-decoder", category: "security", tags: ["jwt", "token", "decode", "payload"] },
  // ── Conversión ────────────────────────────────────────────────────────────
  { slug: "data-converter", category: "conversion", tags: ["bytes", "kb", "mb", "gb", "conversion"] },
  { slug: "unix-timestamp", category: "conversion", tags: ["unix", "timestamp", "fecha", "tiempo", "epoch"] },
  { slug: "csv-json", category: "conversion", tags: ["csv", "json", "convertir", "datos"] },
  { slug: "qr-code", category: "conversion", tags: ["qr", "code", "codigo", "url", "vcard"] },
  { slug: "aspect-ratio", category: "conversion", tags: ["aspect ratio", "proporcion", "escalar", "dimensiones", "16:9"] },
  // ── Desarrollo ────────────────────────────────────────────────────────────
  { slug: "gitignore-generator", category: "dev", tags: ["gitignore", "git", "templates", "stack"] },
  { slug: "readme-generator", category: "dev", tags: ["readme", "github", "markdown", "badges"] },
  { slug: "regex-tester", category: "dev", tags: ["regex", "expresion regular", "patron", "test"] },
  { slug: "cron-helper", category: "dev", tags: ["cron", "scheduler", "tarea", "automatizar"] },
  // ── Deportes ──────────────────────────────────────────────────────────────
  { slug: "nba-scores", category: "sports", tags: ["nba", "baloncesto", "basket", "scores", "live"] },
];

export const toolSlugs = TOOLS.map((tool) => tool.slug);
