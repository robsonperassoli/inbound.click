import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { createFileRoute } from "@tanstack/react-router"
import { useMutation, useQuery } from "convex/react"
import { useMemo } from "react"
import { ChatMessageContent } from "@/components/chat-message-content"
import { ChatMessageForm } from "@/components/chat-message-form"

export const Route = createFileRoute("/u/$username/form/$sessionId/")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const { sessionId } = Route.useParams()
  const addMessage = useMutation(api.public.sendFormSessionMessage)
  const messages = useQuery(api.public.getFormSessionMessages, {
    sessionId: sessionId as Id<"formSubmissionChatSessions">,
  })

  const lastMessage = useMemo(() => {
    if (!messages) {
      return null
    }

    return messages[messages.length - 1]
  }, [messages])

  const reversedMessages = useMemo(
    () => (messages ? Array.from(messages).reverse() : []),
    [messages],
  )

  return (
    <div className="h-screen flex flex-col items-center">
      <div className="flex-1 overflow-auto flex flex-col-reverse w-full gap-y-4 py-8">
        {lastMessage?.status === "pending" && (
          <div className="w-full max-w-prose prose-sm mx-auto">
            <p className="italic animate-pulse text-primary">Thinking...</p>
          </div>
        )}
        {reversedMessages.map((message) => (
          <ChatMessageContent
            key={message._id}
            className="w-full max-w-prose mx-auto"
          >
            {message.content}
          </ChatMessageContent>
        ))}
      </div>
      <div className="shrink-0 w-full pb-4">
        <ChatMessageForm
          onSubmit={async (message: string) => {
            await addMessage({
              sessionId: sessionId as Id<"formSubmissionChatSessions">,
              message,
            })
          }}
          className="w-full max-w-prose mx-auto"
        />
      </div>
    </div>
  )
}
