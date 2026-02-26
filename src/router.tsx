import { createRouter } from "@tanstack/react-router"
// import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { convexQueryClient } from "./integrations/convex/provider"

import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    context: {
      convexQueryClient: convexQueryClient,
      convex: convexQueryClient.convexClient,
    },
    defaultErrorComponent: (err) => <p>{err.error.stack}</p>,
    defaultNotFoundComponent: () => <p>not found</p>,
  })

  // setupRouterSsrQueryIntegration({
  //   router,
  //   queryClient: undefined,
  // })

  return router
}
