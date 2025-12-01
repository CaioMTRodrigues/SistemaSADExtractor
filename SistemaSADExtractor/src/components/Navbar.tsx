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

  // Recupera dados do usuário logado do localStorage
  const userStr = localStorage.getItem("authUser") || "";
  const user = JSON.parse(userStr);
    
    

  const displayName = user?.name || userName;
  // Avatar: usa as iniciais do nome, ou "TT" se não houver nome
  const avatar = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "TT";

  const [showMenu, setShowMenu] = React.useState(false);

  function go(href: string) {
    if (href && href !== "#") navigate(href);
  }

  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("authRole");
    navigate("/login");
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
            Olá, <strong>{displayName}</strong>
          </span>
          <div className={styles.profileBtn}>
            <div className={styles.avatar}>{avatar}</div>
            <button
              type="button"
              className={styles.chevBtn}
              onClick={() => setShowMenu((v) => !v)}
              title="Abrir menu de perfil"
              style={{ background: "none", border: "none", padding: 0, marginLeft: 4, cursor: "pointer" }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className={styles.chev}>
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {showMenu && (
              <div className={styles.profileMenu}>
                <button
                  type="button"
                  className={styles.logoutBtn}
                  onClick={logout}
                  title="Sair"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
