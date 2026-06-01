import { create } from "zustand";

type Page = "apps" | "projects";

type CardKind = "app" | "project";

export type CardInfo = {
  id: string;
  title: string;
  kind: CardKind;
  description?: string;
};

type UIState = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  activePage: Page;
  setActivePage: (p: Page) => void;
  selectedCard: CardInfo | null;
  openCard: (card: CardInfo) => void;
  closeCard: () => void;
};

export const useUI = create<UIState>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
  activePage: "apps",
  setActivePage: (p) => set({ activePage: p }),
  selectedCard: null,
  openCard: (card) => set({ selectedCard: card }),
  closeCard: () => set({ selectedCard: null }),
}));

export default useUI;
