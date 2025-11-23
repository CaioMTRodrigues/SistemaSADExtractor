import { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Stepper from "../components/Stepper";
import styles from "./ConfiguracoesPage.module.css";
import { useAuthStore } from "../store/useAuthStore";
import clsx from "clsx";

type UserRow = {
    id: number;
    name: string;
    email: string;
    role: string;
    lastAccess: string;
    totalAccess: number;
};

const mockRows: UserRow[] = [
    { id: 4, name: "Nome e sobrenome", email: "email4@sad.pe.gov.br", role: "Cadastro", lastAccess: "10/07/2025", totalAccess: 5 },
    { id: 3, name: "Nome e sobrenome", email: "email3@sad.pe.gov.br", role: "Gestão", lastAccess: "17/07/2025", totalAccess: 10 },
    { id: 2, name: "Nome e sobrenome", email: "email2@sad.pe.gov.br", role: "Cadastro", lastAccess: "15/07/2025", totalAccess: 2 },
    { id: 1, name: "Nome e sobrenome", email: "email1@sad.pe.gov.br", role: "Cadastro", lastAccess: "18/07/2025", totalAccess: 10 },
];

export default function ConfiguracoesPage() {
    const userType = useAuthStore((s) => s.userType);

    const [rows] = useState(mockRows);
    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "",
    });

    const navbarItems = useMemo(() => {
  const base = [
    { label: "Upload de Documentos", href: `/${userType}/upload` },
    { label: "Editar Dados", href: `/${userType}/edit` },
    { label: "Exportar Dados", href: `/${userType}/exportar` },
    { label: "Histórico de Laudos", href: `/${userType}/historico` },
  ];

  if (userType === "gestor" || userType === "admin") {
    base.push(
      { label: "Histórico de Usuários", href: `/${userType}/historico-usuarios` },
      { label: "Indicadores", href: `/${userType}/indicadores` }
    );
  }

  if (userType === "admin") {
    base.push({ label: "Configurações", href: `/${userType}/configuracoes` });
  }

  return base;
}, [userType]);


    function handleCreate() {
        if (!form.name || !form.email || !form.role) {
            alert("Preencha todos os campos.");
            return;
        }
        alert("Usuário criado (mock)");
    }

    return (
        <div className={styles.page}>
            <Header
            />

            <Navbar items={navbarItems} userName="Nome de usuário" />

            <main className={styles.main}>
                <div className={styles.container}>
                    <Stepper current={0} subprogress={0} />

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
                                        <div className={styles.td}>{String(r.id).padStart(2, "0")}</div>
                                        <div className={styles.td}>{r.name}</div>
                                        <div className={styles.td}>{r.email}</div>
                                        <div className={styles.td}>{r.role}</div>
                                        <div className={styles.td}>{r.lastAccess}</div>
                                        <div className={styles.td}>{String(r.totalAccess).padStart(2, "0")}</div>

                                        <div className={clsx(styles.td, styles.actionCell)}>
                                            <button className={styles.btnRed}>Inativar</button>
                                            <button className={styles.btnYellow}>Editar</button>
                                            <button className={styles.btnBlue}>Reenviar e-mail</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer year={2025} />
        </div>
    );
}
