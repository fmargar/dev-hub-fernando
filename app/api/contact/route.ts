import { NextRequest, NextResponse } from 'next/server';
import { deliverContactMessage } from '@/lib/contact-delivery';
import { BodyTooLargeError, clientIp, createRateLimiter, readBodyLimited } from '@/lib/api-guard';

const NAME_MAX = 100;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 5000;
const HONEYPOT_MIN_MS = 3000;

const BODY_MAX_BYTES = 16 * 1024;

// 5 mensajes cada 15 min por IP y 20 por hora en total.
const isRateLimited = createRateLimiter({
  ipMax: 5,
  ipWindowMs: 15 * 60 * 1000,
  globalMax: 20,
  globalWindowMs: 60 * 60 * 1000,
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEADER_INJECTION_REGEX = /[\r\n]/;

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Inténtalo más tarde.' },
        { status: 429 }
      );
    }

    let body;
    try {
      body = JSON.parse(new TextDecoder().decode(await readBodyLimited(request, BODY_MAX_BYTES)));
    } catch (error) {
      if (error instanceof BodyTooLargeError) {
        return NextResponse.json({ error: 'Mensaje demasiado largo' }, { status: 413 });
      }
      return NextResponse.json({ error: 'Petición no válida' }, { status: 400 });
    }
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
