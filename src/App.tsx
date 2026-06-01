import React, { useEffect } from "react";
import Header from "./components/Header/Header.js";
import Separator from "./components/Separator/Separator.js";
import AppsPage from "./pages/AppsPage.js";
import DetailPage from "./pages/DetailPage.js";
import ProjectsPage from "./pages/ProjectsPage.js";
import { useUI } from "./store/ui.js";

export default function App() {
  const activePage = useUI((s) => s.activePage);
  const theme = useUI((s) => s.theme);
  const selectedCard = useUI((s) => s.selectedCard);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (selectedCard) {
    return (
      <div className="app-shell">
        <DetailPage card={selectedCard} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header />
      <div className="main-body">
        <div className="pages-container">
          {activePage === "apps" ? <AppsPage /> : <ProjectsPage />}
        </div>
        <Separator />
      </div>
    </div>
  );
}
