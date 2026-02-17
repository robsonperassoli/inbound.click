import { api } from "@convex/_generated/api"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/u/$username/form/")({
  beforeLoad: async ({ context, params }) => {
    const sessionId = await context.convex.mutation(
      api.public.startFormSession,
      {
        username: params.username,
      },
    )

    throw redirect({
      to: "/u/$username/form/$sessionId",
      params: { sessionId, username: params.username },
    })
  },
  ssr: false,
})
