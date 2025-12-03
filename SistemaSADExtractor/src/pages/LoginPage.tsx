import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
// Importe a nova função forgotPassword aqui
import { login, forgotPassword } from "../lib/api"; 
import type { AuthState } from "../store/useAuthStore";

const LoginPage: React.FC = () => {
  // Estados do Login
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Estados do Modal de Recuperação
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();
  const setUserType = useAuthStore((s) => s.setUserType);

  // Função de Login (Mantida igual a original, apenas limpando logs se quiser)
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const data = await login(email, senha);
      const role: string = data.role ? data.role.toLowerCase() : "";
      
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("authRole", role);

      const allowedRoles = ["cadastro", "gestor", "admin"];
      const mappedRole = allowedRoles.includes(role) ? role : "";
      setUserType(mappedRole as AuthState["userType"]);
      
      if (mappedRole) {
        navigate(`/${mappedRole}/upload`);
      } else {
        setError("Usuário sem permissão ou role inválida.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro de conexão com o servidor");
      }
    } finally {
        setIsSubmitting(false);
    }
  }

  // Nova função para processar o "Esqueci minha senha"
  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetEmail) return;

    setIsResetting(true);
    setResetMessage({ type: "", text: "" });

    try {
      await forgotPassword(resetEmail);
      setResetMessage({ 
        type: "success", 
        text: "Se o e-mail existir, um link de redefinição foi enviado!" 
      });
      setResetEmail(""); // Limpa o campo
    } catch (err: any) {
      setResetMessage({ 
        type: "error", 
        text: err.message || "Erro ao tentar enviar e-mail." 
      });
    } finally {
      setIsResetting(false);
    }
  }

  // Função para abrir o modal e resetar estados
  const openModal = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que a âncora recarregue a página
    setShowModal(true);
    setResetMessage({ type: "", text: "" });
    setResetEmail("");
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.cardWrap}>
          <div className={styles.card}>
            <h1 className={styles.cardTitle}>Extractor - Acesso</h1>
            <div className={styles.separator} />
            
            {/* Formulário de Login */}
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
                {/* Alterado para chamar a função openModal */}
                <a href="#recuperar" className={styles.link} onClick={openModal}>
                  Clique aqui
                </a>
              </p>
            </form>
          </div>
        </div>

        {/* --- MODAL DE RECUPERAÇÃO DE SENHA --- */}
        {showModal && (
          <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
            {/* stopPropagation evita que clicar dentro do modal feche ele */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.modalTitle}>Recuperar Senha</h2>
              
              {resetMessage.type === "success" ? (
                <div className={styles.successMessage}>
                    <p>{resetMessage.text}</p>
                    <button 
                        className={styles.buttonCancel} 
                        style={{marginTop: '10px', width: '100%', background: 'white'}}
                        onClick={() => setShowModal(false)}
                    >
                        Fechar
                    </button>
                </div>
              ) : (
                <>
                  <p className={styles.modalText}>
                    Digite seu e-mail abaixo para receber um link de redefinição.
                  </p>
                  <form onSubmit={handleForgotPassword}>
                    <div className={styles.field}>
                      <label htmlFor="resetEmail" className={styles.label}>E-mail cadastrado</label>
                      <input
                        id="resetEmail"
                        type="email"
                        className={styles.input}
                        placeholder="exemplo@email.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    {resetMessage.type === "error" && (
                        <p className={styles.error} style={{marginBottom: '1rem'}}>{resetMessage.text}</p>
                    )}

                    <div className={styles.modalActions}>
                      <button
                        type="button"
                        className={styles.buttonCancel}
                        onClick={() => setShowModal(false)}
                        disabled={isResetting}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className={styles.submit}
                        style={{ width: 'auto', marginTop: 0 }}
                        disabled={isResetting || !resetEmail}
                      >
                        {isResetting ? "Enviando..." : "Enviar Link"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer year={2025} />
    </div>
  );
};

export default LoginPage;