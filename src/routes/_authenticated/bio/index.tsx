import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { useMutation, useQuery } from "convex/react"
import { type FormEvent, useId, useMemo, useState } from "react"
import { AddLinkModal } from "@/components/add-link-modal"
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
  const updateLink = useMutation(api.links.mutations.updateLink)
  const removeLink = useMutation(api.links.mutations.removeLink)
  const [addLinkOpen, setAddLinkOpen] = useState(false)
  const [editLinkId, setEditLinkId] = useState<Id<"links"> | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editUrl, setEditUrl] = useState("")
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [removingLinkId, setRemovingLinkId] = useState<Id<"links"> | null>(null)

  const headerActions = useMemo(
    () => [
      <Button key="add-link" onClick={() => setAddLinkOpen(true)} size="sm">
        <HugeiconsIcon icon={PlusSignIcon} />
        Add Link
      </Button>,
    ],
    [],
  )

  useSiteHeader({
    title: "Links",
    titleMode: "append",
    actions: headerActions,
  })

  const nextOrder = useMemo(() => (links?.at(-1)?.order ?? 0) + 1, [links])
  const isEditOpen = Boolean(editLinkId)
  const editTitleInputId = useId()
  const editUrlInputId = useId()

  const openEditModal = (link: {
    _id: Id<"links">
    title: string
    url: string
  }) => {
    setEditLinkId(link._id)
    setEditTitle(link.title)
    setEditUrl(link.url)
  }

  const closeEditModal = () => {
    setEditLinkId(null)
    setEditTitle("")
    setEditUrl("")
    setIsSavingEdit(false)
  }

  const handleSaveEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editLinkId || !editTitle.trim() || !editUrl.trim()) {
      return
    }

    setIsSavingEdit(true)
    await updateLink({
      linkId: editLinkId,
      title: editTitle.trim(),
      url: editUrl.trim(),
    })
    closeEditModal()
  }

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

    setRemovingLinkId(link._id)
    try {
      await removeLink({ linkId: link._id })
    } finally {
      setRemovingLinkId(null)
    }
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
              <Button size="sm" onClick={() => setAddLinkOpen(true)}>
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
                      onClick={() =>
                        openEditModal({
                          _id: link._id,
                          title: link.title,
                          url: link.url,
                        })
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      disabled={removingLinkId === link._id}
                      onClick={() =>
                        handleRemoveLink({
                          _id: link._id,
                          title: link.title,
                        })
                      }
                    >
                      {removingLinkId === link._id ? "Removing..." : "Remove"}
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
        open={addLinkOpen}
        onClose={() => setAddLinkOpen(false)}
        order={nextOrder}
        profileId={profileId}
      />

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => !open && closeEditModal()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSaveEdit}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor={editTitleInputId}>
                Title
              </label>
              <Input
                id={editTitleInputId}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Book a tour"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor={editUrlInputId}>
                URL
              </label>
              <Input
                id={editUrlInputId}
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={closeEditModal}
                disabled={isSavingEdit}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSavingEdit || !editTitle.trim() || !editUrl.trim()}
              >
                {isSavingEdit ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
