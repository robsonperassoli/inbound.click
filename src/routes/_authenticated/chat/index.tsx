import { api } from "@convex/_generated/api"
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { useMutation } from "convex/react"
import { ChatMessageForm } from "@/components/chat-message-form"

export const Route = createFileRoute("/_authenticated/chat/")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const createChat = useMutation(api.chats.createChat)
  const navigate = useNavigate()

  const sendMessage = async (message: string) => {
    const { chatId } = await createChat({ message })

    navigate({ to: "/chat/$chatId", params: { chatId } })
  }

  return (
    <>
      <Outlet />
      <div className="h-screen flex items-center justify-center">
        <ChatMessageForm className="w-3/4 max-w-2xl" onSubmit={sendMessage} />
      </div>
    </>
  )
}
