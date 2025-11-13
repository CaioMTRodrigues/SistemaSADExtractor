import express from "express";
import cors from "cors";
import morgan from "morgan";
import { FRONTEND_URL, PORT } from "./lib/env.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import authRouter from "./auth/auth.routes.js";
import userRouter from "./user/user.routes.js";

const app = express();
const corsOptions = {
  origin: [FRONTEND_URL],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  headers: "Content-Type, Authorization, Content-Length, X-Requested-With",
};
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("SAD Extractor Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
