import { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Stepper from "../components/Stepper";
import ConfidenceBar from "../components/ConfidenceBar";
import ExportModal from "../components/ExportModal";
import ErrorModal from "../components/ErrorModal";
import styles from "./ExportarPage.module.css";
import clsx from "clsx";
import { useAuthStore } from "../store/useAuthStore";

type Row = {
  id: number;
  name: string;
  extracted: number;
  total: number;
  confidence: number;
  action: "prosseguir";
  checked?: boolean;
};

const initialRows: Row[] = [
  { id: 1, name: "Laudo_xxx.pdf", extracted: 12, total: 12, confidence: 100, action: "prosseguir" },
  { id: 2, name: "Laudo_xxx.pdf", extracted: 5, total: 10, confidence: 50, action: "prosseguir" },
  { id: 3, name: "Laudo_xxx.pdf", extracted: 1, total: 10, confidence: 10, action: "prosseguir" }
];

export default function ExportarPage() {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const userType = useAuthStore((s) => s.userType);

  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const pageRows = useMemo(() => {
    const start = (page - 1) * perPage;
    return rows.slice(start, start + perPage);
  }, [rows, page, perPage]);

  const allChecked = rows.length > 0 && rows.every((r) => r.checked);
  const selectedCount = rows.filter((r) => r.checked).length;

  function toggleRow(id: number, checked: boolean) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, checked } : r)));
  }

  function toggleAll(checked: boolean) {
    setRows((prev) => prev.map((r) => ({ ...r, checked })));
  }

  function percent(r: Row) {
    return Math.round((r.extracted / r.total) * 100);
  }

  const navbarItems = useMemo(() => {
    const base = [
      { label: "Upload de Documentos", href: `/${userType}/upload` },
      { label: "Editar", href: `/${userType}/edit` },
      { label: "Exportar", href: `/${userType}/exportar` },
      { label: "Histórico de Laudos", href: `/${userType}/historico` }
    ];

    if (userType === "gestor" || userType === "admin") {
      base.push(
        { label: "Histórico de Usuários", href: `/${userType}/historico-usuarios` },
        { label: "Indicadores", href: `/${userType}/indicadores` }
      );
    }

    if (userType === "admin") {
      base.push({
        label: "Configurações",
        href: `/${userType}/configuracoes`
      });
    }

    return base;
  }, [userType]);

  function exportar() {
    if (!selectedCount) {
      setErrorMessage("Você precisa selecionar ao menos um laudo para exportar.");
      setErrorOpen(true);
      return;
    }

    if (!selectedFormat) {
      setErrorMessage("Selecione um formato antes de continuar.");
      setErrorOpen(true);
      return;
    }

    setModalOpen(true);
  }

  function confirmarExportacao() {
    setModalOpen(false);
  }

  return (
    <div className={styles.page}>
      <Header />
      <Navbar items={navbarItems} userName="Nome de usuário" />

      <main className={styles.main}>
        <div className={styles.container}>
          <Stepper current={3} subprogress={0} />

          <section className={styles.card}>
            <header className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Exportação dos Laudos validados</h2>
              <p className={styles.cardSub}>Exporte os dados que foram validados no formato que desejar</p>
            </header>

            <div className={styles.tableWrap}>
              <div className={styles.tableHeader}>
                <span className={styles.tableTitle}>Tabela padrão</span>
              </div>

              <div className={styles.table}>
                <div className={clsx(styles.tr, styles.thead)}>
                  <div className={clsx(styles.th, styles.center)}>
                    <input type="checkbox" checked={allChecked} onChange={(e) => toggleAll(e.target.checked)} />
                  </div>
                  <div className={clsx(styles.th, styles.center)}>ID</div>
                  <div className={styles.th}>Nome do arquivo</div>
                  <div className={clsx(styles.th, styles.center)}>Dados extraídos</div>
                  <div className={clsx(styles.th, styles.center)}>%</div>
                  <div className={clsx(styles.th, styles.center)}>Confiabilidade</div>
                  <div className={clsx(styles.th, styles.center)}>Ação recomendada</div>
                </div>

                {pageRows.map((r) => (
                  <div key={r.id} className={styles.tr}>
                    <div className={clsx(styles.td, styles.center)}>
                      <input type="checkbox" checked={!!r.checked} onChange={(e) => toggleRow(r.id, e.target.checked)} />
                    </div>

                    <div className={clsx(styles.td, styles.center)}>{r.id}</div>

                    <div className={styles.td}>
                      <a href="#" className={styles.fileLink}>{r.name}</a>
                    </div>

                    <div className={clsx(styles.td, styles.center)}>
                      {r.extracted}/{r.total}
                    </div>

                    <div className={clsx(styles.td, styles.center)}>{percent(r)}%</div>

                    <div className={clsx(styles.td, styles.center)}>
                      <ConfidenceBar value={r.confidence} />
                    </div>

                    <div className={clsx(styles.td, styles.center, styles.actionCell)}>
                      <span className={styles.actionGo}>Prosseguir</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.tableFooter}>
                <button className={styles.linkBtn} onClick={() => toggleAll(true)}>
                  Selecionar tudo
                </button>
              </div>
            </div>

            <div className={styles.bottomBar}>
              <div className={styles.selectedPill}>
                {selectedCount} laudo{selectedCount === 1 ? "" : "s"} selecionado{selectedCount === 1 ? "" : "s"}
              </div>

              <div className={styles.exportBox}>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Selecionar formato</option>
                  <option value="xlsx">Excel (.xlsx)</option>
                  <option value="pdf">PDF (.pdf)</option>
                </select>

                <button className={styles.btnPrimary} onClick={exportar}>
                  Baixar laudos
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <ExportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmarExportacao}
        quantidade={selectedCount}
        formato={selectedFormat}
      />

      <ErrorModal
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />

      <Footer year={2025} />
    </div>
  );
}
