import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validación de datos
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Opción 1: Usar Resend (recomendado - requiere instalar: npm install resend)
    // Descomentar las siguientes líneas y configurar RESEND_API_KEY en .env.local
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Cambiar por tu dominio verificado
      to: ['fmargardeveloper@gmail.com'],
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }
    */

    // Opción 2: Usar Nodemailer con Gmail SMTP
    // Descomentar las siguientes líneas y configurar variables en .env.local
    /*
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Tu email
        pass: process.env.GMAIL_APP_PASSWORD, // App password de Gmail (no tu contraseña normal)
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'fmargardeveloper@gmail.com',
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
    */

    // TEMPORAL: Log para desarrollo (ELIMINAR en producción)
    console.log('📧 Nuevo mensaje de contacto:');
    console.log(`Nombre: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Mensaje: ${message}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Mensaje enviado correctamente',
        // NOTA: Para producción, descomentar una de las opciones de email arriba
        warning: 'Email endpoint configurado pero no enviando correos aún. Ver console.log para mensajes.'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al procesar el mensaje:', error);
    return NextResponse.json(
      { error: 'Error al enviar el mensaje. Por favor intenta de nuevo.' },
      { status: 500 }
    );
  }
}
