import { NextRequest, NextResponse } from "next/server";
import { BodyTooLargeError, clientIp, createRateLimiter, readBodyLimited } from "@/lib/api-guard";

// remove.bg cobra por imagen: el límite protege la cuota, no solo el servidor.
const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
// El multipart añade cabeceras y límites alrededor de la imagen.
const BODY_MAX_BYTES = IMAGE_MAX_BYTES + 64 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

// 10 imágenes por hora y por IP, 60 por hora en total.
const isRateLimited = createRateLimiter({
  ipMax: 10,
  ipWindowMs: 60 * 60 * 1000,
  globalMax: 60,
  globalWindowMs: 60 * 60 * 1000,
});

export async function POST(req: NextRequest) {
  try {
    if (isRateLimited(clientIp(req))) {
      return NextResponse.json({ error: "Demasiadas imágenes. Inténtalo más tarde." }, { status: 429 });
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "El servicio no está disponible ahora mismo." }, { status: 503 });
    }

    let bytes: Uint8Array<ArrayBuffer>;
    try {
      bytes = await readBodyLimited(req, BODY_MAX_BYTES);
    } catch (error) {
      if (error instanceof BodyTooLargeError) {
        return NextResponse.json({ error: "La imagen supera 10 MB." }, { status: 413 });
      }
      throw error;
    }

    const formData = await new Request(req.url, {
      method: "POST",
      headers: { "content-type": req.headers.get("content-type") ?? "" },
      body: bytes,
    }).formData();
    const file = formData.get("image_file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Archivo no válido o ausente." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Solo se admiten PNG, JPEG o WebP." }, { status: 415 });
    }
    if (file.size > IMAGE_MAX_BYTES) {
      return NextResponse.json({ error: "La imagen supera 10 MB." }, { status: 413 });
    }

    const externalFormData = new FormData();
    externalFormData.append("image_file", file);
    externalFormData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": apiKey },
      body: externalFormData,
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      console.error("Error from Remove.bg API:", response.status, await response.text());
      return NextResponse.json({ error: "Fallo al procesar la imagen." }, { status: 502 });
    }

    return new NextResponse(await response.arrayBuffer(), {
      status: 200,
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("Ruta API Error:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
