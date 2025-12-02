import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import styles from "./ConfiguracoesPage.module.css";
import { useAuthStore } from "../store/useAuthStore";
import clsx from "clsx";
import {
  createUser,
  fetchUsers,
  inactivateUser,
  resendFirstPassword,
} from "../lib/api";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastAccess: string;
  totalAccess: number;
};

type ApiRole = "ADMIN" | "GESTOR" | "CADASTRO";

const roleUiToApi: Record<string, ApiRole> = {
  Cadastro: "CADASTRO",
  Gestão: "GESTOR",
  Administrador: "ADMIN",
};

const roleApiToUi: Record<ApiRole, string> = {
  ADMIN: "Administrador",
  GESTOR: "Gestão",
  CADASTRO: "Cadastro",
};

export default function ConfiguracoesPage() {
  const userType = useAuthStore((s) => s.userType);

  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchUsers();
        setRows(
          data.users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: roleApiToUi[u.role as ApiRole] ?? u.role,
            lastAccess: "-",
            totalAccess: 0, // ajustar quando tiver essa info
          }))
        );
      } catch (e) {
        console.error(e);
        setError("Erro ao carregar usuários.");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const navbarItems = useMemo(() => {
    const base = [
      { label: "Upload de Documentos", href: `/${userType}/upload` },
      { label: "Editar Dados", href: `/${userType}/edit` },
      { label: "Exportar Dados", href: `/${userType}/exportar` },
      { label: "Histórico de Laudos", href: `/${userType}/historico` },
    ];

    if (userType === "gestor" || userType === "admin") {
      base.push(
        {
          label: "Histórico de Usuários",
          href: `/${userType}/historico-usuarios`,
        },
        { label: "Indicadores", href: `/${userType}/indicadores` }
      );
    }

    if (userType === "admin") {
      base.push({ label: "Configurações", href: `/${userType}/configuracoes` });
    }

    return base;
  }, [userType]);

  async function handleCreate() {
    if (!form.name || !form.email || !form.role) {
      alert("Preencha todos os campos.");
      return;
    }

    const apiRole = roleUiToApi[form.role];
    if (!apiRole) {
      alert("Função inválida.");
      return;
    }

    try {
      const created = await createUser({
        name: form.name,
        email: form.email,
        role: apiRole, // vai ADMIN | GESTOR | CADASTRO pro backend
      });

      setRows((prev) => [
        {
          id: created.user.id,
          name: created.user.name,
          email: created.user.email,
          role: roleApiToUi[created.user.role as ApiRole] ?? created.user.role,
          lastAccess: created.user.lastAccess ?? "-",
          totalAccess: created.user.totalAccess ?? 0,
        },
        ...prev,
      ]);

      setForm({ name: "", email: "", role: "" });
    } catch (e) {
      console.error(e);
      alert("Erro ao criar usuário.");
    }
  }

  async function handleInactivate(id: string) {
    try {
      await inactivateUser(id);
      setRows((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      console.error(e);
      alert("Erro ao inativar usuário.");
    }
  }

  async function handleResendEmail(id: string) {
    try {
      const res = await resendFirstPassword(id);
      alert(res.message ?? "E-mail reenviado com sucesso.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data?.message ??
        "Erro ao reenviar e-mail de criação de senha.";
      alert(msg);
    }
  }

  return (
    <div className={styles.page}>
      <Header />

      <Navbar items={navbarItems} userName="Nome de usuário" />

      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.card}>
            <header className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Configurações dos usuários</h2>
              <p className={styles.cardSub}>
                Configurações e cadastros dos usuários no sistema
              </p>
            </header>

            {/* FORM */}
            <div className={styles.formGrid}>
              <div>
                <label className={styles.label}>Nome</label>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className={styles.label}>E-mail</label>
                <input
                  className={styles.input}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className={styles.label}>Função</label>
                <select
                  className={styles.select}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="">Selecione o cargo</option>
                  <option value="Cadastro">Cadastro</option>
                  <option value="Gestão">Gestão</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div className={styles.formButtonArea}>
                <button className={styles.btnPrimary} onClick={handleCreate}>
                  Criar
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className={styles.tableWrap}>
              <div className={styles.tableHeader}>
                <span className={styles.tableTitle}>Tabela padrão</span>
              </div>
              {/* estados de carregamento/erro */}
              {loading && <p className={styles.info}>Carregando usuários...</p>}

              {error && !loading && <p className={styles.error}>{error}</p>}

              {!loading && !error && rows.length === 0 && (
                <p className={styles.info}>Nenhum usuário encontrado.</p>
              )}

              {!loading && !error && rows.length > 0 && (
                <div className={styles.table}>
                  <div className={clsx(styles.tr, styles.thead)}>
                    <div className={styles.th}>ID</div>
                    <div className={styles.th}>Nome</div>
                    <div className={styles.th}>E-mail</div>
                    <div className={styles.th}>Tipo</div>
                    <div className={styles.th}>Último acesso</div>
                    <div className={styles.th}>Total de acessos</div>
                    <div className={styles.th}>Ações</div>
                  </div>

                  {rows.map((r) => (
                    <div key={r.id} className={styles.tr}>
                      <div className={styles.td} title={r.id}>
                        {r.id.substring(0, 8)}...
                      </div>
                      <div className={styles.td}>{r.name}</div>
                      <div className={styles.td}>{r.email}</div>
                      <div className={styles.td}>{r.role}</div>
                      <div className={styles.td}>{r.lastAccess}</div>
                      <div className={styles.td}>
                        {String(r.totalAccess).padStart(2, "0")}
                      </div>
                      <div className={clsx(styles.td, styles.actionCell)}>
                        <button
                          className={styles.btnRed}
                          onClick={() => handleInactivate(r.id)}
                          disabled={loading}
                        >
                          Inativar
                        </button>
                        <button className={styles.btnYellow} disabled={loading}>
                          Editar
                        </button>
                        <button
                          className={styles.btnBlue}
                          onClick={() => handleResendEmail(r.id)}
                          disabled={loading}
                        >
                          Reenviar e-mail
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer year={2025} />
    </div>
  );
}
