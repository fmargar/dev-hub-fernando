import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { Resend } from "resend";

/**
 * Entrega de un mensaje del formulario de contacto. Tres canales
 * independientes, y basta con que uno funcione para dar el mensaje por
 * entregado:
 *
 *  1. Disco: una línea JSON por mensaje en un volumen del host. Es la copia
 *     que no se pierde aunque todo lo demás falle.
 *  2. Centro de avisos del servidor (avisos-api): aviso al móvil de Fernando
 *     con el nombre, el correo y el principio del mensaje.
 *  3. Correo por Resend, solo si hay clave configurada.
 *
 * Antes el formulario dependía solo de Resend y, sin clave, respondía 503:
 * un reclutador no podía escribir. Ningún canal por sí solo es obligatorio.
 */

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  ip: string;
  receivedAt: string;
}

export interface DeliveryResult {
  stored: boolean;
  notified: boolean;
  emailed: boolean;
}

const MENSAJES_PATH = process.env.CONTACT_MESSAGES_PATH ?? "/app/data/mensajes/contacto.jsonl";

async function store(msg: ContactMessage): Promise<boolean> {
  try {
    await mkdir(dirname(MENSAJES_PATH), { recursive: true });
    await appendFile(MENSAJES_PATH, `${JSON.stringify(msg)}\n`, "utf8");
    return true;
  } catch (error) {
    console.error("Contacto: no se pudo guardar en disco:", error);
    return false;
  }
}

async function notify(msg: ContactMessage): Promise<boolean> {
  const url = process.env.AVISOS_URL;
  const key = process.env.AVISOS_CLAVE;
  if (!url || !key) return false;
  try {
    const response = await fetch(`${url}/eventos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": key },
      body: JSON.stringify({
        origen: "portfolio",
        tipo: "portfolio.contacto",
        destinatario: "fernando",
        titulo: `fmargar.es: mensaje de ${msg.name}`.slice(0, 200),
        resumen: `${msg.email} · ${msg.message}`.slice(0, 500),
        severidad: "aviso",
        datos: { nombre: msg.name, email: msg.email, mensaje: msg.message, recibido: msg.receivedAt },
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error("Contacto: avisos-api respondió", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Contacto: avisos-api no responde:", error);
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function email(msg: ContactMessage): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <contact@fmargar.es>",
      to: ["fmargardeveloper@gmail.com"],
      replyTo: msg.email,
      subject: `Nuevo mensaje de ${msg.name}`,
      html: `<p><strong>Nombre:</strong> ${escapeHtml(msg.name)}</p>
<p><strong>Email:</strong> ${escapeHtml(msg.email)}</p>
<div style="white-space: pre-wrap">${escapeHtml(msg.message)}</div>`,
    });
    if (error) {
      console.error("Contacto: Resend:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Contacto: Resend:", error);
    return false;
  }
}

export async function deliverContactMessage(msg: ContactMessage): Promise<DeliveryResult> {
  const [stored, notified, emailed] = await Promise.all([store(msg), notify(msg), email(msg)]);
  return { stored, notified, emailed };
}
