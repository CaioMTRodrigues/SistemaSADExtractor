import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Stepper from "../components/Stepper";
import ConfidenceBar from "../components/ConfidenceBar";
import styles from "./EditPage.module.css";
import clsx from "clsx";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteLaudo, fetchLaudosByIds, type Laudo } from "../lib/api";
import ValidateDetailsModal from "../components/ValidateDetailsModal.module";

type Row = {
  id: string;
  name: string;
  extracted: number;
  total: number;
  confidence: number;
  action: "revisar" | "prosseguir" | "descartado";
  checked?: boolean;
  error?: boolean;
};

export default function EditPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const idsParam = searchParams.get("laudos");

  const navigate = useNavigate();
  const userType = useAuthStore((s) => s.userType);

  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const pageRows = useMemo(() => {
    const start = (page - 1) * perPage;
    return rows.slice(start, start + perPage);
  }, [rows, page, perPage]);

  const allChecked = rows.length > 0 && rows.every((r) => r.checked);
  const selectedCount = rows.filter((r) => r.checked).length;

  const laudoIds = useMemo(
    () => (idsParam ? idsParam.split(",").filter(Boolean) : []),
    [idsParam]
  );

  const TOTAL_CAMPOS_PADRAO = 20;

  function mapLaudosToRows(laudos: Laudo[]): Row[] {
    return laudos.map((l: Laudo) => {
      const total = TOTAL_CAMPOS_PADRAO;
      const extracted = l.qtd_campo_extraido - 1;
      const confi = (l.confiabilidade ?? 0) * 100;

      let action: Row["action"];
      if (confi < 30) action = "descartado";
      else if (confi < 90) action = "revisar";
      else action = "prosseguir";

      return {
        id: l.id,
        name: l.nome_arquivo,
        extracted,
        total,
        confidence: confi,
        action,
        checked: action === "prosseguir",
        error: action === "descartado",
      };
    });
  }

  useEffect(() => {
    if (!laudoIds.length) return;

    async function load() {
      setLoading(true);
      try {
        const laudos = await fetchLaudosByIds(laudoIds);
        const mapped = mapLaudosToRows(laudos);
        setRows(mapped);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [laudoIds]);

  function toggleRow(id: string, checked: boolean) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, checked } : r)));
  }

  function toggleAll(checked: boolean) {
    setRows((prev) => prev.map((r) => ({ ...r, checked })));
  }

  async function removeRow(id: string) {
    try {
      await deleteLaudo(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error("Erro ao deletar laudo:", e);
      alert("Erro ao excluir laudo. Tente novamente.");
    }
  }

  function removeSelected() {
    setRows((prev) => prev.filter((r) => !r.checked));
  }

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
                    />
                  </div>
                  <div className={clsx(styles.th, styles.center)}>ID</div>
                  <div className={styles.th}>Nome do arquivo</div>
                  <div className={clsx(styles.th, styles.center)}>
                    Dados extraídos
                  </div>
                  <div className={clsx(styles.th, styles.center)}>%</div>
                  <div className={clsx(styles.th, styles.center)}>
                    Confiabilidade
                  </div>
                  <div className={clsx(styles.th, styles.center)}>
                    Ação recomendada
                  </div>
                </div>

                {pageRows.map((r) => (
                  <div
                    key={r.id}
                    className={clsx(styles.tr, r.error && styles.rowError)}
                  >
                    <div className={clsx(styles.td, styles.center)}>
                      <input
                        type="checkbox"
                        checked={!!r.checked}
                        onChange={(e) => toggleRow(r.id, e.target.checked)}
                      />
                    </div>

                    <div className={clsx(styles.td, styles.center)}>
                      {r.id.substring(0, 8)}...
                    </div>

                    <div className={styles.td}>
                      <a href="#" className={styles.fileLink}>{r.name}</a>
                      {r.action === "descartado" && (
                        <span className={styles.badgeDanger}>!</span>
                      )}
                      {r.action === "prosseguir" && (
                        <span className={styles.badgeOk}>●</span>
                      )}
                    </div>

                    <div className={clsx(styles.td, styles.center)}>
                      {r.extracted}/{r.total}
                    </div>

                    <div className={clsx(styles.td, styles.center)}>
                      {r.confidence}%
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

                      <button className={styles.trashBtn} onClick={() => removeRow(r.id)}>
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <path
                            d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm-4 0h2v9H6V9zm8 0h2v9h-2V9z"
                            fill="#ef4444"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.tableFooter}>
                <div className={styles.bulkLeft}>
                  <button className={styles.linkBtn} onClick={() => toggleAll(true)}>
                    Selecionar tudo
                  </button>
                  <span className={styles.sep}>|</span>
                  <button className={styles.linkBtn} onClick={() => toggleAll(false)}>
                    Desselecionar todos
                  </button>
                </div>

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
                    {rows.length
                      ? `${(page - 1) * perPage + 1}-${Math.min(page * perPage, rows.length)} de ${rows.length}`
                      : "0 de 0"}
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
                  onClick={() => setModalOpen(true)}
                >
                  Validar Dados
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <ValidateDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => navigate(`/${userType}/exportar`)}
        nomeArquivo="Laudo_xxx.pdf"
        detalhes={{
          endereco: "Rua XXXXXXXX",
          numero: "000",
          bairro: "Bairro XXX",
          cidade: "Recife/PE",
          titulo1: null,
          titulo2: null,
          titulo3: null,
          area: null,
          valor: null
        }}
      />

      <Footer year={2025} />
    </div>
  );
}
