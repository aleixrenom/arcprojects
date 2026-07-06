import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { type CardInfo } from "../store/ui.js";
import QuizApp from "../apps/light-quiz";

type DetailPageProps = {
  card: CardInfo;
};

const appComponents: Record<string, React.ComponentType> = {
  "finnish-quiz": QuizApp,
};

export default function DetailPage({ card }: DetailPageProps) {
  const navigate = useNavigate();
  const AppComponent = appComponents[card.id];

  return (
    <main
      className="detail-shell"
      style={{ viewTransitionName: `card-${card.kind}-${card.id}` }}
    >
      <div className="detail-header">
        <button
          className="detail-back"
          type="button"
          onClick={() => navigate({ to: "/" })}
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
        {AppComponent ? (
          <AppComponent />
        ) : (
          <>
            <p className="detail-meta">
              {card.kind === "app" ? "App" : "Project"} page
            </p>
            <p className="detail-meta">
              This is a placeholder detail page for{" "}
              <strong>{card.title}</strong>. It is intentionally blank for now
              so it can later host app content or arbitrary project information.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
