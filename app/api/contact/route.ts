import { NextRequest, NextResponse } from 'next/server';
import { deliverContactMessage } from '@/lib/contact-delivery';

const NAME_MAX = 100;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 5000;
const HONEYPOT_MIN_MS = 3000;

const IP_WINDOW_MS = 15 * 60 * 1000;
const IP_MAX_REQUESTS = 5;
const GLOBAL_WINDOW_MS = 60 * 60 * 1000;
const GLOBAL_MAX_REQUESTS = 20;

// En memoria, a propósito: una sola instancia de contenedor, se resetea al
// reiniciar. docker-compose.yml publica 80:3000 directo en el host, así que
// las cabeceras de IP son falsificables si la máquina es alcanzable sin pasar
// por Cloudflare — por eso el tope global no depende de ellas.
const requestsByIp = new Map<string, number[]>();
let globalRequestTimestamps: number[] = [];

function pruneOld(timestamps: number[], windowMs: number, now: number): number[] {
  return timestamps.filter((t) => now - t < windowMs);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  globalRequestTimestamps = pruneOld(globalRequestTimestamps, GLOBAL_WINDOW_MS, now);
  if (globalRequestTimestamps.length >= GLOBAL_MAX_REQUESTS) return true;

  const ipTimestamps = pruneOld(requestsByIp.get(ip) ?? [], IP_WINDOW_MS, now);
  if (ipTimestamps.length >= IP_MAX_REQUESTS) return true;

  ipTimestamps.push(now);
  requestsByIp.set(ip, ipTimestamps);
  globalRequestTimestamps.push(now);
  return false;
}

function getClientIp(request: NextRequest): string {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return 'unknown';
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEADER_INJECTION_REGEX = /[\r\n]/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, company, startedAt } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Honeypot: campo oculto relleno, o envío más rápido de lo humanamente
    // posible. Se responde éxito sin enviar nada — un bot que ve un 400
    // reintenta, uno que ve un 200 se va.
    const submittedTooFast =
      typeof startedAt !== 'number' || Date.now() - startedAt < HONEYPOT_MIN_MS;
    if ((typeof company === 'string' && company.trim() !== '') || submittedTooFast) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (
      name.length > NAME_MAX ||
      email.length > EMAIL_MAX ||
      message.length > MESSAGE_MAX
    ) {
      return NextResponse.json(
        { error: 'Uno de los campos supera la longitud permitida' },
        { status: 400 }
      );
    }

    if (HEADER_INJECTION_REGEX.test(name) || HEADER_INJECTION_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Inténtalo más tarde.' },
        { status: 429 }
      );
    }

    const result = await deliverContactMessage({
      name,
      email,
      message,
      ip,
      receivedAt: new Date().toISOString(),
    });

    if (!result.stored && !result.notified && !result.emailed) {
      return NextResponse.json(
        { error: 'Servicio de contacto no disponible' },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Error al enviar el mensaje. Por favor intenta de nuevo.' },
      { status: 500 }
    );
  }
}
