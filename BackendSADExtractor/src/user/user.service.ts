import { auth } from "../lib/auth.js";
import { FRONTEND_URL } from "../lib/env.js";

import { prisma } from "../lib/db.js";

type Role = "ADMIN" | "GESTOR" | "CADASTRO";

export const signIn = async (email: string, password: string) => {
  try {
    const user = auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: `${FRONTEND_URL}/home`,
      },
      asResponse: true,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

// Função para admin criar usuário e enviar magic link + reset password
export const createUser = async (email: string, name: string, role: Role) => {
  try {
    // 1) Upsert do usuário
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
      },
    });

    // 2) Enviar magic link que já redireciona para a página de reset password
    await auth.api.signInMagicLink({
      body: {
        name,
        email,
      },
      headers: {},
    });

    return { user };
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (password: string) => {
  try {
    const token =
      new URLSearchParams(window.location.search).get("token") || undefined;

    if (!token) {
      // Handle the error
    }

    const data = await auth.api.resetPassword({
      body: {
        newPassword: password, // required
        token, // required
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const signUp = async (email: string, name: string, role: Role) => {
  try {
    // ...existing code...
    return;
  } catch (error) {
    throw error;
  }
};
