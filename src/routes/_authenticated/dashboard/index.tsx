import { api } from "@convex/_generated/api"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { useMutation, useQuery } from "convex/react"
import { useMemo, useState } from "react"
import { AddLinkModal } from "@/components/add-link-modal"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const { profileId } = useLoaderData({ from: "/_authenticated/dashboard" })
  const links = useQuery(api.links.getProfileLinks, { profileId })
  const toggleActive = useMutation(api.links.toggleActive)
  const [addLinkOpen, setAddLinkOpen] = useState(false)

  const nextOrder = useMemo(() => (links?.at(-1)?.order ?? 0) + 1, [links])

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {links?.map((link) => (
          <li key={link._id} className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium">{link.title}</span>
              <a href={link.url} className="text-muted-foreground">
                {link.url}
              </a>
            </div>
            <Switch
              checked={link.active}
              onCheckedChange={(active) =>
                toggleActive({ linkId: link._id, active })
              }
            />
          </li>
        ))}
      </ul>

      <div>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => setAddLinkOpen(true)}
        >
          <HugeiconsIcon icon={PlusSignIcon} />
          Add Link
        </Button>
      </div>
      <AddLinkModal
        open={addLinkOpen}
        onClose={() => setAddLinkOpen(false)}
        order={nextOrder}
        profileId={profileId}
      />
    </div>
  )
}
