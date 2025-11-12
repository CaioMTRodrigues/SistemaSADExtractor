import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";

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
      Array.isArray(value) ? value.join(",") : value !== undefined ? String(value) : ""
    ]) as [string, string][]
  );
  const session = await auth.api.getSession({ headers });
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  req.user = session.user;
  next();
}

export default requireAuth;