import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { Authenticated, useConvexAuth } from "convex/react"
import { useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { PostHogUserIdentify } from "@/components/posthog-user-identity"

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/signin" })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading || !isAuthenticated) return null

  return (
    <Authenticated>
      <PostHogUserIdentify />
      <AppLayout>
        <Outlet />
      </AppLayout>
    </Authenticated>
  )
}
