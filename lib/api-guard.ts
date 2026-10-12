import type { NextRequest } from "next/server";

/**
 * Defensas comunes de las rutas públicas de /api: límite de peticiones por IP
 * y global, y tope de tamaño del cuerpo antes de leerlo.
 *
 * Los contadores viven en memoria a propósito: hay una sola instancia del
 * contenedor y se reinician con él. El tope global no depende de la IP, que
 * se puede falsificar si alguien llega a la máquina sin pasar por Cloudflare.
 */

export interface RateLimitOptions {
  /** Peticiones por IP dentro de `ipWindowMs`. */
  ipMax: number;
  ipWindowMs: number;
  /** Peticiones de todo el mundo dentro de `globalWindowMs`. */
  globalMax: number;
  globalWindowMs: number;
}

export function createRateLimiter(options: RateLimitOptions, now: () => number = Date.now) {
  const byIp = new Map<string, number[]>();
  let global: number[] = [];

  return function isLimited(ip: string): boolean {
    const t = now();
    global = global.filter((x) => t - x < options.globalWindowMs);
    if (global.length >= options.globalMax) return true;

    const hits = (byIp.get(ip) ?? []).filter((x) => t - x < options.ipWindowMs);
    if (hits.length >= options.ipMax) {
      byIp.set(ip, hits);
      return true;
    }
    hits.push(t);
    byIp.set(ip, hits);
    global.push(t);

    // Que el mapa no crezca sin fin con IPs que ya no vuelven.
    if (byIp.size > 10_000) {
      for (const [key, value] of byIp) {
        if (value.every((x) => t - x >= options.ipWindowMs)) byIp.delete(key);
      }
    }
    return false;
  };
}

export function clientIp(request: NextRequest | Request): string {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export class BodyTooLargeError extends Error {
  constructor(public readonly limit: number) {
    super(`El cuerpo supera ${limit} bytes`);
  }
}

/**
 * Lee el cuerpo como mucho hasta `maxBytes`. Rechaza primero por la cabecera
 * Content-Length y, como esa cabecera puede mentir o faltar, vuelve a contar
 * mientras lee y corta en cuanto se pasa: nunca se carga entero en memoria un
 * cuerpo enorme.
 */
export async function readBodyLimited(request: Request, maxBytes: number): Promise<Uint8Array<ArrayBuffer>> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) throw new BodyTooLargeError(maxBytes);
  if (!request.body) return new Uint8Array(new ArrayBuffer(0));

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new BodyTooLargeError(maxBytes);
    }
    chunks.push(value);
  }
  const out = new Uint8Array(new ArrayBuffer(total));
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}
