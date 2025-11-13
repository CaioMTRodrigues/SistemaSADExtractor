import { Router, Request, Response } from "express";
import AuthController from "./auth.controller.js";
import requireAuth from "../middleware/auth.middleware.js";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login", (req: Request, res: Response) => {
    authController.login(req, res);
});

authRouter.post("/first-password", (req: Request, res: Response) => {
    authController.firstPassword(req, res);
});

authRouter.post("/register", requireAuth, (req: Request, res: Response) => {
    authController.register(req, res);
});

export default authRouter;