import { Resend } from 'resend';
import { FRONTEND_URL, RESEND_API_KEY } from './env.js';

export const resend = new Resend(RESEND_API_KEY);

type Payload = { email: string; token: string; url?: string };

export async function sendMagicLinkEmail({ email, token, url }: Payload) {
  const link = `${FRONTEND_URL}/create-password?token=${token}`;

  await resend.emails.send({
    from: "no-reply@resend.dev",
    to: email,
    subject: "Seu link de acesso",
    html: `
      <p>Olá,</p>
      <p>Clique no link abaixo para entrar:</p>
      <p><a href="${link}">Entrar com Magic Link</a></p>
      <p>Esse link expira em 15 minutos.</p>
    `,
  });
}