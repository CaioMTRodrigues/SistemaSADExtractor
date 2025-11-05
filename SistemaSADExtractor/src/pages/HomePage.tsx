import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Stepper from "../components/Stepper";
import UploadDropzone from "../components/UploadDropzone";
import styles from "./HomePage.module.css";
import govPeBadge from "../assets/gov-pe-badge.png";

type UIFile = { file: File; id: string };

const HomePage: React.FC = () => {
  const [files, setFiles] = useState<UIFile[]>([]);

  function addFiles(newOnes: File[]) {
    setFiles((prev) => [
      ...prev,
      ...newOnes.map((f) => ({ file: f, id: crypto.randomUUID() })),
    ]);
  }
  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }
  function clearAll() {
    setFiles([]);
  }

  // Stepper: etapa 1 (Upload). subprogress 0..1 = 1 quando já tem arquivo.
  const stepCurrent = 1;
  const stepSub = files.length > 0 ? 1 : 0;

  const items = useMemo(
    () => [
      { label: "Upload de documentos", href: "#", active: true },
      { label: "Editar dados", href: "#" },
      { label: "Histórico de Laudos", href: "#" },
    ],
    []
  );

  function carregarDados() {
    // TODO: chamar backend p/ processar
    alert(`Carregando ${files.length} arquivo(s)...`);
  }

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

      {/* navbar com menu + usuário na mesma barra */}
      <Navbar items={items} userName="Nome de usuário" />

      <main className={styles.main}>
        <div className={styles.container}>
          <Stepper current={stepCurrent} subprogress={stepSub} />

          <section className={styles.card}>
            <header className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Upload dos documentos</h2>
              <p className={styles.cardSub}>
                Faça Upload de arquivos PDF para extrair automaticamente os dados dos laudos desejados.
              </p>
            </header>

            <UploadDropzone onFiles={addFiles} />

            {/* Lista de arquivos */}
            {files.length > 0 && (
              <div className={styles.fileList}>
                <div className={styles.fileListTitle}>Nomes dos arquivos</div>
                <ul className={styles.ul}>
                  {files.map(({ file, id }) => (
                    <li key={id} className={styles.li}>
                      <span className={styles.ok}>✓</span>
                      <span className={styles.name} title={file.name}>{file.name}</span>
                      <button className={styles.clean} onClick={() => removeFile(id)}>
                        Limpar
                      </button>
                    </li>
                  ))}
                </ul>

                <div className={styles.actions}>
                  <button className={styles.btnGhost} onClick={clearAll}>Limpar tudo</button>
                  <button
                    className={styles.btnPrimary}
                    onClick={carregarDados}
                  >
                    Carregar Dados
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer year={2025} />
    </div>
  );
};

export default HomePage;
