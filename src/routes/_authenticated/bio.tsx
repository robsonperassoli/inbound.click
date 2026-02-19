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
import { ShareButton } from "@/components/share-button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPage } from "@/components/user-page"

export const Route = createFileRoute("/_authenticated/bio")({
  component: RouteComponent,
  ssr: false,
  loader: async ({ context }) => {
    const profile = await context.convex.query(api.profiles.getProfile, {})

    if (!profile) {
      throw redirect({ to: "/onboarding" })
    }
    return { profileId: profile._id }
  },
})

function RouteComponent() {
  const { profileId } = Route.useLoaderData()
  const { pathname } = useLocation()
  const profile = useQuery(api.profiles.getProfile, {})
  const links = useQuery(api.links.getProfileLinks, { profileId })
  const activeTab = pathname.includes("/appearance")
    ? "appearance"
    : pathname.includes("/settings")
      ? "settings"
      : "links"

  if (!profile) {
    return null
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="Bio Page"
        description="Manage your links, appearance, and profile settings."
      />

      <Tabs value={activeTab}>
        <TabsList>
          <TabsTrigger value="links" asChild>
            <Link to="/bio" activeOptions={{ exact: true }}>
              Links
            </Link>
          </TabsTrigger>

          <TabsTrigger value="appearance" asChild>
            <Link to="/bio/appearance" activeOptions={{ exact: true }}>
              Appearance
            </Link>
          </TabsTrigger>

          <TabsTrigger value="settings" asChild>
            <Link to="/bio/settings" activeOptions={{ exact: true }}>
              Settings
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-x-6 justify-center pt-8">
        <div className="grow ">
          <Outlet />
        </div>

        <div className="shrink-0 w-md">
          <div className="border rounded-xl shadow-lg overflow-hidden">
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
