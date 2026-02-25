import { api } from "@convex/_generated/api"
import { createFileRoute } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"
import { UserPage } from "@/components/user-page"
import { convexQueryClient } from "@/integrations/convex/provider"
import { getOrCreateVisitorId } from "@/lib/server/visitor-id"

const convexClient = convexQueryClient.convexClient

const trackPageView = createMiddleware().server(
  async ({ request, pathname, next }) => {
    const { visitorId, setCookieHeader } = getOrCreateVisitorId(request)
    const userAgent = request.headers.get("user-agent") ?? ""
    const isBot = /bot|crawl|spider/i.test(userAgent)

    if (setCookieHeader) setResponseHeader("set-cookie", setCookieHeader)

    const segments = pathname.split("/")
    const username = segments[segments.length - 1]

    const viewPageData = await convexClient.query(api.public.getProfile, {
      username,
    })

    if (!isBot) {
      await convexClient.mutation(api.analytics.mutations.trackPageView, {
        type: "page_view",
        profileId: viewPageData.profile._id,
        visitorId,
        referrer: request.headers.get("referer") ?? undefined,
        device: /mobile/i.test(userAgent) ? "mobile" : "desktop",
      })
    }

    return await next()
  },
)

export const Route = createFileRoute("/u/$username/")({
  component: RouteComponent,
  server: {
    middleware: [trackPageView],
  },
  loader: async ({ context, params }) => {
    const viewPageData = await context.convex.query(api.public.getProfile, {
      username: params.username,
    })

    return viewPageData
  },
})

function RouteComponent() {
  const { profile, links } = Route.useLoaderData()
  return <UserPage profile={profile} links={links} className="h-screen" />
}
