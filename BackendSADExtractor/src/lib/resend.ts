import { Resend } from 'resend';
import { BETTER_AUTH_SECRET, FRONTEND_URL, RESEND_API_KEY } from './env.js';
import jwt from 'jsonwebtoken';

export const resend = new Resend(RESEND_API_KEY);

type Payload = { email: string; token: string; url?: string };

export async function sendResetPasswordLinkEmail({ email, token, url }: Payload) {
const jwtToken = jwt.sign(
    { email, betterAuthToken: token },
    BETTER_AUTH_SECRET,
    { expiresIn: "60m" }
  );
  const link = `${FRONTEND_URL}/create-password?token=${jwtToken}`;

  await resend.emails.send({
    from: "no-reply@resend.dev",
    to: email,
    subject: "Seu link de acesso",
    html: `
      <p>Olá,</p>
      <p>Clique no link abaixo para criar sua senha:</p>
      <p><a href="${link}">Criar senha</a></p>
      <p>Esse link expira em 15 minutos.</p>
    `,
  });
}