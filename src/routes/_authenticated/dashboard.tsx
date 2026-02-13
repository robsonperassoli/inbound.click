import { createFileRoute, Outlet } from "@tanstack/react-router";
import { api } from "@convex/_generated/api";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const profile = await context.convex.query(api.profiles.getProfile, {});

    return { profile };
  },
  ssr: false,
});

function RouteComponent() {
  const { profile } = Route.useLoaderData();

  return profile ? <Outlet /> : <OnboardingDialog />;
}
