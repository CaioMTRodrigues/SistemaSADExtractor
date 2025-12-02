import { Router, Request, Response } from "express";
import UserController from "./user.controller.js";
import { requireRole } from "../middleware/auth.middleware.js";

const userRouter = Router();
const userController = new UserController();

/**
 * Admin routes
 */
userRouter.get("/laudos", requireRole("CADASTRO", "GESTOR", "ADMIN"), (req: Request, res: Response) => {
    userController.getLaudosByIds(req, res);
});

userRouter.get("/:id", requireRole("ADMIN"), (req: Request, res: Response) => {
    userController.getUserById(req, res);
});

userRouter.get("/", requireRole("ADMIN"), (req: Request, res: Response) => {
    userController.getUsers(req, res);
});

userRouter.put("/:id", requireRole("ADMIN"), (req: Request, res: Response) => {
    userController.updateUser(req, res);
});

userRouter.delete("/:id", requireRole("ADMIN"), (req: Request, res: Response) => {
    userController.deleteUser(req, res);
});

/**
 * Gestor routes
 */

userRouter.get("/historico-edicoes", requireRole("GESTOR", "ADMIN"), (req: Request, res: Response) => {
    userController.getEdicoes(req, res);
});

/**
 * Cadastro routes
 */

userRouter.post("/laudo", requireRole("CADASTRO", "GESTOR", "ADMIN"), (req: Request, res: Response) => {
    userController.createLaudo(req, res);
});

userRouter.delete("/laudo/:id", requireRole("CADASTRO", "GESTOR", "ADMIN"), (req: Request, res: Response) => {
    userController.deleteLaudo(req, res);
});

userRouter.post("/extracao", requireRole("CADASTRO", "GESTOR", "ADMIN"), (req: Request, res: Response) => {
    userController.createExtracao(req, res);
});

userRouter.post("/exportacao", requireRole("CADASTRO", "GESTOR", "ADMIN"), (req: Request, res: Response) => {
    userController.createExportacao(req, res);
});

export default userRouter;