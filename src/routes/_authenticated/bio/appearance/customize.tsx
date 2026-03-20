import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router"
import { EditTheme } from "@/components/edit-theme"
import { useSiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute(
  "/_authenticated/bio/appearance/customize",
)({
  component: RouteComponent,
})

function RouteComponent() {
  useSiteHeader({ title: "Customize Theme", titleMode: "append" })

  const navigate = useNavigate()
  const { profileId } = useLoaderData({ from: "/_authenticated/bio" })

  return (
    <div className="max-w-md space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => navigate({ to: "/bio/appearance" })}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 mr-1" />
        Back to Appearance
      </Button>
      <EditTheme profileId={profileId} />
    </div>
  )
}
