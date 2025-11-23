import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Stepper from "../components/Stepper";
import UploadDropzone from "../components/UploadDropzone";
import styles from "./UploadPage.module.css";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

type UIFile = { file: File; id: string };

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<UIFile[]>([]);
  const navigateEdit = useNavigate();
  const userType = useAuthStore((s) => s.userType);

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

  const stepCurrent = 1;
  const stepSub = files.length > 0 ? 1 : 0;

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


  function carregarDados() {
    navigateEdit(`/${userType}/edit`);
  }

  return (
    <div className={styles.page}>
      <Header
      />

      <Navbar items={navbarItems} userName="Nome de usuário" />

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

export default UploadPage;
