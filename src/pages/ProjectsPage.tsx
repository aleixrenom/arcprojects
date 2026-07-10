import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { projects } from "../data/cards.js";
import Card from "../components/Card.js";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const openProject = (id: string) =>
    navigate({ to: "/project/$projectId", params: { projectId: id } });

  return (
    <div>
      <h2>Projects</h2>
      <div className="cards-grid">
        {projects.map((project) => (
          <Card key={project.id} card={project} onOpen={openProject} />
        ))}
      </div>
    </div>
  );
}
