import { api } from "@convex/_generated/api"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  return <Outlet />
}
