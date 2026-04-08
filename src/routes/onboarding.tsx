import { api } from "@convex/_generated/api"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { OnboardingPage } from "@/components/onboarding-page"
import { ensureAuthenticated } from "@/lib/auth"

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  loader: async ({ context, location }) => {
    await ensureAuthenticated(location.pathname)

    const onboarding = await context.convexClient.query(
      api.profiles.queries.getOnboardingProfileDraft,
      {},
    )

    if (onboarding.hasExistingProfiles) {
      throw redirect({ to: "/bio" })
    }

    return onboarding
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { draft, greetingName } = Route.useLoaderData()

  return <OnboardingPage draft={draft} greetingName={greetingName} />
}
