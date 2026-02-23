import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { createFileRoute } from "@tanstack/react-router"
import { useMutation, useQuery } from "convex/react"
import { Chat } from "@/components/chat"

export const Route = createFileRoute("/_authenticated/forms/builder/$threadId")(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  const { threadId } = Route.useParams()
  const messages = useQuery(api.threads.queries.getChatMessages, {
    threadId: threadId as Id<"threads">,
  })
  const sendMessage = useMutation(api.threads.mutations.addMessage)

  return (
    <Chat
      messages={messages ?? []}
      sendMessage={async (message) => {
        await sendMessage({ threadId: threadId as Id<"threads">, message })
      }}
    />
  )
}
