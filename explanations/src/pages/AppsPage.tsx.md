# AppsPage.tsx

## What this file is

The *Apps* page — the left-hand, default-visible page of the main screen, showing one card per mini-app (currently the Language Quiz and the Character Sheet). Structurally it is the identical twin of [[ProjectsPage.tsx]], with three word-level differences: it reads `apps` instead of `projects`, navigates to `/app/$appId` instead of `/project/$projectId`, and its heading says "Apps".

## Where it fits

- Rendered by [[App.tsx]] as the first `page-panel` (and it's the page shown on first visit, since `activePage` starts as `"apps"` in [[ui.ts]]).
- Reads the `apps` array from [[cards.ts]].
- Renders a [[Card.tsx]] per entry; clicks navigate to URLs that [[router.tsx]] resolves to [[DetailPage.tsx]], which mounts the corresponding mini-app.
- The `cards-grid` layout class comes from [[index.css]].

## Walkthrough

The whole component:

```tsx
export default function AppsPage() {
  const navigate = useNavigate();
  const openApp = (id: string) =>
    navigate({ to: "/app/$appId", params: { appId: id } });

  return (
    <div>
      <h2>Apps</h2>
      <div className="cards-grid">
        {apps.map((app) => (
          <Card key={app.id} card={app} onOpen={openApp} />
        ))}
      </div>
    </div>
  );
}
```

Everything here is explained in detail in [[ProjectsPage.tsx]] — the `useNavigate` hook ([[CONCEPTS#Router]]), the navigate-don't-render click handler, and the `.map` + `key` list pattern ([[CONCEPTS#Rendering lists]]). The one practical difference: this list actually has entries, so with two apps in [[cards.ts]] you get two cards. Clicking "Character Sheet" changes the URL to `#/app/character-sheet`; [[router.tsx]] validates the id and renders [[DetailPage.tsx]], which mounts [[character-sheet/index.tsx]].

Worth noticing the pattern these twin files embody: pages are *thin*. All reusable behavior lives in [[Card.tsx]], all data in [[cards.ts]], all navigation rules in [[router.tsx]] — the page just wires them together, which is why it fits in 22 lines.

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#JSX]], [[CONCEPTS#Rendering lists]], [[CONCEPTS#Props]], [[CONCEPTS#Router]], [[CONCEPTS#State and hooks]]
