import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { projects } from "../data/cards.js";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const openProject = (id: string) =>
    navigate({ to: "/project/$projectId", params: { projectId: id } });

  return (
    <div>
      <h2>Projects</h2>
      <div className="cards-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className="card"
            onClick={() => openProject(project.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                openProject(project.id);
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
