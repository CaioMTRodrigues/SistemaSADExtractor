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

export type UserFromApi = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "GESTOR" | "CADASTRO"; // ou string
  emailVerified: boolean;
  image: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FetchUsersResponse = {
  page: number;
  limit: number;
  users: UserFromApi[];
};

export type CreateUserPayload = {
  name: string;
  email: string;
  role: string;
};

export type UserDto = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastAccess: string;
  totalAccess: number;
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

export async function fetchUsers(page: number = 1, limit: number = 5): Promise<FetchUsersResponse> {
  const res = await api.get("/user", {
    params: { page, limit } }); // ajuste a rota pro que tiver no seu backend
  return res.data;
}

export async function createUser(payload: CreateUserPayload) {
  const res = await api.post("/auth/register", payload); // ajuste a rota
  return res.data; // idealmente retorna o usuário criado
}

export async function inactivateUser(userId: string): Promise<void> {
  await api.delete(`/user/${userId}`); // ajuste para sua rota
}

export async function updateUserApi(
  userId: string,
  payload: { name?: string; email?: string; role?: string }
): Promise<UserDto> {
  const res = await api.put(`/user/${userId}`, payload);
  return res.data;
}

export async function resendFirstPassword(userId: string) {
  const res = await api.post(`/auth/resend-first-password/${userId}`);
  return res.data; 
}

export async function createPassword(payload: { token: string; password: string }) {
  const res = await api.post("/auth/first-password", payload);
  return res.data;
}

// Função esqueci minha senha
export async function forgotPassword(email: string) {
  // Envia o e-mail no corpo da requisição para a rota criada no backend
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
}

export default api;
