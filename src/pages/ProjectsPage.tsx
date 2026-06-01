import React from "react";
import { useUI, type CardInfo } from "../store/ui.js";

const projects: CardInfo[] = [
  {
    id: "project-a",
    title: "Project A",
    kind: "project",
    description: "A sample project placeholder.",
  },
  {
    id: "project-b",
    title: "Project B",
    kind: "project",
    description: "A sample project placeholder.",
  },
  {
    id: "project-c",
    title: "Project C",
    kind: "project",
    description: "A sample project placeholder.",
  },
];

export default function ProjectsPage() {
  const openCard = useUI((s) => s.openCard);

  return (
    <div>
      <h2>Projects</h2>
      <div className="cards-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className="card"
            onClick={() => openCard(project)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                openCard(project);
              }
            }}
          >
            {project.title}
          </div>
        ))}
      </div>
    </div>
  );
}
