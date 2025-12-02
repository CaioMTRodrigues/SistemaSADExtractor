import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./LoginPage.module.css";
import { createPassword } from "../lib/api"; // vamos definir já já

const CreatePasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token"); // /create-password?token=...

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token inválido ou ausente.");
      return;
    }

    if (password.length < 4) {
      setError("A senha deve ter pelo menos 4 caracteres.");
      return;
    }

    if (password !== confirm) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createPassword({ token, password });
      navigate("/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ?? "Erro ao criar senha.";
      setError(msg);
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.cardWrap}>
          <div className={styles.card}>
            <h1 className={styles.cardTitle}>Criar senha</h1>
            <div className={styles.separator} />
            <form className={styles.form} onSubmit={onSubmit}>
              {!token && (
                <p className={styles.error}>
                  Link inválido ou expirado.
                </p>
              )}

              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>
                  Nova senha
                </label>
                <input
                  id="password"
                  type="password"
                  className={styles.input}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={4}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="confirm" className={styles.label}>
                  Confirmar senha
                </label>
                <input
                  id="confirm"
                  type="password"
                  className={styles.input}
                  placeholder="********"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={4}
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting || !token}
                className={styles.submit}
              >
                {isSubmitting ? "Salvando..." : "Criar senha"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer year={2025} />
    </div>
  );
};

export default CreatePasswordPage;
