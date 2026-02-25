import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"
import { convexQueryClient } from "@/integrations/convex/provider"
import { getOrCreateVisitorId } from "@/lib/server/visitor-id"

const convexClient = convexQueryClient.convexClient

const trackLinkClick = createMiddleware().server(
  async ({ request, pathname }) => {
    const { visitorId, setCookieHeader } = getOrCreateVisitorId(request)

    if (setCookieHeader) {
      setResponseHeader("set-cookie", setCookieHeader)
    }

    const segments = pathname.split("/")
    const linkId = segments[segments.length - 1]

    const link = await convexClient.query(api.public.getLinkById, {
      id: linkId as Id<"links">,
    })

    if (!link) {
      throw notFound()
    }

    await convexClient.mutation(api.analytics.mutations.trackLinkClick, {
      type: "link_click",
      profileId: link.profileId,
      linkId: link._id,
      visitorId,
    })

    throw redirect({ href: link.url, statusCode: 302 })
  },
)

export const Route = createFileRoute("/u/$username/link/$linkId")({
  component: () => null,
  server: {
    middleware: [trackLinkClick],
  },
})
