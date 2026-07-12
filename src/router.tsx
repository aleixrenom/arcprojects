import React, { useEffect } from "react";
import {
  Navigate,
  Outlet,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import App from "./App.js";
import DetailPage from "./pages/DetailPage.js";
import { findCard } from "./data/cards.js";
import { useUI } from "./store/ui.js";

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

const rootRoute = createRootRoute({
  component: Root,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

const appDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app/$appId",
  validateSearch: (search: Record<string, unknown>): { set?: string } => ({
    set: typeof search.set === "string" ? search.set : undefined,
  }),
  beforeLoad: ({ params }) => {
    const card = findCard("app", params.appId);
    if (!card) throw redirect({ to: "/" });
    useUI.setState({ activePage: "apps" });
  },
  component: AppDetail,
});

function AppDetail() {
  const { appId } = appDetailRoute.useParams();
  const card = findCard("app", appId);
  return card ? <DetailPage card={card} /> : null;
}

const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/project/$projectId",
  beforeLoad: ({ params }) => {
    const card = findCard("project", params.projectId);
    if (!card) throw redirect({ to: "/" });
    useUI.setState({ activePage: "projects" });
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const { projectId } = projectDetailRoute.useParams();
  const card = findCard("project", projectId);
  return card ? <DetailPage card={card} /> : null;
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  appDetailRoute,
  projectDetailRoute,
]);

export const router = createRouter({
  routeTree,
  history: createHashHistory(),
  defaultNotFoundComponent: () => <Navigate to="/" replace />,
  defaultViewTransition: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
