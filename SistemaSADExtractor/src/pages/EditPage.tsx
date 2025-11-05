import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Stepper from "../components/Stepper";
import ConfidenceBar from "../components/ConfidenceBar";
import styles from "./EditPage.module.css";
import govPeBadge from "@/assets/gov-pe-badge.png";
import clsx from "clsx";

/** Tipo de linha da tabela */
type Row = {
  id: number;
  name: string;
  extracted: number; // dados extraídos
  total: number;     // total esperado
  confidence: number; // 0..100
  action: "revisar" | "prosseguir" | "descartado";
  checked?: boolean;
  error?: boolean;    // para destacar linha em vermelho
};

/** Mock inicial — substitua pelo seu estado vindo da etapa 1 */
const initialRows: Row[] = [
  { id: 1, name: "Laudo_xxx.pdf", extracted: 12, total: 30, confidence: 40, action: "revisar" },
  { id: 2, name: "Laudo_xxx.pdf", extracted: 30, total: 30, confidence: 100, action: "prosseguir", checked: true },
  { id: 3, name: "Laudo_xxx.pdf", extracted: 21, total: 30, confidence: 70, action: "prosseguir", checked: true },
  { id: 4, name: "Laudo_xxx.pdf", extracted: 3,  total: 30, confidence: 10, action: "descartado", error: true },
];

