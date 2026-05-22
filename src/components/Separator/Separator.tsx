import React from "react";
import styles from "./Separator.module.css";
import { useUI } from "../../store/ui";

export default function Separator() {
  const activePage = useUI((s) => s.activePage);
  const setPage = useUI((s) => s.setActivePage);

  const onClick = () => setPage(activePage === "apps" ? "projects" : "apps");

  return (
    <div
      className={styles.separator}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.label}>
        {activePage === "apps" ? "projects" : "apps"}
      </div>
      <div className={styles.chev}>›</div>
    </div>
  );
}
