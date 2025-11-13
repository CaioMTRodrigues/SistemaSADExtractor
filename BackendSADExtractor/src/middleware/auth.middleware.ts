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

async function requireAuth(req: Request, res: Response, next: NextFunction) {
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
  const basicSession = await auth.api.getSession({ headers });
  if (!basicSession) return res.status(401).json({ error: "Unauthorized" });
  const userRole = await prisma.user.findUnique({
    where: { id: basicSession?.user.id },
    select: { role: true },
  });
  const session = {
    ...basicSession,
    user: { ...basicSession?.user, role: userRole?.role },
  };

  req.user = session.user;
  next();
}

export default requireAuth;