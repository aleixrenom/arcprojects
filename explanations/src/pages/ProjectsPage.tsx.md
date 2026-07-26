# ProjectsPage.tsx

## What this file is

The *Projects* page — the right-hand one of the two swipeable pages on the main screen. It shows a heading and a grid of one card per project. It is an almost line-for-line twin of [[AppsPage.tsx]]; everything said here applies there too.

## Where it fits

- Rendered by [[App.tsx]] as the second `page-panel`.
- Reads the `projects` array from [[cards.ts]] (currently empty, so the page shows only its heading).
- Renders a [[Card.tsx]] per entry; clicking one navigates to a URL handled by [[router.tsx]] and shown by [[DetailPage.tsx]].
- The `cards-grid` layout class comes from [[index.css]].

## Walkthrough

**Navigation setup:**

```tsx
const navigate = useNavigate();
const openProject = (id: string) =>
  navigate({ to: "/project/$projectId", params: { projectId: id } });
```

`useNavigate` is a hook from the router library ([[CONCEPTS#Router]]) that returns a function for changing the URL from code. `openProject` wraps it: given a card id, go to that project's address — note how the route is written exactly as declared in [[router.tsx]] (`$projectId` placeholder plus a `params` object), which lets TypeScript verify the address is real ([[CONCEPTS#TypeScript]]).

Changing the URL is the *entire* click behavior. The page doesn't show the detail screen itself — it just navigates, and the router takes over. That keeps detail pages bookmarkable and the back button working.

**The rendered list:**

```tsx
<div className="cards-grid">
  {projects.map((project) => (
    <Card key={project.id} card={project} onOpen={openProject} />
  ))}
</div>
```

The standard array-to-elements pattern ([[CONCEPTS#Rendering lists]]): each project becomes a [[Card.tsx]], receiving the data and the `openProject` callback as props ([[CONCEPTS#Props]]). Since `projects` in [[cards.ts]] is an empty array right now, the `.map` produces nothing and the grid renders empty — the page is a ready-made frame waiting for content.

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#JSX]], [[CONCEPTS#Rendering lists]], [[CONCEPTS#Props]], [[CONCEPTS#Router]], [[CONCEPTS#State and hooks]]
