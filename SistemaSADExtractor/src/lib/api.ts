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

// Adiciona o token de autorização em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export type CreateLaudoPayload = {
  userId: string;
  nome_arquivo: string;
  qtd_campo_extraido: number;
  arquivo: string | null;
};

// Exemplo de função para login
export async function login(email: string, senha: string) {
  const response = await api.post("/auth/login", { email, senha });
  return response.data;
}

export async function createLaudo(payload: CreateLaudoPayload) {
  const response = await api.post("/user/laudo", payload);
  return response.data;
}

export default api;
