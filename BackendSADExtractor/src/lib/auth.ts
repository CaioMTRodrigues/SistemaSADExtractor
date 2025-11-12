import { betterAuth } from "better-auth";
import { prisma } from "./db.js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, magicLink } from "better-auth/plugins";
import { resend, sendMagicLinkEmail } from "./resend.js";
import { FRONTEND_URL } from "./env.js";

export const auth = betterAuth({
  baseURL: FRONTEND_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "Equipe <no-reply@seudominio.com>",
        to: user.email,
        subject: "Defina sua senha",
        html: `Clique para definir sua senha: <a href="${url}">${url}</a>`,
      });
    },
  },
  plugins: [
    bearer(),
    magicLink({
      expiresIn: 60 * 2, // 2 min
      sendMagicLink: async ({ email, token, url }, request) => {
        // better-auth costuma passar `url` já pronto (ver docs).
        // Se quiser, você pode construir seu próprio url usando o token.
        // Aqui apenas delegamos para o serviço de e-mail.
        await sendMagicLinkEmail({ email, token, url });
      },
     
      disableSignUp: true,
      storeToken: 'plain',
    }),
  ],
});
