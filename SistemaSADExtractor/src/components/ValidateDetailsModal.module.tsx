import styles from "./ValidateDetailsModal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nomeArquivo: string;
  detalhes: {
    endereco: string;
    numero: string;
    bairro: string;
    cidade: string;
    titulo1: string | null;
    titulo2: string | null;
    titulo3: string | null;
    area: string | null;
    valor: string | null;
  };
};

export default function ValidateDetailsModal({
  open,
  onClose,
  onConfirm,
  nomeArquivo,
  detalhes
}: Props) {
  if (!open) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h2 className={styles.title}>Detalhes do Arquivo {nomeArquivo}</h2>
            <p className={styles.subtitle}>
              Informações que o sistema conseguiu extrair do documento
            </p>
          </div>

          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Dados sobre endereço</h3>

          <div className={styles.grid}>
            <div>
              <div className={styles.label}>Endereço</div>
              <div className={styles.value}>{detalhes.endereco}</div>
            </div>

            <div>
              <div className={styles.label}>N°</div>
              <div className={styles.value}>{detalhes.numero}</div>
            </div>

            <div>
              <div className={styles.label}>Bairro</div>
              <div className={styles.value}>{detalhes.bairro}</div>
            </div>

            <div>
              <div className={styles.label}>Cidade</div>
              <div className={styles.value}>{detalhes.cidade}</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Dados financeiros</h3>

          <div className={styles.grid}>
            <div>
              <div className={styles.label}>Área (m²)</div>
              <div className={styles.value}>
                {detalhes.area ?? <span className={styles.notFound}>Não encontrado</span>}
              </div>
            </div>

            <div>
              <div className={styles.label}>Valor do Imóvel</div>
              <div className={styles.value}>
                {detalhes.valor ?? <span className={styles.notFound}>Não encontrado</span>}
              </div>
            </div>

            <div>
              <div className={styles.label}>Título</div>
              <div className={styles.value}>
                {detalhes.titulo1 ?? <span className={styles.notFound}>Não encontrado</span>}
              </div>
            </div>

            <div>
              <div className={styles.label}>Título</div>
              <div className={styles.value}>
                {detalhes.titulo2 ?? <span className={styles.notFound}>Não encontrado</span>}
              </div>
            </div>

            <div>
              <div className={styles.label}>Título</div>
              <div className={styles.value}>
                {detalhes.titulo3 ?? <span className={styles.notFound}>Não encontrado</span>}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.btnPrimary} onClick={onConfirm}>
            Validar Dados
          </button>
        </div>
      </div>
    </div>
  );
}
