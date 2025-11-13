import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/db.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware que valida se o usuário está autenticado
 * e possui uma das roles permitidas.
 *
 * @param allowedRoles - lista de papéis que podem acessar a rota
 * @example router.get("/admin", requireRole("ADMIN", "MANAGER"), handler)
 */
export function requireRole(...allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Converter headers pro formato do Better Auth
      const headers = new Headers(
        Object.entries(req.headers).map(([key, value]) => [
          key,
          Array.isArray(value)
            ? value.join(",")
            : value !== undefined
            ? String(value)
            : "",
        ]) as [string, string][]
      );

      // 2. Validar sessão
      const session = await auth.api.getSession({ headers });
      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // 3. Buscar o usuário com role
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, email: true, role: true, active: true },
      });

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      // 4. Verificar se o usuário está ativo
      if (!user.active) {
        return res.status(403).json({ error: "User inactive" });
      }

      // 5. Verificar se tem permissão
      if (!allowedRoles.includes(user.role)) {
        return res
          .status(403)
          .json({ error: "Forbidden: insufficient permissions" });
      }

      // 6. Anexar user na request e continuar
      req.user = user;
      next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}