import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { apps } from "../data/cards.js";
import Card from "../components/Card.js";

export default function AppsPage() {
  const navigate = useNavigate();
  const openApp = (id: string) =>
    navigate({ to: "/app/$appId", params: { appId: id } });

  return (
    <div>
      <h2>Apps</h2>
      <div className="cards-grid">
        {apps.map((app) => (
          <Card key={app.id} card={app} onOpen={openApp} />
        ))}
      </div>
    </div>
  );
}
