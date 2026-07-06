import type { CardInfo } from "../store/ui.js";

export const apps: CardInfo[] = [
  { id: "finnish-quiz", title: "Finnish Quiz", kind: "app" },
  { id: "dice-math", title: "Dice Math", kind: "app" },
  { id: "chatbot", title: "Chatbot", kind: "app" },
];

export const projects: CardInfo[] = [
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

export function findCard(kind: CardInfo["kind"], id: string): CardInfo | null {
  const list = kind === "app" ? apps : projects;
  return list.find((card) => card.id === id) ?? null;
}
