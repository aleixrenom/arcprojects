import type { CardInfo } from "../store/ui.js";

export const apps: CardInfo[] = [
  { id: "finnish-quiz", title: "Language Quiz", kind: "app" },
];

export const projects: CardInfo[] = [
  // {
  //   id: "project-a",
  //   title: "Project A",
  //   kind: "project",
  //   description: "A sample project placeholder.",
  // },
];

export function findCard(kind: CardInfo["kind"], id: string): CardInfo | null {
  const list = kind === "app" ? apps : projects;
  return list.find((card) => card.id === id) ?? null;
}
