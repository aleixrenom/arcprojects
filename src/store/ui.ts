import create from "zustand";

type Page = "apps" | "projects";

type UIState = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  activePage: Page;
  setActivePage: (p: Page) => void;
};

export const useUI = create<UIState>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
  activePage: "apps",
  setActivePage: (p) => set({ activePage: p }),
}));

export default useUI;
