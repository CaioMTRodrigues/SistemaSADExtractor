import { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import styles from "./HistoricoPage.module.css";
import { useAuthStore } from "../store/useAuthStore";

type Row = {
  id: string;
  endereco: string;
  coordS: string;
  coordW: string;
  conservacao: string;
  valor: string;
  data: string;
  checked?: boolean;
};

const mockData: Row[] = [
  {
    id: "LA 000 SAD/XXX",
    endereco: "Rua XXXX XXXX",
    coordS: "0°00'00.0''S",
    coordW: "0°00'00.0''W",
    conservacao: "Ótimo",
    valor: "R$ X.xxx.xxx,xx",
    data: "20/04/2025",
    checked: false,
  },
  {
    id: "LA 001 SAD/YY",
    endereco: "Avenida ABC 123",
    coordS: "1°00'00.0''S",
    coordW: "1°00'00.0''W",
    conservacao: "Ruim",
    valor: "R$ X.xxx.xxx,xx",
    data: "05/05/2025",
    checked: false,
  },
  {
    id: "LA 002 SAD/ZZ",
    endereco: "Travessa 90",
    coordS: "2°00'00.0''S",
    coordW: "2°00'00.0''W",
    conservacao: "Regular",
    valor: "R$ X.xxx.xxx,xx",
    data: "11/05/2025",
    checked: false,
  },
];

export default function HistoricoPage() {
  const userType = useAuthStore((s) => s.userType);

  const [rows, setRows] = useState<Row[]>(mockData);
  const [searchId, setSearchId] = useState("");
  const [searchEndereco, setSearchEndereco] = useState("");
  const [searchCoord, setSearchCoord] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 4;

  const navbarItems = useMemo(() => {
    const base = [
      { label: "Upload de Documentos", href: `/${userType}/upload` },
      { label: "Editar Dados", href: `/${userType}/edit` },
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
      base.push({
        label: "Configurações",
        href: `/${userType}/configuracoes`,
      });
    }
  
    return base;
  }, [userType]);
  


  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      return (
        r.id.toLowerCase().includes(searchId.toLowerCase()) &&
        r.endereco.toLowerCase().includes(searchEndereco.toLowerCase()) &&
        (r.coordS + " " + r.coordW).toLowerCase().includes(searchCoord.toLowerCase()) &&
        r.data.includes(searchDate)
      );
    });
  }, [rows, searchId, searchEndereco, searchCoord, searchDate]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / perPage));
  const pageRows = filteredRows.slice((page - 1) * perPage, page * perPage);

  const allChecked = filteredRows.length > 0 && filteredRows.every(r => r.checked);
  const selectedCount = filteredRows.filter(r => r.checked).length;

  function toggleRow(id: string, checked: boolean) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, checked } : r));
  }

  function toggleAll(checked: boolean) {
    setRows(prev => prev.map(r => ({ ...r, checked })));
  }

  function removeSelected() {
    setRows(prev => prev.filter(r => !r.checked));
  }

  return (
    <div className={styles.page}>
      <Header
      />

      <Navbar items={navbarItems} userName="Nome de usuário" />

      <main className={styles.main}>
        <div className={styles.container}>
          <h2 className={styles.title}>Histórico de Laudos</h2>
          <p className={styles.subtitle}>Visualização dos dados de todos os laudos que foram extraídos ao longo do tempo.</p>

          {/* FILTROS */}
          <div className={styles.filters}>
            <input
              placeholder="Nº do documento"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <input
              placeholder="Endereço"
              value={searchEndereco}
              onChange={(e) => setSearchEndereco(e.target.value)}
            />
            <input
              placeholder="Coordenadas"
              value={searchCoord}
              onChange={(e) => setSearchCoord(e.target.value)}
            />
            <input
              placeholder="Data de extração (ex: 05/05/2025)"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <button className={styles.searchBtn}>Pesquisar</button>
          </div>

          {/* TABELA */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Tabela padrão</span>
            </div>

            <div className={styles.table}>
              <div className={styles.tr}>
                <div className={styles.th}>
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={(e) => toggleAll(e.target.checked)}
                  />
                </div>
                <div className={styles.th}>Nº do documento</div>
                <div className={styles.th}>Endereço</div>
                <div className={styles.th}>Coord. (S)</div>
                <div className={styles.th}>Coord. (W)</div>
                <div className={styles.th}>Conservação</div>
                <div className={styles.th}>Valor</div>
                <div className={styles.th}>Data</div>
              </div>

              {pageRows.map((r) => (
                <div key={r.id} className={styles.tr}>
                  <div className={styles.td}>
                    <input
                      type="checkbox"
                      checked={!!r.checked}
                      onChange={(e) => toggleRow(r.id, e.target.checked)}
                    />
                  </div>
                  <div className={styles.td}>{r.id}</div>
                  <div className={styles.td}>{r.endereco}</div>
                  <div className={styles.td}>{r.coordS}</div>
                  <div className={styles.td}>{r.coordW}</div>
                  <div className={styles.td}>{r.conservacao}</div>
                  <div className={styles.td}>{r.valor}</div>
                  <div className={styles.td}>{r.data}</div>
                </div>
              ))}
            </div>

            {/* PAGINAÇÃO */}
            <div className={styles.pagination}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
              <span>{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
            </div>
          </div>

          {/* AÇÕES */}
          <div className={styles.bottomBar}>
            <div className={styles.selectedPill}>
              {selectedCount} laudo(s) selecionado(s)
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
                disabled={!selectedCount}
                onClick={() => alert("Baixando laudos...")}
              >
                Baixar laudos
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer year={2025} />
    </div>
  );
}
