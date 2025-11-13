import { Request, Response } from "express";
import { createUser, firstPassword, signIn } from "./auth.service.js";

class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (email === null || password === null) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    try {
      const user = await signIn(email, password);
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
}

export default AuthController;
