import React, { useEffect, useRef, useState } from "react";
import Header from "./components/Header/Header.js";
import Separator from "./components/Separator/Separator.js";
import AppsPage from "./pages/AppsPage.js";
import DetailPage from "./pages/DetailPage.js";
import ProjectsPage from "./pages/ProjectsPage.js";
import { useUI } from "./store/ui.js";

export default function App() {
  const activePage = useUI((s) => s.activePage);
  const setActivePage = useUI((s) => s.setActivePage);
  const theme = useUI((s) => s.theme);
  const selectedCard = useUI((s) => s.selectedCard);

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    swipeStartX.current = event.clientX;
    swipeStartY.current = event.clientY;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      !isDragging ||
      swipeStartX.current === null ||
      event.pointerType !== "touch"
    )
      return;
    const deltaX = event.clientX - swipeStartX.current;
    const deltaY = event.clientY - (swipeStartY.current ?? event.clientY);

    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (activePage === "apps") {
      setDragOffset(Math.min(0, Math.max(deltaX, -120)));
    } else {
      setDragOffset(Math.max(0, Math.min(deltaX, 120)));
    }
  };

  const finishSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || swipeStartX.current === null) return;

    const deltaX = event.clientX - swipeStartX.current;
    const deltaY = event.clientY - (swipeStartY.current ?? event.clientY);

    setIsDragging(false);
    setDragOffset(0);
    swipeStartX.current = null;
    swipeStartY.current = null;

    if (Math.abs(deltaX) < 60 || Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (activePage === "apps" && deltaX < 0) {
      setActivePage("projects");
    } else if (activePage === "projects" && deltaX > 0) {
      setActivePage("apps");
    }
  };

  if (selectedCard) {
    return (
      <div className="app-shell">
        <DetailPage card={selectedCard} />
      </div>
    );
  }

  const pageTranslate = activePage === "apps" ? "0%" : "-50%";
  const scrollerStyle = {
    transform: `translateX(calc(${pageTranslate} + ${dragOffset}px))`,
  };

  return (
    <div className="app-shell">
      <Header />
      <div
        className={`main-body ${
          activePage === "projects" ? "separator-left" : "separator-right"
        }`}
      >
        <div
          className="pages-container"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishSwipe}
          onPointerCancel={finishSwipe}
        >
          <div
            className={`pages-scroller ${isDragging ? "dragging" : ""}`}
            style={scrollerStyle}
          >
            <div
              className={`page-panel ${activePage === "apps" ? "active" : ""}`}
              aria-hidden={activePage !== "apps"}
              inert={activePage !== "apps" ? true : undefined}
            >
              <AppsPage />
            </div>
            <div
              className={`page-panel ${
                activePage === "projects" ? "active" : ""
              }`}
              aria-hidden={activePage !== "projects"}
              inert={activePage !== "projects" ? true : undefined}
            >
              <ProjectsPage />
            </div>
          </div>
        </div>
        <Separator />
      </div>
    </div>
  );
}
