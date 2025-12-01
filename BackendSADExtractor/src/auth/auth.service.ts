import { auth } from "../lib/auth.js";
import { BETTER_AUTH_SECRET, FRONTEND_URL } from "../lib/env.js";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/db.js";

export type Role = "ADMIN" | "GESTOR" | "CADASTRO";

export const signIn = async (email: string, password: string) => {
  try {
    // conferir se usuário está ativo
    const userRecord = await prisma.user.findUnique({
      where: { email: email, active: true },
      select: { role: true },
    });
    if (!userRecord) {
      throw new Error("User not found or inactive");
    }
    const user = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      //   asResponse: true,
    });
    return { ...user, role: userRecord.role };
  } catch (error) {
    console.log("Error during signIn:", error);
    throw error;
  }
};

// Função para admin criar usuário e enviar magic link + reset password
export const createUser = async (email: string, name: string, role: Role) => {
  try {
    // 1) Criar usuário com active: false
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        active: false,
      },
    });

    // 2) Enviar magic link para cadastro de senha
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: "/create-password",
      },
    });

    return { user };
  } catch (error) {
    throw error;
  }
};

export const firstPassword = async (password: string, token: string) => {
  try {
    if (!token) {
      throw new Error("Token não informado");
    }
    const decoded = jwt.verify(token, BETTER_AUTH_SECRET) as {
      email: string;
      betterAuthToken: string;
    };
    const result = await auth.api.resetPassword({
      body: {
        newPassword: password,
        token: decoded.betterAuthToken,
      },
    });

    if (result) {
      // Ativar o usuário após definir a senha
      await prisma.user.update({
        where: { email: decoded.email },
        data: { active: true, emailVerified: true },
      });
    }
  } catch (error) {
    throw error;
  }
};
