import React from "react";
import styles from "./Header.module.css";
import clsx from "clsx";

type HeaderProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  rightSlot?: React.ReactNode; // aqui você injeta o ícone do Governo de PE
};

const Header: React.FC<HeaderProps> = ({
  title = "SAD Extractor",
  subtitle = "Sistema de Extração de dados imobiliários",
  rightSlot,
  className,
}) => {
  return (
    <header className={clsx(styles.header, className)}>
      <div className={styles.container}>
        <div className={styles.left}>
          <LogoMark />
          <div className={styles.titleBlock}>
            <div className={styles.title}>{title}</div>
            <div className={styles.subtitle}>{subtitle}</div>
          </div>
        </div>

        <div className={styles.right}>
          {rightSlot /* selo/ícone que você passar */}
        </div>
      </div>
    </header>
  );
};

export default Header;

/* Ícone simples do app (place­holder) */
function LogoMark() {
  return (
    <svg
      aria-hidden
      className={styles.logoMark}
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect width="24" height="24" rx="6" fill="white" opacity="0.15" />
      <path
        d="M12 3v10m0 0 4-4m-4 4-4-4M5 17h14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
