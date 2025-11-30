import { create } from "zustand";

type AuthState = {
  userType: "" | "cadastro" | "gestor" | "admin";
  setUserType: (type: AuthState["userType"]) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userType: "",
  setUserType: (type) => set({ userType: type }),
}));
