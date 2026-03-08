import { Car } from "lucide-react";
import styles from "../styles/Footer.module.css";

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <Car color="white" size={24} />
        <span className={styles.logoText}>DriveDirect</span>
      </div>
      <p className={styles.copyright}>
        © 2026 DriveDirect Szakdolgozat Projekt. Minden jog fenntartva.
      </p>
    </div>
  </footer>
);

export default Footer;
