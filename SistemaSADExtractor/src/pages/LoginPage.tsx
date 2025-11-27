import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tipos = [
  { label: "cadastro@sad.pe.gov.br" },
  { label: "gestor@sad.pe.gov.br" },
  { label: "admin@sad.pe.gov.br" },
];

  const navigate = useNavigate();
  const setUserType = useAuthStore((s) => s.setUserType);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    let tipo: "cadastro" | "gestor" | "admin" | "" = "";
    if (email === "cadastro@sad.pe.gov.br") tipo = "cadastro";
    if (email === "gestor@sad.pe.gov.br") tipo = "gestor";
    if (email === "admin@sad.pe.gov.br") tipo = "admin";

    setUserType(tipo);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/${tipo}/upload`);
    }, 600);
  }

  return (
    <div className={styles.page}>
      <Header
      />

      <main className={styles.main}>
        <div className={styles.cardWrap}>
          <div className={styles.card}>
            <h1 className={styles.cardTitle}>Extractor - Acesso</h1>
            <div className={styles.separator} />

            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.field}>
                <label className={styles.label}>Tipo de usuário</label>
                <div className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  >
                    <option value="">Selecionar</option>
                    {tipos.map((t) => (
                      <option key={t.label} value={t.label}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={styles.chevron} />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="senha" className={styles.label}>
                  Senha
                </label>
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

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}
