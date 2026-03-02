import { api } from "@convex/_generated/api"
import type { Doc, Id } from "@convex/_generated/dataModel"
import { move } from "@dnd-kit/helpers"
import { DragDropProvider } from "@dnd-kit/react"
import { PlusSignIcon, Tick01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { useMutation, useQuery } from "convex/react"
import { useMemo, useState } from "react"
import { AddLinkModal } from "@/components/add-link-modal"
import { ScrollableContainer } from "@/components/app-layout/scrollable-container"
import { CreateFormPrompt } from "@/components/forms/create-form-prompt"
import { CreateLinkButton } from "@/components/links/create-link-button"
import { EditLinkModal } from "@/components/links/edit-link-modal"
import {
  LinkListItem,
  SortableLinkListItem,
} from "@/components/links/link-list-item"
import { LinkListItemActions } from "@/components/links/link-list-item-actions"
import { useSiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const Route = createFileRoute("/_authenticated/bio/")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const { profileId } = useLoaderData({ from: "/_authenticated/bio" })
  const links = useQuery(api.links.queries.getProfileLinks, { profileId })
  const toggleActive = useMutation(api.links.mutations.toggleActive)
  const removeLink = useMutation(api.links.mutations.removeLink)
  const reorderLinks = useMutation(api.links.mutations.reorderLinks)
  const [openModal, setOpenModal] = useState<
    "add-link" | "add-form-link" | "edit-link" | null
  >(null)
  const [selectedLinkId, setSelectedLinkId] = useState<Id<"links"> | null>(null)
  const [sortModeOn, setSortModeOn] = useState(false)

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
    <ScrollableContainer className="p-px md:p-px space-y-5">
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
        <Card className="gap-0! py-0! overflow-hidden border-border/60 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70">
          <CardContent className="p-0">
            <DragDropProvider
              onDragEnd={(e) => {
                if (!links) {
                  return
                }

                const linksWitId = links.map((link) => ({
                  id: link._id,
                  ...link,
                }))

                const reorderedLinks = move(linksWitId, e).map(
                  ({ id }, index) => ({ linkId: id, order: index }),
                )

                reorderLinks({ links: reorderedLinks })
              }}
            >
              <ul>
                {links.map((link, index) =>
                  sortModeOn ? (
                    <SortableLinkListItem
                      key={link._id}
                      link={link}
                      index={index}
                    />
                  ) : (
                    <LinkListItem
                      key={link._id}
                      link={link}
                      actions={
                        <LinkListItemActions
                          link={link}
                          onEdit={() => onLinkEdit(link)}
                          onDelete={() => handleRemoveLink(link)}
                          onReorder={() => setSortModeOn(true)}
                          onToggleActive={() =>
                            toggleActive({
                              linkId: link._id,
                              active: !link.active,
                            })
                          }
                        />
                      }
                    />
                  ),
                )}
              </ul>
            </DragDropProvider>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {links ? `${links.length} total links` : ""}
        </div>
        {sortModeOn && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setSortModeOn(false)}
          >
            <HugeiconsIcon icon={Tick01Icon} /> Done
          </Button>
        )}
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
    </ScrollableContainer>
  )
}
