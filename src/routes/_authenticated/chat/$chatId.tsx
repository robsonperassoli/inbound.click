import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { createFileRoute } from "@tanstack/react-router"
import { useAction, useMutation, useQuery } from "convex/react"
import { useEffect, useMemo } from "react"
import { ChatMessageContent } from "@/components/chat-message-content"
import { ChatMessageForm } from "@/components/chat-message-form"
import { Spinner } from "@/components/ui/spinner"

export const Route = createFileRoute("/_authenticated/chat/$chatId")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const { chatId } = Route.useParams()
  const chatGeneration = useAction(api.chats.chat)
  const addMessage = useMutation(api.chats.addMessage)
  const messages = useQuery(api.chats.getChatMessages, {
    chatId: chatId as Id<"chats">,
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

  const startCompletion = async () => {
    chatGeneration({ chatId: chatId as Id<"chats"> })
  }

  useEffect(() => {
    if (!lastMessage) {
      return
    }
    if (lastMessage.status === "pending") {
      startCompletion()
    }
  }, [lastMessage])

  return (
    <div className="h-screen flex flex-col items-center">
      <div className="flex-1 overflow-auto flex flex-col-reverse w-full gap-y-4 py-8">
        {lastMessage?.status === "pending" && <Spinner />}
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
            await addMessage({ chatId: chatId as Id<"chats">, message })
          }}
          className="w-full max-w-prose mx-auto"
        />
      </div>
    </div>
  )
}
