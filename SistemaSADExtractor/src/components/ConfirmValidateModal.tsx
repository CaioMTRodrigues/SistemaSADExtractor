import React from "react";
import styles from "./ConfirmValidateModal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmValidateModal({ open, onClose, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span>Confirmar Ação</span>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.body}>
          <p className={styles.title}>Tem certeza que deseja validar os dados dos laudos?</p>
          <p className={styles.warning}>Uma vez validado não será possível editar o laudo</p>

          <button className={styles.confirmBtn} onClick={onConfirm}>
            Validar Dados
          </button>
        </div>
      </div>
    </div>
  );
}
