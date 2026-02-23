import type { Doc } from "@convex/_generated/dataModel"
import { useMemo } from "react"
import { ChatMessageContent } from "./chat-message-content"
import { ChatMessageForm } from "./chat-message-form"

export function Chat({
  messages,
  sendMessage,
}: {
  messages: Doc<"messages">[]
  sendMessage: (message: string) => Promise<void>
}) {
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
          onSubmit={sendMessage}
          className="w-full max-w-prose mx-auto"
        />
      </div>
    </div>
  )
}
