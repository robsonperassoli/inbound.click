import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { Temporal } from "@js-temporal/polyfill"
import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"
import { convexHttpClient } from "@/integrations/convex/provider"
import { formatToTinybirdDateTime } from "@/lib/dates"
import { getOrCreateVisitorId } from "@/lib/server/visitor-id"
import { tinybird } from "@/tinybird"

const trackLinkClick = createMiddleware().server(
  async ({ request, pathname }) => {
    const { visitorId, setCookieHeader } = getOrCreateVisitorId(request)

    if (setCookieHeader) {
      setResponseHeader("set-cookie", setCookieHeader)
    }

    const segments = pathname.split("/")
    const linkId = segments[segments.length - 1]

    const link = await convexHttpClient.query(api.public.getLinkById, {
      id: linkId as Id<"links">,
    })

    if (!link) {
      throw notFound()
    }

    await tinybird.linkClicks.ingest({
      profile_id: link.profileId,
      visitor_id: visitorId,
      link_id: link._id,
      timestamp: formatToTinybirdDateTime(Temporal.Now.instant()),
    })

    throw redirect({ href: link.url, statusCode: 302 })
  },
)

export const Route = createFileRoute("/u/$username/link/$linkId/")({
  component: () => null,
  server: {
    middleware: [trackLinkClick],
  },
})
