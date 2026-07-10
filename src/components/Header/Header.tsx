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
          src="/images/cvpic_sqr.jpeg"
          alt="Aleix"
          className={styles.photo}
        />
        <div>
          <div className={styles.name}>Aleix Renom Cisa</div>
          <div className={styles.tagline}>Having fun making stuff</div>
        </div>
      </div>
      <div className={styles.right}>
        <button
          className={styles.icon}
          aria-label={
            theme === "light" ? "Switch to dark theme" : "Switch to light theme"
          }
          onClick={toggleTheme}
        >
          <svg
            className={styles.themeIcon}
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
            focusable="false"
          >
            <mask id="theme-toggle-moon-mask">
              <rect x="0" y="0" width="24" height="24" fill="#fff" />
              <circle className={styles.moonBite} fill="#000" />
            </mask>
            <circle
              className={styles.sunCore}
              cx="12"
              cy="12"
              fill="currentColor"
              mask="url(#theme-toggle-moon-mask)"
            />
            <g
              className={styles.sunRays}
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              <line x1="12" y1="4" x2="12" y2="1.5" />
              <line x1="12" y1="20" x2="12" y2="22.5" />
              <line x1="4" y1="12" x2="1.5" y2="12" />
              <line x1="20" y1="12" x2="22.5" y2="12" />
              <line x1="17.66" y1="6.34" x2="19.42" y2="4.58" />
              <line x1="6.34" y1="6.34" x2="4.58" y2="4.58" />
              <line x1="17.66" y1="17.66" x2="19.42" y2="19.42" />
              <line x1="6.34" y1="17.66" x2="4.58" y2="19.42" />
            </g>
          </svg>
        </button>
      </div>
    </header>
  );
}
