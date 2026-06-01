import React from "react";
import { useUI, type CardInfo } from "../store/ui.js";

type DetailPageProps = {
  card: CardInfo;
};

export default function DetailPage({ card }: DetailPageProps) {
  const closeCard = useUI((s) => s.closeCard);

  return (
    <main className="detail-shell">
      <div className="detail-header">
        <button
          className="detail-back"
          type="button"
          onClick={closeCard}
          aria-label="Back"
          title="Back"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M16 20l-8-8 8-8"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="detail-header-title">{card.title}</h1>
      </div>
      <div className="detail-content">
        <p className="detail-meta">
          {card.kind === "app" ? "App" : "Project"} page
        </p>
        <p className="detail-meta">
          This is a placeholder detail page for <strong>{card.title}</strong>.
          It is intentionally blank for now so it can later host app content or
          arbitrary project information.
        </p>
      </div>
    </main>
  );
}
