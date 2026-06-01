import React from "react";
import { useUI, type CardInfo } from "../store/ui.js";

const apps: CardInfo[] = [
  { id: "finnish-quiz", title: "Finnish Quiz", kind: "app" },
  { id: "dice-math", title: "Dice Math", kind: "app" },
  { id: "chatbot", title: "Chatbot", kind: "app" },
];

export default function AppsPage() {
  const openCard = useUI((s) => s.openCard);

  return (
    <div>
      <h2>Apps</h2>
      <div className="cards-grid">
        {apps.map((app) => (
          <div
            key={app.id}
            className="card"
            onClick={() => openCard(app)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                openCard(app);
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
