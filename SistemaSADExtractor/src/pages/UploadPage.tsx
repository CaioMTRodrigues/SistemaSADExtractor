import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Stepper from "../components/Stepper";
import UploadDropzone from "../components/UploadDropzone";
import styles from "./UploadPage.module.css";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { createLaudo } from "../lib/api"; // sua instância axios

type UIFile = { file: File; id: string };

// helper para converter File -> base64 (data URL)
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // gera "data:application/pdf;base64,...."
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<UIFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigateEdit = useNavigate();
  const userType = useAuthStore((s) => s.userType);

  // lê o usuário do localStorage
  const authUserRaw = localStorage.getItem("authUser");
  const authUser = authUserRaw ? JSON.parse(authUserRaw) : null; // JSON.parse é necessário porque foi salvo como string JSON [web:41]
  const userId = authUser?.id; // ajuste se o campo for diferente (ex: authUser.userId)

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
      { label: "Editar", href: `/${userType}/edit` },
      { label: "Exportar", href: `/${userType}/exportar` },
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
      base.push({
        label: "Configurações",
        href: `/${userType}/configuracoes`,
      });
    }

    return base;
  }, [userType]);

  async function carregarDados() {
    if (!userId) {
      console.error("Usuário não encontrado no localStorage.");
      return;
    }

    if (files.length === 0) return;

    try {
      setIsLoading(true);

      const createdIds: string[] = [];

      // Envia os laudos SEQUENCIALMENTE
      for (const { file } of files) {
        const base64 = await fileToBase64(file);

        // só passa pro próximo arquivo depois que essa chamada terminar
        const laudo = await createLaudo({
          userId,
          nome_arquivo: file.name,
          qtd_campo_extraido: 0,
          arquivo: base64,
        });

        createdIds.push(laudo.id);
      }

      const search = createSearchParams({
        laudos: createdIds.join(","), // "id1,id2,id3"
      }).toString();

      navigateEdit({
        pathname: `/${userType}/edit`,
        search: `?${search}`,
      });
    } catch (error) {
      console.error("Erro ao enviar laudos:", error);
      // tratar erro (toast, mensagem na tela, etc.)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <Header />

      <Navbar items={navbarItems} userName="Nome de usuário" />

      <main className={styles.main}>
        <div className={styles.container}>
          <Stepper current={stepCurrent} subprogress={stepSub} />

          <section className={styles.card}>
            <header className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Upload dos documentos</h2>
              <p className={styles.cardSub}>
                Faça Upload de arquivos PDF para extrair automaticamente os
                dados dos laudos desejados.
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
                      <span className={styles.name} title={file.name}>
                        {file.name}
                      </span>
                      <button
                        className={styles.clean}
                        onClick={() => removeFile(id)}
                        disabled={isLoading}
                      >
                        Limpar
                      </button>
                    </li>
                  ))}
                </ul>

                <div className={styles.actions}>
                  <button
                    className={styles.btnGhost}
                    onClick={clearAll}
                    disabled={isLoading}
                  >
                    Limpar tudo
                  </button>
                  <button
                    className={styles.btnPrimary}
                    onClick={carregarDados}
                    disabled={isLoading || files.length === 0}
                  >
                    {isLoading ? "Carregando..." : "Carregar Dados"}
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
