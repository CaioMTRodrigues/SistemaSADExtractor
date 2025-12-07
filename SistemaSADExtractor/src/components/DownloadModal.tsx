import styles from "./DownloadModal.module.css";

type Props = {
  open: boolean;
  quantidade: number;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DownloadModal({ open, quantidade, onClose, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>×</button>

        <h2 className={styles.title}>Confirmar Download</h2>

        <p className={styles.msg}>
          Deseja baixar <strong>{quantidade}</strong> laudo(s) selecionado(s)?
        </p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>Cancelar</button>
          <button className={styles.confirm} onClick={onConfirm}>Baixar</button>
        </div>
      </div>
    </div>
  );
}
