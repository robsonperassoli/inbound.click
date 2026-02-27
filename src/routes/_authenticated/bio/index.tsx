import { api } from "@convex/_generated/api"
import type { Doc, Id } from "@convex/_generated/dataModel"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router"
import { useMutation, useQuery } from "convex/react"
import { type FormEvent, useId, useMemo, useState } from "react"
import { AddLinkModal } from "@/components/add-link-modal"
import { CreateFormPrompt } from "@/components/forms/create-form-prompt"
import { CreateLinkButton } from "@/components/links/create-link-button"
import { EditLinkModal } from "@/components/links/edit-link-modal"
import { useSiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export const Route = createFileRoute("/_authenticated/bio/")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const { profileId } = useLoaderData({ from: "/_authenticated/bio" })
  const links = useQuery(api.links.queries.getProfileLinks, { profileId })
  const toggleActive = useMutation(api.links.mutations.toggleActive)
  const removeLink = useMutation(api.links.mutations.removeLink)
  const [openModal, setOpenModal] = useState<
    "add-link" | "add-form-link" | "edit-link" | null
  >(null)
  const [selectedLinkId, setSelectedLinkId] = useState<Id<"links"> | null>(null)

  const headerActions = useMemo(
    () => [
      <CreateLinkButton
        key="add-link"
        onAddLink={() => setOpenModal("add-link")}
        onAddAiLeadCapture={() => setOpenModal("add-form-link")}
      />,
    ],
    [],
  )

  useSiteHeader({
    title: "Links",
    titleMode: "append",
    actions: headerActions,
  })

  const nextOrder = useMemo(() => (links?.at(-1)?.order ?? 0) + 1, [links])

  const handleRemoveLink = async (link: {
    _id: Id<"links">
    title: string
  }) => {
    const confirmed = window.confirm(
      `Remove "${link.title}" from your links? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    setSelectedLinkId(link._id)
    try {
      await removeLink({ linkId: link._id })
    } finally {
      setSelectedLinkId(null)
    }
  }

  const onLinkEdit = async (link: Doc<"links">) => {
    setSelectedLinkId(link._id)
    setOpenModal("edit-link")
  }

  return (
    <div className="space-y-5">
      {links === undefined && (
        <Card className="border-border/60 bg-muted/20">
          <CardContent className="py-10 text-sm text-muted-foreground">
            Loading links...
          </CardContent>
        </Card>
      )}

      {links?.length === 0 && (
        <Card className="border-border/60 bg-muted/20">
          <CardContent className="flex flex-col gap-3 py-10">
            <p className="text-sm text-muted-foreground">
              No links yet. Add your first link to start building your page.
            </p>
            <div>
              <Button size="sm" onClick={() => setOpenModal("add-link")}>
                <HugeiconsIcon icon={PlusSignIcon} />
                Add first link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {links && links.length > 0 && (
        <Card className="!gap-0 !py-0 overflow-hidden border-border/60 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70">
          <CardContent className="p-0">
            <ul>
              {links.map((link) => (
                <li
                  key={link._id}
                  className="group grid gap-4 border-b border-border/60 px-5 py-4 last:border-b-0 md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div className="min-w-0 space-y-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-sm font-semibold">
                        {link.title}
                      </span>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${
                          link.active
                            ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "border-border/60 bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        {link.active ? "Live" : "Hidden"}
                      </span>
                    </div>

                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.url}
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 transition-opacity duration-150 md:justify-end md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => onLinkEdit(link)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      disabled={selectedLinkId === link._id}
                      onClick={() =>
                        handleRemoveLink({
                          _id: link._id,
                          title: link.title,
                        })
                      }
                    >
                      {selectedLinkId === link._id ? "Removing..." : "Remove"}
                    </Button>
                    <span className="ml-1 text-xs text-muted-foreground">
                      Active
                    </span>
                    <Switch
                      checked={link.active}
                      onCheckedChange={(active) =>
                        toggleActive({ linkId: link._id, active })
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground">
        {links ? `${links.length} total links` : ""}
      </div>

      <AddLinkModal
        open={openModal === "add-link"}
        onClose={() => setOpenModal(null)}
        order={nextOrder}
        profileId={profileId}
      />

      <CreateFormPrompt
        open={openModal === "add-form-link"}
        onClose={() => setOpenModal(null)}
      />

      {selectedLinkId && (
        <EditLinkModal
          linkId={selectedLinkId}
          onClose={() => {
            setOpenModal(null)
            setSelectedLinkId(null)
          }}
          open={openModal === "edit-link"}
        />
      )}
    </div>
  )
}
