import { api } from "@convex/_generated/api"
import { Temporal } from "@js-temporal/polyfill"
import { createFileRoute } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"
import { UserPage } from "@/components/user-page"
import { convexQueryClient } from "@/integrations/convex/provider"
import { formatToTinybirdDateTime } from "@/lib/dates"
import { getOrCreateVisitorId } from "@/lib/server/visitor-id"
import { tinybird } from "@/tinybird"

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
      await tinybird.pageViews.ingest({
        profile_id: viewPageData.profile._id,
        visitor_id: visitorId,
        timestamp: formatToTinybirdDateTime(Temporal.Now.instant()),
        referrer: request.headers.get("referer") ?? null,
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
    const { profile, links } = await context.convex.query(
      api.public.getProfile,
      {
        username: params.username,
      },
    )

    const linksWithRedirect = links.map((l) => ({
      ...l,
      url: `/u/${profile.username}/link/${l._id}`,
    }))

    return {
      profile,
      links: linksWithRedirect,
    }
  },
})

function RouteComponent() {
  const { profile, links } = Route.useLoaderData()

  return <UserPage profile={profile} links={links} className="h-screen" />
}
