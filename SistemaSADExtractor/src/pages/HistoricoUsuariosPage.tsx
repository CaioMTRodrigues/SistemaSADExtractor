import { useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import styles from "./HistoricoUsuariosPage.module.css";
import { useAuthStore } from "../store/useAuthStore";

type LogRow = {
  usuario: string;
  acao: string;
  laudo: string;
  data: string;
};

const mockRows: LogRow[] = [
  { usuario: "User_01", acao: "Editou laudo", laudo: "LA 000 SAD/XXX", data: "18/07/2025" },
  { usuario: "User_02", acao: "Extraiu novo laudo", laudo: "LA 000 SAD/XXX", data: "17/07/2025" },
  { usuario: "User_03", acao: "Excluiu laudo", laudo: "LA 000 SAD/XXX", data: "18/07/2025" },
  { usuario: "User_02", acao: "Editou laudo", laudo: "LA 000 SAD/XXX", data: "17/07/2025" },
];

export default function HistoricoUsuariosPage() {
  const userType = useAuthStore((s) => s.userType);

  const navbarItems = useMemo(() => {
    const base = [
      { label: "Upload de Documentos", href: `/${userType}/upload` },
      { label: "Editar", href: `/${userType}/edit` },
      { label: "Exportar", href: `/${userType}/exportar` },
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

  return (
    <div className={styles.page}>
      <Header />

      <Navbar items={navbarItems} userName="Nome de usuário" />

      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.card}>
            <header className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Histórico dos usuários</h2>
              <p className={styles.cardSub}>Log das ações dos usuários ativos</p>
            </header>

            <div className={styles.tableWrap}>
              <div className={styles.tableHeader}>
                <span className={styles.tableTitle}>Tabela padrão</span>
              </div>

              <div className={styles.table}>
                <div className={`${styles.tr} ${styles.thead}`}>
                  <div className={styles.th}>Usuário</div>
                  <div className={styles.th}>Ação</div>
                  <div className={styles.th}>Nome do laudo</div>
                  <div className={styles.th}>Data da modificação</div>
                </div>

                {mockRows.map((row, idx) => (
                  <div key={idx} className={styles.tr}>
                    <div className={styles.td}>{row.usuario}</div>
                    <div className={styles.td}>{row.acao}</div>
                    <div className={styles.td}>{row.laudo}</div>
                    <div className={styles.td}>{row.data}</div>
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
