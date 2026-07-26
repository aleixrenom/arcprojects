# ui.ts

## What this file is

The site's shared memory: a tiny [[CONCEPTS#Zustand]] store holding the two pieces of information that several distant components all care about — the current **theme** (light/dark) and the **active page** (apps/projects). It also exports the `CardInfo` type describing a portfolio card.

## Where it fits

- Its `useUI` hook is used by [[App.tsx]] and [[Separator.tsx]] (active page), [[Header.tsx]] (theme toggle), and [[router.tsx]] (applies the theme, sets the page on navigation).
- The `CardInfo` type is used by [[cards.ts]] (the actual card data), [[Card.tsx]] and [[DetailPage.tsx]].
- Depends only on the `zustand` package ([[CONCEPTS#npm and packages]]).

## Walkthrough

**The types.** The file starts with pure TypeScript vocabulary ([[CONCEPTS#TypeScript]]):

```ts
type Page = "apps" | "projects";
type CardKind = "app" | "project";

export type CardInfo = {
  id: string;
  title: string;
  kind: CardKind;
  description?: string;
};
```

`"apps" | "projects"` is a **union of literal strings**: a `Page` isn't just any text, it's exactly one of these two words — a typo like `"aps"` becomes a compile-time error. `CardInfo` describes one portfolio card; the `?` on `description` marks it optional. (Housing this type here is slightly arbitrary — it's card data vocabulary more than UI state — but it keeps all shared types in one imported-by-everyone file.)

`UIState` then describes the store itself: two values (`theme`, `activePage`) and two functions to change them. Storing the *changer functions inside the store* is the Zustand idiom — any component that can see the store can also update it, without inventing its own update logic.

**Creating the store:**

```ts
export const useUI = create<UIState>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
  activePage: "apps",
  setActivePage: (p) => set({ activePage: p }),
}));
```

`create` (from zustand) takes a recipe function and returns `useUI` — a hook. The recipe receives `set`, the store's one built-in superpower, and returns the initial state: light theme, apps page. The two actions show `set`'s two flavors: `setActivePage` passes a plain object (merge this in), while `toggleTheme` passes a *function* of the current state `s` — the right form whenever the new value depends on the old one.

That's the whole file — notice what's *not* here: no React imports, no components. Zustand stores live outside the component tree; components opt in with `useUI((s) => s.theme)`, and only re-render when the specific slice they selected changes. Code can even read or write the store from outside React entirely — [[router.tsx]] does exactly that with `useUI.setState({ activePage: "apps" })` in a route checkpoint.

The final `export default useUI;` just offers the same hook under both a named and a default export ([[CONCEPTS#Modules and imports]]); different files import it either way.

## Concepts used

[[CONCEPTS#Zustand]], [[CONCEPTS#TypeScript]], [[CONCEPTS#State and hooks]], [[CONCEPTS#Modules and imports]]
