import { ConvexQueryClient } from "@convex-dev/react-query"
import { QueryClient } from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { NotFoundPage } from "@/components/not-found-page"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL
  if (!CONVEX_URL) {
    console.error("missing envar CONVEX_URL")
  } // expectAuth was causing problem on public pages like the user profile.
  // since users are not expected to be authenticated on those pages,
  // the chat would not work due to hanging (expecting auth) queries
  // const convexQueryClient = new ConvexQueryClient(CONVEX_URL, {
  //   expectAuth: true,
  // })

  const convexQueryClient = new ConvexQueryClient(CONVEX_URL)

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  })
  convexQueryClient.connect(queryClient)

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    context: {
      convexQueryClient: convexQueryClient,
      convex: convexQueryClient.convexClient,
      queryClient,
    },
    defaultErrorComponent: (err) => <p>{err.error.stack}</p>,
    defaultNotFoundComponent: NotFoundPage,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}
