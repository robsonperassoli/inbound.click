import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { createFileRoute } from "@tanstack/react-router"
import { useMutation, useQuery } from "convex/react"
import { Chat } from "@/components/chat"

export const Route = createFileRoute("/u/$username/form/$sessionId/")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const { sessionId } = Route.useParams()
  const addMessage = useMutation(api.public.sendFormSessionMessage)
  const messages = useQuery(api.public.getFormSessionMessages, {
    sessionId: sessionId as Id<"threads">,
  })

  return (
    <Chat
      messages={messages ?? []}
      sendMessage={async (message: string) => {
        await addMessage({
          sessionId: sessionId as Id<"threads">,
          message,
        })
      }}
    />
  )
}
