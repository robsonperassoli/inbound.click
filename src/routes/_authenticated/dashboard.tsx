import { api } from "@convex/_generated/api"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const profile = await context.convex.query(api.profiles.getProfile, {})

    if (!profile) {
      throw redirect({ to: "/onboarding" })
    }

    return { profile }
  },
  ssr: false,
})

function RouteComponent() {
  const { profile } = Route.useLoaderData()

  return (
    <div>
      <h1>Welcome, {profile.title}!</h1>
    </div>
  )
}
