import { createFileRoute, redirect } from "@tanstack/react-router"
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/logout")({
  ssr: false,
  beforeLoad: async () => {
    await authClient.signOut()

    throw redirect({ to: "/" })
  },
})
