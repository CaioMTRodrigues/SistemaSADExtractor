import { Request, Response } from "express";
import { createUser, firstPassword, signIn } from "./auth.service.js";
import { prisma } from "../lib/db.js";
import { getOneUser } from "../user/user.service.js";
import { auth } from "../lib/auth.js";
class AuthController {
  /**
   * Admin reenvia email de criação de senha para o usuário
   */
  async resendFirstPasswordEmail(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    try {
      const user = await getOneUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await auth.api.requestPasswordReset({
        body: {
          email: user.email,
          redirectTo: "/create-password",
        },
      });
      return res.status(200).json({ message: "Email de criação de senha reenviado com sucesso." });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao reenviar email de criação de senha", error });
    }
  }
  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    if (email === null || senha === null) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    try {
      const user = await signIn(email, senha);
      return res.status(200).json(user);
    } catch (error) {
      if (typeof error === "object" && error !== null && "message" in error) {
        const errMsg = (error as { message: string }).message;
        if (errMsg === "User not found or inactive") {
          return res.status(403).json({ message: errMsg });
        }
      }
      return res.status(401).json({ message: "Invalid credentials" });
    }
  }

  async register(req: Request, res: Response) {
    const { email, name, role } = req.body;
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (email === null) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    try {
      const user = await createUser(email, name, role);
      return res.status(201).json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error creating user", error: error });
    }
  }

  async firstPassword(req: Request, res: Response) {
    const { password, token } = req.body;
    try {
      const data = await firstPassword(password, token);
      return res.status(200).json(data);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error setting first password", error: error });
    }
  }
//Esqueci a senha 
  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "E-mail é obrigatório" });
    }

    try {
      // 1. Buscamos o usuário pelo e-mail (já que o front não tem o ID)
      const user = await prisma.user.findUnique({
        where: { email, active: true },
      });

      // 2. Segurança: Se não achar, dizemos que enviamos para não revelar quem é cadastrado
      if (!user) {
        return res.status(200).json({ message: "Se o e-mail existir, o link foi enviado." });
      }

      // 3. REUTILIZAÇÃO: Chamamos a mesma função que o resendFirstPasswordEmail chama.
      // Isso vai acionar o seu arquivo 'resend.ts' automaticamente.
      await auth.api.requestPasswordReset({
        body: {
          email: user.email,
          redirectTo: "/create-password", // Mantém o fluxo de criar senha
        },
      });

      return res.status(200).json({ message: "Link enviado com sucesso." });
    } catch (error) {
      console.error("Erro no forgotPassword:", error);
      return res.status(500).json({ message: "Erro interno ao processar solicitação." });
    }
  }
}

export default AuthController;
