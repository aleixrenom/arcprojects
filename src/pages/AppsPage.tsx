import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { apps } from "../data/cards.js";

export default function AppsPage() {
  const navigate = useNavigate();
  const openApp = (id: string) =>
    navigate({ to: "/app/$appId", params: { appId: id } });

  return (
    <div>
      <h2>Apps</h2>
      <div className="cards-grid">
        {apps.map((app) => (
          <div
            key={app.id}
            className="card"
            onClick={() => openApp(app.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                openApp(app.id);
              }
            }}
          >
            {app.title}
          </div>
        ))}
      </div>
    </div>
  );
}
