import styles from "./ExportModal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  quantidade: number;
  formato: string;
};

export default function ExportModal({ open, onClose, onConfirm, quantidade, formato }: Props) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Confirmar Exportação</h2>

        <p className={styles.text}>
          Você está prestes a exportar <strong>{quantidade}</strong> laudo(s) no formato:
        </p>

        <p className={styles.format}>{formato.toUpperCase()}</p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>

          <button className={styles.confirm} onClick={onConfirm}>
            Confirmar Exportação
          </button>
        </div>
      </div>
    </div>
  );
}
