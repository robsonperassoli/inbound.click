import { createRouter } from "@tanstack/react-router"
import { convexQueryClient } from "./integrations/convex/provider"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    context: {
      convex: convexQueryClient.convexClient,
    },
  })

  return router
}
