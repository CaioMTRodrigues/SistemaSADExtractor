import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";          // <- precisa existir
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
