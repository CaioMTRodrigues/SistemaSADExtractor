import express from "express";
import cors from "cors";
import morgan from "morgan";
import { FRONTEND_URL, PORT } from "./lib/env.js";

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
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SAD Extractor Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
