import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { getAuth, getSignInUrl } from "@workos/authkit-tanstack-react-start"
import { AppLayout } from "@/components/app-layout"
import { PostHogUserIdentify } from "@/components/posthog-user-identity"

export const Route = createFileRoute("/_authenticated")({
  loader: async ({ location }) => {
    const { user } = await getAuth()

    if (!user) {
      const path = location.pathname
      const href = await getSignInUrl({ data: { returnPathname: path } })
      throw redirect({ href })
    }
  },
  component: () => (
    <>
      <PostHogUserIdentify />
      <AppLayout>
        <Outlet />
      </AppLayout>
    </>
  ),
})
