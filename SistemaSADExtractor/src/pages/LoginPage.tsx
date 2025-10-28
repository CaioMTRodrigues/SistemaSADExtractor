import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./LoginPage.module.css";

/* Se o SVG estiver em src/assets */
import govPeBadge from "../assets/gov-pe-badge.png";

/* Se preferir em public/, troque por:
   <img src="/gov-pe-badge.svg" ... />
*/

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emails = [
    { label: "Selecionar", value: "" },
    { label: "usuario@pe.gov.br", value: "usuario@pe.gov.br" },
    { label: "admin@pe.gov.br", value: "admin@pe.gov.br" },
  ];

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: integrar com API real
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Login simulado 😄");
    }, 600);
  }

  return (
    <div className={styles.page}>
      <Header
        rightSlot={
          <div className={styles.govRight}>
            <div className={styles.govText}>
              <span>Secretaria</span>
              <span className={styles.govTextLine}>de Administração</span>
            </div>
            <img
              src={govPeBadge}
              alt="Governo de Pernambuco"
              className={styles.govBadge}
            />
          </div>
        }
      />

      <main className={styles.main}>
        <div className={styles.cardWrap}>
          <div className={styles.card}>
            <h1 className={styles.cardTitle}>Extractor - Acesso</h1>
            <div className={styles.separator} />

            <form className={styles.form} onSubmit={onSubmit}>
              {/* E-mail */}
              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  E-mail
                </label>
                <div className={styles.selectWrap}>
                  <select
                    id="email"
                    className={styles.select}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  >
                    {emails.map((opt) => (
                      <option key={opt.label} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={styles.chevron} />
                </div>
              </div>

              {/* Senha */}
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

              {/* Ações */}
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

/* ícone do dropdown */
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
