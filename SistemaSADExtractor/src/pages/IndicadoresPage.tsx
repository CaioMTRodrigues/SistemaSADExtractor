import { useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import styles from "./IndicadoresPage.module.css";
import { useAuthStore } from "../store/useAuthStore";

export default function IndicadoresPage() {
    const userType = useAuthStore((s) => s.userType);

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
    base.push({ label: "Configurações", href: `/${userType}/configuracoes` });
  }

  return base;
}, [userType]);


    return (
        <div className={styles.page}>
            <Header
            />

            <Navbar items={navbarItems} userName="Nome de usuário" />

            <main className={styles.main}>
                <div className={styles.container}>


                    <section className={styles.card}>
                        <header>
                            <h2 className={styles.cardTitle}>Painel de Indicadores</h2>
                            <p className={styles.cardSub}>
                                Principais métricas e acompanhamentos sobre os dados extraídos dos laudos
                            </p>
                        </header>


                        <div className={styles.metricsGrid}>
                            <MetricCard title="Total de Laudos" value="126.560" footer="Daily  +12.843" color="#3b82f6" />
                            <MetricCard title="Visitas" value="8.846" footer="Daily  +1.224" color="#8b5cf6" />
                            <MetricCard title="Pagamentos" value="6.560" footer="Conversão 49%" color="#0ea5e9" />
                            <MetricCard title="Eficiência Operacional" value="78%" footer="W-o-W 12%" color="#10b981" />
                        </div>


                        <div className={styles.chartSection}>
                            <div className={styles.chartHeader}>
                                <button className={styles.chartTabActive}>Laudos</button>
                                <button className={styles.chartTab}>Visitas</button>
                            </div>

                            <div className={styles.chartArea}>
                                <div className={styles.fakeChart}>
                                    <div className={styles.bar} style={{ height: "60%" }}></div>
                                    <div className={styles.bar} style={{ height: "90%" }}></div>
                                    <div className={styles.bar} style={{ height: "70%" }}></div>
                                    <div className={styles.bar} style={{ height: "40%" }}></div>
                                    <div className={styles.bar} style={{ height: "85%" }}></div>
                                    <div className={styles.bar} style={{ height: "50%" }}></div>
                                    <div className={styles.bar} style={{ height: "30%" }}></div>
                                    <div className={styles.bar} style={{ height: "95%" }}></div>
                                    <div className={styles.bar} style={{ height: "80%" }}></div>
                                    <div className={styles.bar} style={{ height: "60%" }}></div>
                                    <div className={styles.bar} style={{ height: "100%" }}></div>
                                    <div className={styles.bar} style={{ height: "75%" }}></div>
                                </div>

                                <div className={styles.rankingBox}>
                                    <h4 className={styles.rankTitle}>Ranking</h4>

                                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                                        <div key={n} className={styles.rankItem}>
                                            <span className={styles.rankNumber}>{n}</span>
                                            <span>Usuário {n}</span>
                                            <strong>323,234</strong>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer year={2025} />
        </div>
    );
}

function MetricCard({ title, value, footer, color }: any) {
    return (
        <div className={styles.metricCard}>
            <div className={styles.metricTitle}>{title}</div>
            <div className={styles.metricValue}>{value}</div>
            <div className={styles.metricBar}>
                <div className={styles.metricBarFill} style={{ background: color }}></div>
            </div>
            <div className={styles.metricFooter}>{footer}</div>
        </div>
    );
}
