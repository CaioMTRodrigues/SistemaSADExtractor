import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Define as permissões de cada role
// const rolePermissions: Record<string, string[]> = {
//   admin: ["admin", "gestor", "cadastro"],
//   gestor: ["gestor", "cadastro"],
//   cadastro: ["cadastro"],
// };

// Função para checar se pode acessar a rota
function canAccess(role: string, route: string) {
  if (!role) return false;
  if (route.startsWith("/admin")) return role === "admin";
  if (route.startsWith("/gestor")) return ["admin", "gestor"].includes(role);
  if (route.startsWith("/cadastro")) return ["admin", "gestor", "cadastro"].includes(role);
  return true; // rotas públicas
}

// Componente de proteção de rota
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const role = localStorage.getItem("authRole") || "";
  const pathname = location.pathname;

  if (!canAccess(role, pathname)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
