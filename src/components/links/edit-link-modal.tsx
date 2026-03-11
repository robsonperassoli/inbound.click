import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { EditLinkForm } from "./edit-link-form"

export function EditLinkModal({
  open,
  onClose,
  linkId,
}: {
  open: boolean
  onClose: () => void
  linkId: Id<"links">
}) {
  const updateLink = useMutation(api.links.mutations.updateLink)
  const link = useQuery(api.links.queries.getProfileLink, {
    linkId,
  })

  const handleSubmit = async (values: {
    title: string
    url: string | null
  }) => {
    await updateLink({
      linkId,
      title: values.title,
      url: values.url || undefined,
    })
    onClose()
  }

  if (!link) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
        </DialogHeader>

        <EditLinkForm
          defaultValues={{
            title: link.title,
            url: link.url ?? null,
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          editUrl={link.type !== "form"}
        />
      </DialogContent>
    </Dialog>
  )
}
