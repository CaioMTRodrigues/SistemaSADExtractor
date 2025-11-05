import React from "react";
import styles from "./Navbar.module.css";
import clsx from "clsx";

type Item = { label: string; href?: string; active?: boolean };

type Props = {
  items?: Item[];
  userName?: string;
  rightBadge?: React.ReactNode; // se quiser colocar algo entre o menu e o usuário
  className?: string;
};

const defaultItems: Item[] = [
  { label: "Upload de documentos", href: "#", active: true },
  { label: "Editar dados", href: "#" },
  { label: "Histórico de Laudos", href: "#" },
];

const Navbar: React.FC<Props> = ({
  items = defaultItems,
  userName = "Nome de usuário",
  rightBadge,
  className,
}) => {
  return (
    <nav className={clsx(styles.nav, className)}>
      <div className={styles.inner}>
        {/* menu esquerdo */}
        <div className={styles.menu}>
          {items.map((it, i) => (
            <React.Fragment key={it.label}>
              <a
                href={it.href}
                className={clsx(styles.link, it.active && styles.active)}
              >
                {it.label}
              </a>
              {i < items.length - 1 && <span className={styles.sep}>|</span>}
            </React.Fragment>
          ))}
        </div>

        {/* (opcional) algo no meio */}
        {rightBadge && <div className={styles.rightBadge}>{rightBadge}</div>}

        {/* usuário à direita (mesma barra) */}
        <div className={styles.user}>
          <span className={styles.greet}>
            Olá, <strong>{userName}</strong>
          </span>
          <button className={styles.profileBtn} title="Abrir menu de usuário">
            <div className={styles.avatar}>TT</div>
            <svg viewBox="0 0 20 20" fill="currentColor" className={styles.chev}>
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
