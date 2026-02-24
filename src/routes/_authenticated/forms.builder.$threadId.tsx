import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { createFileRoute } from "@tanstack/react-router"
import { useMutation, useQuery } from "convex/react"
import { Chat } from "@/components/chat"
import { FormPreview } from "@/components/form-preview"

export const Route = createFileRoute("/_authenticated/forms/builder/$threadId")(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  const { threadId } = Route.useParams()
  const thread = useQuery(api.threads.queries.getFullThread, {
    threadId: threadId as Id<"threads">,
  })
  const sendMessage = useMutation(api.threads.mutations.addMessage)

  return (
    <div className="flex gap-x-4">
      {thread?.formId ? (
        <FormPreview formId={thread.formId} />
      ) : (
        <div>Awaiting for form...</div>
      )}

      <Chat
        messages={thread?.messages ?? []}
        sendMessage={async (message) => {
          await sendMessage({ threadId: threadId as Id<"threads">, message })
        }}
      />
    </div>
  )
}
