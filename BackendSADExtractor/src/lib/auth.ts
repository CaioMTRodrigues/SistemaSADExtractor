import { betterAuth } from "better-auth";
import { prisma } from "./db.js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";
import { sendResetPasswordLinkEmail } from "./resend.js";
import { FRONTEND_URL } from "./env.js";

export const auth = betterAuth({
  baseURL: FRONTEND_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    changeEmail: {
      enabled: true,
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendResetPasswordLinkEmail({ email: user.email, token, url });
    },
  },
  plugins: [
    bearer(),
  ],
});
