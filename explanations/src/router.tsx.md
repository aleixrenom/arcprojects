# router.tsx

## What this file is

The map between URLs and screens ([[CONCEPTS#Router]]). It declares the three addresses this site understands — the home screen, an app's detail page, and a project's detail page — plus what to do with addresses that don't exist (go home). It also owns one site-wide side job: applying the dark theme to the page.

## Where it fits

- Its exported `router` object is handed to React in [[main.tsx]] — this file decides everything that appears on screen.
- Routes render [[App.tsx]] (home) and [[DetailPage.tsx]] (app/project details).
- Uses `findCard` from [[cards.ts]] to check that a URL points at a real card, and the shared store [[ui.ts]] for theme and active page.

## Walkthrough

**The `Root` component — the frame around every screen:**

```tsx
function Root() {
  const theme = useUI((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}
```

Whatever URL you're on, `Root` renders first, and the matching screen appears where `<Outlet />` is — a placeholder meaning "the current route's content goes here". Because it wraps everything, it's the perfect home for the theme logic: `useEffect` ([[CONCEPTS#State and hooks]]) watches the `theme` value from the store ([[CONCEPTS#Zustand]], [[ui.ts]]) and adds or removes a `dark` class on the `<html>` element itself. All the actual color changes happen in CSS — [[index.css]] defines different color variables when `.dark` is present.

**The route definitions.** Each route is created with `createRoute` and states its path and component:

```tsx
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});
```

Path `/` (the home address) renders [[App.tsx]]. The detail route is more interesting:

```tsx
const appDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app/$appId",
  validateSearch: ...,
  beforeLoad: ({ params }) => {
    const card = findCard("app", params.appId);
    if (!card) throw redirect({ to: "/" });
    useUI.setState({ activePage: "apps" });
  },
  component: AppDetail,
});
```

- `$appId` is a **placeholder segment**: the URL `/app/character-sheet` matches, and `params.appId` becomes `"character-sheet"`.
- `validateSearch` handles the part after `?` in a URL (like `?set=finnish`): it keeps a `set` value only if it's a string. The quiz app uses this to encode the chosen word set in the URL.
- `beforeLoad` is a checkpoint that runs *before* showing the screen. It looks the id up in [[cards.ts]]; if no such card exists, `throw redirect(...)` abandons the navigation and sends you home — so typing a nonsense URL can't show a broken page. It also updates the store so that when you go back, the correct page (*Apps*) is the active one.

The tiny `AppDetail` component then reads the id from the URL again and renders `<DetailPage card={card} />`, passing the card along as a prop ([[CONCEPTS#Props]], [[DetailPage.tsx]]). `projectDetailRoute` and `ProjectDetail` are the same pattern for `/project/$projectId`, minus the `?set` handling.

**Assembling the router:**

```tsx
export const router = createRouter({
  routeTree,
  history: createHashHistory(),
  defaultNotFoundComponent: () => <Navigate to="/" replace />,
  defaultViewTransition: true,
});
```

The three routes are gathered into a tree under `rootRoute`, then the router is built with three notable options: `createHashHistory()` switches to hash-style URLs like `#/app/character-sheet` (see [[CONCEPTS#Router]] for why that helps on simple web hosts); unknown URLs render `<Navigate to="/" replace />`, i.e. silently go home (`replace` keeps the bad URL out of the back-button history); and `defaultViewTransition` turns on the browser's built-in cross-fade animation between screens.

**The last four lines** (`declare module ...`) are pure TypeScript ceremony ([[CONCEPTS#TypeScript]]): they register this router's shape with the router library so that, throughout the project, route names and parameters are type-checked — a typo like `to: "/apps"` would be flagged before the code runs.

## Concepts used

[[CONCEPTS#Router]], [[CONCEPTS#Components]], [[CONCEPTS#JSX]], [[CONCEPTS#State and hooks]], [[CONCEPTS#Zustand]], [[CONCEPTS#Props]], [[CONCEPTS#TypeScript]]
