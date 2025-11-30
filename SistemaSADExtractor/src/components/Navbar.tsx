import React from "react";
import styles from "./Navbar.module.css";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

type Item = { label: string; href: string; active?: boolean };

type Props = {
  items?: Item[];
  userName?: string;
  className?: string;
};

export default function Navbar({ items = [], userName = "Nome de usuário", className }: Props) {
  const navigate = useNavigate();

  function go(href: string) {
    if (href && href !== "#") navigate(href);
  }

  return (
    <nav className={clsx(styles.nav, className)}>
      <div className={styles.inner}>
        <div className={styles.menu}>
          {items.map((it, i) => (
            <React.Fragment key={i}>
              <button
                onClick={() => go(it.href)}
                className={clsx(styles.link, it.active && styles.active)}
              >
                {it.label}
              </button>
              {i < items.length - 1 && <span className={styles.sep}>|</span>}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.user}>
          <span className={styles.greet}>
            Olá, <strong>{userName}</strong>
          </span>
          <div className={styles.profileBtn}>
            <div className={styles.avatar}>TT</div>
            <svg viewBox="0 0 20 20" fill="currentColor" className={styles.chev}>
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
}
