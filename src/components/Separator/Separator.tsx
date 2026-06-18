import React from "react";
import styles from "./Separator.module.css";
import { useUI } from "../../store/ui";

export default function Separator() {
  const activePage = useUI((s) => s.activePage);
  const setPage = useUI((s) => s.setActivePage);

  const onClick = () => setPage(activePage === "apps" ? "projects" : "apps");
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  const nextPageLabel = activePage === "apps" ? "projects" : "apps";
  const arrow = activePage === "apps" ? "›" : "‹";
  const positionClass = activePage === "projects" ? styles.left : styles.right;

  return (
    <div
      className={`${styles.separator} ${positionClass}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Switch to ${nextPageLabel}`}
    >
      <div className={styles.label}>{nextPageLabel}</div>
      <div className={styles.chev}>{arrow}</div>
    </div>
  );
}