export default function EditPage() {
  // paginação simples
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);

  // estado da tabela
  const [rows, setRows] = useState<Row[]>(initialRows);

  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const pageRows = useMemo(() => {
    const start = (page - 1) * perPage;
    return rows.slice(start, start + perPage);
  }, [rows, page, perPage]);

  const allChecked = rows.length > 0 && rows.every(r => r.checked);
  const selectedCount = rows.filter(r => r.checked).length;

  function toggleRow(id: number, checked: boolean) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, checked } : r));
  }

  function toggleAll(checked: boolean) {
    setRows(prev => prev.map(r => ({ ...r, checked })));
  }

  function removeRow(id: number) {
    setRows(prev => prev.filter(r => r.id !== id));
  }

  function removeSelected() {
    setRows(prev => prev.filter(r => !r.checked));
  }

  function validateSelected() {
    if (!selectedCount) return;
    // TODO: enviar para API de validação
    alert(`${selectedCount} laudo(s) enviados para validação.`);
  }

  function percent(r: Row) {
    return Math.round((r.extracted / r.total) * 100);
  }

  const navbarItems = useMemo(
    () => [
      { label: "Upload de documentos", href: "#upload" },
      { label: "Editar dados", href: "#", active: true },
      { label: "Histórico de Laudos", href: "#historico" },
    ],
    []
  );

  return (
    <div className={styles.page}>
      <Header
        rightSlot={
          <div className={styles.govRight}>
            <div className={styles.govText}>
              <span>Secretaria</span>
              <span className={styles.govTextLine}>de Administração</span>
            </div>
            <img src={govPeBadge} alt="Governo de Pernambuco" className={styles.govBadge}/>
          </div>
        }
      />

      <Navbar items={navbarItems} userName="Nome de usuário" />

      <main className={styles.main}>
        <div className={styles.container}>
          <Stepper current={2} subprogress={0} />

          <section className={styles.card}>
            <header className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Edição dos dados extraídos</h2>
              <p className={styles.cardSub}>
                Revise o resumo dos dados extraídos a partir dos laudos
              </p>
            </header>

            <div className={styles.tableWrap}>
              <div className={styles.tableHeader}>
                <span className={styles.tableTitle}>Tabela padrão</span>
              </div>

              <div className={styles.table}>
                <div className={clsx(styles.tr, styles.thead)}>
                  <div className={clsx(styles.th, styles.center)}>
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={(e) => toggleAll(e.target.checked)}
                      aria-label="Selecionar tudo"
                    />
                  </div>
                  <div className={clsx(styles.th, styles.center)}>ID</div>
                  <div className={styles.th}>Nome do arquivo</div>
                  <div className={clsx(styles.th, styles.center)}>Dados extraídos</div>
                  <div className={clsx(styles.th, styles.center)}>%</div>
                  <div className={clsx(styles.th, styles.center)}>Confiabilidade</div>
                  <div className={clsx(styles.th, styles.center)}>Ação recomendada</div>
                </div>

                {pageRows.map((r) => (
                  <div
                    key={r.id}
                    className={clsx(
                      styles.tr,
                      r.error && styles.rowError
                    )}
                  >
                    <div className={clsx(styles.td, styles.center)}>
                      <input
                        type="checkbox"
                        checked={!!r.checked}
                        onChange={(e) => toggleRow(r.id, e.target.checked)}
                        aria-label={`Selecionar ${r.name}`}
                      />
                    </div>

                    <div className={clsx(styles.td, styles.center)}>
                      {r.id}
                    </div>

                    <div className={styles.td}>
                      <a href="#" className={styles.fileLink}>
                        {r.name}
                      </a>
                      {r.action === "descartado" && <span className={styles.badgeDanger}>!</span>}
                      {r.action === "prosseguir" && <span className={styles.badgeOk}>●</span>}
                    </div>

                    <div className={clsx(styles.td, styles.center)}>
                      {r.extracted}/{r.total}
                    </div>

                    <div className={clsx(styles.td, styles.center)}>
                      {percent(r)}%
                    </div>

                    <div className={clsx(styles.td, styles.center)}>
                      <ConfidenceBar value={r.confidence} />
                    </div>

                    <div className={clsx(styles.td, styles.center, styles.actionCell)}>
                      <span
                        className={clsx(
                          styles.actionText,
                          r.action === "revisar" && styles.actionReview,
                          r.action === "prosseguir" && styles.actionGo,
                          r.action === "descartado" && styles.actionDiscard
                        )}
                      >
                        {r.action === "revisar" && "Revisar Campos"}
                        {r.action === "prosseguir" && "Prosseguir"}
                        {r.action === "descartado" && "Descartado"}
                      </span>

                      <button
                        className={styles.trashBtn}
                        title="Excluir"
                        onClick={() => removeRow(r.id)}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                          <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm-4 0h2v9H6V9zm8 0h2v9h-2V9z" fill="#ef4444"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* rodapé de seleção/ações rápidas */}
              <div className={styles.tableFooter}>
                <div className={styles.bulkLeft}>
                  <button
                    className={styles.linkBtn}
                    onClick={() => toggleAll(true)}
                  >
                    Selecionar tudo
                  </button>
                  <span className={styles.sep}>|</span>
                  <button
                    className={styles.linkBtn}
                    onClick={() => toggleAll(false)}
                  >
                    Excluir tudo
                  </button>
                </div>

                {/* Paginação */}
                <div className={styles.pagination}>
                  <label className={styles.itemsLabel}>
                    Itens por página
                    <select
                      className={styles.itemsSelect}
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setPage(1);
                      }}
                    >
                      <option value={4}>4</option>
                      <option value={8}>8</option>
                      <option value={12}>12</option>
                    </select>
                  </label>

                  <span className={styles.pageInfo}>
                    {rows.length ? `${(page - 1) * perPage + 1}-${Math.min(page * perPage, rows.length)} de ${rows.length}` : "0 de 0"}
                  </span>

                  <div className={styles.pager}>
                    <button
                      className={styles.pagerBtn}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      ‹
                    </button>
                    <span className={styles.pageNumber}>{page}</span>
                    <button
                      className={styles.pagerBtn}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* barra inferior de ações */}
            <div className={styles.bottomBar}>
              <div className={styles.selectedPill}>
                {selectedCount} laudo{selectedCount === 1 ? "" : "s"} selecionado{selectedCount === 1 ? "" : "s"}
              </div>

              <div className={styles.bottomActions}>
                <button
                  className={styles.btnGhost}
                  onClick={removeSelected}
                  disabled={!selectedCount}
                >
                  Remover selecionados
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={validateSelected}
                  disabled={!selectedCount}
                >
                  Validar Dados
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer year={2025} />
    </div>
  );
}
