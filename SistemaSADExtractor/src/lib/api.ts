import axios from "axios";
import { BACKEND } from "./env";

// Configuração geral do axios
const api = axios.create({
  baseURL: BACKEND, // ajuste para a URL do seu backend se necessário
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Exemplo de função para login
export async function login(email: string, senha: string) {
  const response = await api.post("/auth/login", { email, senha });
  return response.data;
}

export default api;
