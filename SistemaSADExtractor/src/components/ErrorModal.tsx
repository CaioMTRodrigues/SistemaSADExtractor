import styles from "./ErrorModal.module.css";

type Props = {
  open: boolean;
  message: string;
  onClose: () => void;
};

export default function ErrorModal({ open, message, onClose }: Props) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Ação não permitida</h2>

        <p className={styles.text}>{message}</p>

        <div className={styles.actions}>
          <button className={styles.confirm} onClick={onClose}>
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
