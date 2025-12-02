import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { login } from "../lib/api";
import type { AuthState } from "../store/useAuthStore";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const setUserType = useAuthStore((s) => s.setUserType);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const data = await login(email, senha);
      const role: string = data.role ? data.role.toLowerCase() : "";
      // Salva token e user no localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("authRole", role);

      // Salva role no store, se existir
      const allowedRoles = ["cadastro", "gestor", "admin"];
      const mappedRole = allowedRoles.includes(role)
        ? role
        : "";
      setUserType(mappedRole as AuthState["userType"]);
      // Redireciona apenas se role for válido
      if (mappedRole) {
        navigate(`/${mappedRole}/upload`);
      } else {
        setError("Usuário sem permissão ou role inválida.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro de conexão com o servidor");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.cardWrap}>
          <div className={styles.card}>
            <h1 className={styles.cardTitle}>Extractor - Acesso</h1>
            <div className={styles.separator} />
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="senha" className={styles.label}>Senha</label>
                <input
                  id="senha"
                  type="password"
                  className={styles.input}
                  placeholder="********"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  minLength={4}
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting || !email || !senha}
                className={styles.submit}
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </button>
              <p className={styles.forgot}>
                Esqueceu a senha?{" "}
                <a href="#recuperar" className={styles.link}>
                  Clique aqui
                </a>
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer year={2025} />
    </div>
  );
};

export default LoginPage;