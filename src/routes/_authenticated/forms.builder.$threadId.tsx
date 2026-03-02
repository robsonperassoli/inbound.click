import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation, useQuery } from "convex/react"
import z from "zod"
import { Chat } from "@/components/chat"
import { EmptyFormPreview, FormPreview } from "@/components/form-preview"
import { useSiteHeader } from "@/components/site-header"

export const Route = createFileRoute("/_authenticated/forms/builder/$threadId")(
  {
    validateSearch: z.object({ returnTo: z.enum(["bio"]) }),
    component: RouteComponent,
  },
)

function RouteComponent() {
  useSiteHeader({ title: "Form Builder" })

  const { threadId } = Route.useParams()
  const { returnTo } = Route.useSearch()
  const navigate = useNavigate()
  const thread = useQuery(api.threads.queries.getFullThread, {
    threadId: threadId as Id<"threads">,
  })
  const sendMessage = useMutation(api.threads.mutations.addMessage)

  return (
    <div className="flex flex-1">
      <div className="grow overflow-auto p-4">
        {thread?.formId ? (
          <FormPreview
            formId={thread.formId}
            onDoneClicked={() => {
              if (returnTo === "bio") {
                navigate({ to: "/bio" })
              }
            }}
          />
        ) : (
          <EmptyFormPreview />
        )}
      </div>

      <div className="w-96 border-l flex">
        <Chat
          viewType="sidebar"
          messages={thread?.messages ?? []}
          sendMessage={async (message) => {
            await sendMessage({ threadId: threadId as Id<"threads">, message })
          }}
        />
      </div>
    </div>
  )
}
