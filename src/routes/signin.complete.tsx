import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/signin/complete")({
  ssr: false,
  beforeLoad: () => {
    throw redirect({ to: "/bio", reloadDocument: true })
  },
})
