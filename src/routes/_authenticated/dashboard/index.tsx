import { api } from "@convex/_generated/api"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useQuery } from "convex/react"
import { useMemo, useState } from "react"
import { AddLinkSidePanel } from "@/components/add-link-side-panel"
import { ThemeSelector } from "@/components/theme-selector"
import { Button } from "@/components/ui/button"
import { UserPage } from "@/components/user-page"

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: RouteComponent,
  ssr: false,
  loader: async ({ context }) => {
    const profile = await context.convex.query(api.profiles.getProfile, {})

    if (!profile) {
      throw redirect({ to: "/onboarding" })
    }

    return { profile }
  },
})

function RouteComponent() {
  const { profile } = Route.useLoaderData()
  const [addLinkPanelOpen, setAddLinkPanelOpen] = useState(false)

  const links = useQuery(api.links.getProfileLinks, { profileId: profile._id })
  const nextOrder = useMemo(() => (links?.at(-1)?.order ?? 0) + 1, [links])

  return (
    <div className="p-6">
      <div className="bg-accent rounded-full p-4 flex space-x-4 backdrop-blur-2xl">
        <ThemeSelector onThemeSelected={(t) => console.log(t)} />

        <Button variant="link">Customize</Button>
      </div>

      <div className="flex gap-x-2 justify-center">
        <div className="grow ">
          <UserPage
            profile={profile}
            links={links ?? []}
            mode="edit"
            onAddLinkClicked={() => setAddLinkPanelOpen(true)}
          />
        </div>

        <div className="flex-1">
          <AddLinkSidePanel
            open={addLinkPanelOpen}
            onClose={() => setAddLinkPanelOpen(false)}
            order={nextOrder}
            profileId={profile._id}
          />
        </div>
      </div>
    </div>
  )
}
