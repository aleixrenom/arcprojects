import React from "react";
import styles from "./Header.module.css";
import { useUI } from "../../store/ui";

export default function Header() {
  const theme = useUI((s) => s.theme);
  const toggleTheme = useUI((s) => s.toggleTheme);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img
          src="/assets/photo-placeholder.png"
          alt="Aleix"
          className={styles.photo}
        />
        <div>
          <div className={styles.name}>Aleix Renom Cisa</div>
          <div className={styles.tagline}>Frontend • Tools • Helsinki</div>
        </div>
      </div>
      <div className={styles.right}>
        <button
          className={styles.icon}
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === "light" ? "🌞" : "🌙"}
        </button>
      </div>
    </header>
  );
}
