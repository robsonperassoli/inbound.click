import { api } from "@convex/_generated/api"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { useQuery } from "convex/react"
import { ScrollableContainer } from "@/components/app-layout/scrollable-container"
import { useSiteHeader } from "@/components/site-header"
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
  useSiteHeader({ title: "Bio" })

  const { profileId } = Route.useLoaderData()
  const profile = useQuery(api.profiles.queries.getProfile, {})
  const links = useQuery(api.links.queries.getProfileLinks, { profileId })

  if (!profile) {
    return null
  }

  return (
    <ScrollableContainer>
      <div className="flex gap-x-6 justify-center">
        <div className="grow w-3/5">
          <Outlet />
        </div>

        <div className="shrink-0 w-2/5">
          <div className="sticky top-0 border rounded-xl shadow-lg overflow-hidden">
            <UserPage
              profile={profile}
              links={links?.filter((l) => l.active) ?? []}
              className="min-h-96"
              onFormLinkClick={() => {}}
            />
          </div>
        </div>
      </div>
    </ScrollableContainer>
  )
}
