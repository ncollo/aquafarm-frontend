import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layout/RootLayout";

export const router = createBrowserRouter([
  // Standalone login page (no navbar / footer)
  {
    path: "/login",
    lazy: async () => ({
      Component: (await import("./pages/Login")).Login,
    }),
  },
  // Main site layout
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("./pages/Home")).Home,
        }),
      },
      {
        path: "about",
        lazy: async () => ({
          Component: (await import("./pages/About")).About,
        }),
      },
      {
        path: "our-farm",
        lazy: async () => ({
          Component: (await import("./pages/OurFarm")).OurFarm,
        }),
      },
      {
        path: "store",
        lazy: async () => ({
          Component: (await import("./pages/Store")).Store,
        }),
      },
      {
        path: "sport-fishing",
        lazy: async () => ({
          Component: (await import("./pages/SportFishing")).SportFishing,
        }),
      },
      {
        path: "schedule-visit",
        lazy: async () => ({
          Component: (await import("./pages/ScheduleVisit")).ScheduleVisit,
        }),
      },
      {
        path: "training",
        lazy: async () => ({
          Component: (await import("./pages/Training")).Training,
        }),
      },
      {
        path: "community",
        lazy: async () => ({
          Component: (await import("./pages/Community")).Community,
        }),
      },
      {
        path: "blog",
        lazy: async () => ({
          Component: (await import("./pages/Blog")).Blog,
        }),
      },
      {
        path: "gallery",
        lazy: async () => ({
          Component: (await import("./pages/Gallery")).Gallery,
        }),
      },
      {
        path: "careers",
        lazy: async () => ({
          Component: (await import("./pages/Careers")).Careers,
        }),
      },
      {
        path: "contact",
        lazy: async () => ({
          Component: (await import("./pages/Contact")).Contact,
        }),
      },
      // Dashboard is auth-gated internally
      {
        path: "dashboard",
        lazy: async () => ({
          Component: (await import("./pages/Dashboard")).Dashboard,
        }),
      },
      {
        path: "*",
        lazy: async () => ({
          Component: (await import("./pages/NotFound")).NotFound,
        }),
      },
    ],
  },
]);
