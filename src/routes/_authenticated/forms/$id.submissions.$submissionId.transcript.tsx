import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "convex/react"
import { useMemo } from "react"
import { ChatMessageContent } from "@/components/chat-message-content"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export const Route = createFileRoute(
  "/_authenticated/forms/$id/submissions/$submissionId/transcript",
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { id, submissionId } = Route.useParams()
  const navigate = useNavigate()
  const chat = useQuery(api.threads.queries.getUserFormSubmissionTranscript, {
    formSubmissionId: submissionId as Id<"formSubmissions">,
  })

  const reversedMessages = useMemo(
    () => (chat?.messages ? Array.from(chat?.messages).reverse() : []),
    [chat?.messages],
  )

  return (
    <Sheet
      modal={false}
      open
      onOpenChange={() =>
        navigate({
          to: "/forms/$id/submissions",
          params: { id },
          replace: true,
        })
      }
    >
      <SheetContent>
        <div className="p-4 overflow-auto flex flex-col-reverse gap-y-4">
          {reversedMessages.map((message) => {
            const isUserMessage = message.role === "user"

            return (
              <div
                key={message._id}
                className={cn("w-full", isUserMessage && "flex justify-end")}
              >
                <ChatMessageContent
                  className={cn(
                    isUserMessage
                      ? "max-w-[min(75%,36rem)] rounded-2xl rounded-br-md border border-primary/20 bg-primary/15 px-4 py-3 text-foreground shadow-sm prose-p:my-0 prose-headings:text-foreground prose-strong:text-foreground prose-a:text-foreground prose-code:text-foreground prose-blockquote:text-foreground/90 prose-li:marker:text-foreground/70"
                      : "max-w-prose w-full",
                  )}
                >
                  {message.content}
                </ChatMessageContent>
              </div>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
