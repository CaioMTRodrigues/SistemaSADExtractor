import React from "react";
import styles from "./Footer.module.css";
import clsx from "clsx";

type FooterProps = {
  owner?: string;
  year?: number;
  className?: string;
};

const Footer: React.FC<FooterProps> = ({
  owner = "Secretaria de Administração de Pernambuco",
  year = new Date().getFullYear(),
  className,
}) => {
  return (
    <footer className={clsx(styles.footer, className)}>
      <div className={styles.container}>
        ©Todos os direitos reservados à {owner} - {year}
      </div>
    </footer>
  );
};

export default Footer;
