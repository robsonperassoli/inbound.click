import { api } from "@convex/_generated/api"
import {
  Chart03Icon,
  ListViewIcon,
  PaintBoardIcon,
  Settings05Icon,
  Share03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router"
import { useQuery } from "convex/react"
import { ShareButton } from "@/components/share-button"
import { Button } from "@/components/ui/button"
import { UserPage } from "@/components/user-page"

export const Route = createFileRoute("/_authenticated/dashboard")({
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
  const profile = useQuery(api.profiles.getProfile, { profileId })
  const links = useQuery(api.links.getProfileLinks, { profileId })

  if (!profile) {
    return null
  }

  const activeProps = {
    className: "font-semibold",
  }

  return (
    <div className="p-6">
      <div className="bg-background/20 shadow-md rounded-full p-4 flex space-x-4 backdrop-blur-2xl">
        <Button variant="ghost" asChild>
          <Link to="/dashboard" activeProps={activeProps}>
            <HugeiconsIcon icon={ListViewIcon} /> Links
          </Link>
        </Button>

        <Button variant="ghost" asChild>
          <Link to="/dashboard/appearance" activeProps={activeProps}>
            <HugeiconsIcon icon={PaintBoardIcon} /> Appearance
          </Link>
        </Button>

        <Button variant="ghost" asChild>
          <Link to="/dashboard/analytics" activeProps={activeProps}>
            <HugeiconsIcon icon={Chart03Icon} />
            Analytics
          </Link>
        </Button>

        <Button variant="ghost" asChild>
          <Link to="/dashboard/settings" activeProps={activeProps}>
            <HugeiconsIcon icon={Settings05Icon} />
            Settings
          </Link>
        </Button>

        <div className="grow" />

        <ShareButton profileId={profileId} />
      </div>

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
