import { api } from "@convex/_generated/api"
import { createFileRoute } from "@tanstack/react-router"
import { UserPage } from "@/components/user-page"

export const Route = createFileRoute("/u/$username")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const viewPageData = await context.convex.query(api.public.getProfile, {
      username: params.username,
    })

    return viewPageData
  },
})

function RouteComponent() {
  const { profile, links } = Route.useLoaderData()
  return <UserPage profile={profile} links={links} />
}
