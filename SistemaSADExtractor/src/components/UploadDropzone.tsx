import React, { useCallback, useRef, useState } from "react";
import styles from "./UploadDropzone.module.css";

type Props = {
  onFiles?: (files: File[]) => void;
  accept?: string; // ex: ".pdf,.doc,.docx"
};

const UploadDropzone: React.FC<Props> = ({
  onFiles,
  accept = ".pdf,.doc,.docx",
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOver, setIsOver] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const files = Array.from(fileList);
      onFiles?.(files);
    },
    [onFiles]
  );

  return (
    <div
      className={`${styles.drop} ${isOver ? styles.over : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          inputRef.current?.click();
        }
      }}
      onClick={() => inputRef.current?.click()}
    >
      <UploadIcon />
      <p className={styles.primary}>
        Arraste os arquivos aqui ou{" "}
        <span className={styles.link}>clique para selecionar</span>
      </p>
      <p className={styles.secondary}>Formatos suportados: PDF, DOCx</p>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className={styles.hidden}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export default UploadDropzone;

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden>
      <path
        d="M12 16V4m0 0l4 4m-4-4L8 8M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
        stroke="#0E5BD7"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
