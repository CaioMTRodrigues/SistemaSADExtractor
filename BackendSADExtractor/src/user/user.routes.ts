import { Router, Request, Response } from "express";
import UserController from "./user.controller.js";
import { requireRole } from "../middleware/auth.middleware.js";

const userRouter = Router();
const userController = new UserController();

/**
 * Admin routes
 */
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
export default userRouter;