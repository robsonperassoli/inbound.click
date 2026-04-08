import { api } from "@convex/_generated/api"
import { ViewIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { useSiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UserPage } from "@/components/user-page"
import { useSelectedProfile } from "@/hooks/use-selected-profile"

export const Route = createFileRoute("/_authenticated/bio")({
  component: RouteComponent,
  ssr: false,
  loader: async ({ context }) => {
    const profiles = await context.convexClient.query(
      api.profiles.queries.getAvailableProfiles,
      {},
    )

    if (profiles.length === 0) {
      throw redirect({ to: "/onboarding" })
    }

    return { profileId: profiles[0]._id }
  },
})

function RouteComponent() {
  // const { profileId } = Route.useLoaderData()

  useSiteHeader({ title: "Bio" })

  const profileData = useSelectedProfile()

  if (!profileData) {
    return null
  }

  const { profile, links } = profileData

  return (
    <>
      <div className="flex flex-1">
        <div className="w-full overflow-auto p-4">
          <Outlet />
        </div>

        <div className="hidden lg:flex w-xl xl:w-3xl 2xl:w-5xl border-l grow">
          <UserPage
            profile={profile}
            links={links?.filter((l) => l.active) ?? []}
            className="min-h-96 w-full"
            onFormLinkClick={() => {}}
          />
        </div>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="fixed right-5 bottom-5 lg:hidden shadow">
            <HugeiconsIcon icon={ViewIcon} /> Preview
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          className="p-0 w-sm max-w-full overflow-hidden"
        >
          <UserPage
            profile={profile}
            links={links?.filter((l) => l.active) ?? []}
            className="min-h-[60vh]"
            onFormLinkClick={() => {}}
          />
        </PopoverContent>
      </Popover>
    </>
  )
}
