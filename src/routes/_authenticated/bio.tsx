import { api } from "@convex/_generated/api"
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router"
import { useQuery } from "convex/react"
import { PageTitle } from "@/components/page-title"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPage } from "@/components/user-page"

export const Route = createFileRoute("/_authenticated/bio")({
  component: RouteComponent,
  ssr: false,
  loader: async ({ context }) => {
    const profile = await context.convex.query(
      api.profiles.queries.getProfile,
      {},
    )

    if (!profile) {
      throw redirect({ to: "/onboarding" })
    }
    return { profileId: profile._id }
  },
})

function RouteComponent() {
  const { profileId } = Route.useLoaderData()
  const profile = useQuery(api.profiles.queries.getProfile, {})
  const links = useQuery(api.links.queries.getProfileLinks, { profileId })

  if (!profile) {
    return null
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="Bio Page"
        description="Manage your links, appearance, and profile settings."
      />

      <div className="flex gap-x-6 justify-center">
        <div className="grow">
          <Outlet />
        </div>

        <div className="shrink-0 w-md">
          <div className="sticky top-20 border rounded-xl shadow-lg overflow-hidden">
            <UserPage
              profile={profile}
              links={links ?? []}
              className="min-h-96"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
