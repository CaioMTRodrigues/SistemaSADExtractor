import { Router, Request, Response } from "express";
import UserController from "./user.controller.js";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/login", (req: Request, res: Response) => {
    userController.login(req, res);
});

userRouter.post("/logout", (req: Request, res: Response) => {
    userController.logout(req, res);
});

userRouter.post("/register", (req: Request, res: Response) => {
    userController.register(req, res);
});

export default userRouter;