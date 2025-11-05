import React from "react";
import styles from "./TopbarUser.module.css";

type Props = {
  userName?: string;
};

const TopbarUser: React.FC<Props> = ({ userName = "Nome de usuário" }) => {
  return (
    <div className={styles.topbar}>
      <div className={styles.wrap}>
        <div className={styles.greet}>
          Olá, <span className={styles.bold}>{userName}</span>
        </div>
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
  );
};

export default TopbarUser;
