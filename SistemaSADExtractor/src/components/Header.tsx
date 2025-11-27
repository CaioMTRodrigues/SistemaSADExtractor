import styles from "./Header.module.css";
import clsx from "clsx";
import govPeBadge from "../assets/gov-pe-badge.png";

type HeaderProps = {
  className?: string;
};

export default function Header({ className }: HeaderProps) {
  return (
    <header className={clsx(styles.header, className)}>
      <div className={styles.container}>
        <div className={styles.left}>
          <LogoMark />
          <div className={styles.titleBlock}>
            <div className={styles.title}>SAD Extractor</div>
            <div className={styles.subtitle}>Sistema de Extração de dados imobiliários</div>
          </div>
        </div>

        <div className={styles.right}>
          
          <img src={govPeBadge} className={styles.govBadge} alt="Governo de Pernambuco" />
        </div>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <svg className={styles.logoMark} viewBox="0 0 24 24" fill="none">
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
