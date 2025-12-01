import { create } from "zustand";

export type AuthState = {
  userType: "" | "cadastro" | "gestor" | "admin";
  setUserType: (type: AuthState["userType"]) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userType: "",
  setUserType: (type) => set({ userType: type }),
}));
