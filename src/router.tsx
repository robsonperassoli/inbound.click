import { ConvexQueryClient } from "@convex-dev/react-query"
import { QueryClient } from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import {
  AuthKitProvider,
  useAccessToken,
  useAuth,
} from "@workos/authkit-tanstack-react-start/client"
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react"
import { useCallback, useMemo } from "react"
import { NotFoundPage } from "@/components/not-found-page"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL
  if (!CONVEX_URL) {
    console.error("missing envar CONVEX_URL")
  }
  const convex = new ConvexReactClient(CONVEX_URL)
  const convexQueryClient = new ConvexQueryClient(convex)

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        gcTime: 5000,
      },
    },
  })
  convexQueryClient.connect(queryClient)

  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultPreloadStaleTime: 0, // Let React Query handle all caching
    defaultErrorComponent: (err) => <p>{err.error.stack}</p>,
    defaultNotFoundComponent: () => <NotFoundPage />,
    context: { queryClient, convexClient: convex, convexQueryClient },
    Wrap: ({ children }) => (
      <AuthKitProvider>
        <ConvexProviderWithAuth
          client={convexQueryClient.convexClient}
          useAuth={useAuthFromWorkOS}
        >
          {children}
        </ConvexProviderWithAuth>
      </AuthKitProvider>
    ),
  })
  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

function useAuthFromWorkOS() {
  const { loading, user } = useAuth()
  const { getAccessToken, refresh } = useAccessToken()

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (!user) {
        return null
      }

      if (forceRefreshToken) {
        return (await refresh()) ?? null
      }

      return (await getAccessToken()) ?? null
    },
    [user, refresh, getAccessToken],
  )

  return useMemo(
    () => ({
      isLoading: loading,
      isAuthenticated: !!user,
      fetchAccessToken,
    }),
    [loading, user, fetchAccessToken],
  )
}
