import { api } from "@convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { Temporal } from "@js-temporal/polyfill"
import { createFileRoute } from "@tanstack/react-router"
import { createMiddleware, useServerFn } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"
import { useState } from "react"
import { UserPage, type UserPageLink } from "@/components/user-page"
import { ChatPopup } from "@/components/user-page/chat-popup"
import { convexHttpClient } from "@/integrations/convex/provider"
import { extractReferrerName } from "@/lib/analytics"
import { formatToTinybirdDateTime } from "@/lib/dates"
import { startFormSession as startFormSessionServer } from "@/lib/server/user-page.functions"
import { getOrCreateVisitorId } from "@/lib/server/visitor-id"
import { tinybird } from "@/tinybird"

const trackPageView = createMiddleware().server(
  async ({ request, pathname, next }) => {
    const { visitorId, setCookieHeader } = getOrCreateVisitorId(request)
    const userAgent = request.headers.get("user-agent") ?? ""
    const isBot = /bot|crawl|spider/i.test(userAgent)

    if (setCookieHeader) setResponseHeader("set-cookie", setCookieHeader)

    const segments = pathname.split("/")
    const username = segments[segments.length - 1]

    const viewPageData = await convexHttpClient.query(api.public.getProfile, {
      username,
    })

    if (!isBot) {
      await tinybird.pageViews.ingest({
        profile_id: viewPageData.profile._id,
        visitor_id: visitorId,
        timestamp: formatToTinybirdDateTime(Temporal.Now.instant()),
        referrer: request.headers.get("referer") ?? null,
        referrer_name: extractReferrerName(request.headers.get("referer")),
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
    const { profile, links } = await context.queryClient.ensureQueryData(
      convexQuery(api.public.getProfile, {
        username: params.username,
      }),
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
  const startFormSession = useServerFn(startFormSessionServer)
  const { profile, links } = Route.useLoaderData()
  const [sessionId, setSessionId] = useState<string>()
  const [formOpen, setFormOpen] = useState(false)

  const onFormLinkClick = async (link: UserPageLink) => {
    if (!link.formId) {
      return
    }

    if (sessionId) {
      setFormOpen(true)
      return
    }

    const newSessionId = await startFormSession({
      data: {
        formId: link.formId,
        linkId: link._id,
        profileId: profile._id,
      },
    })

    setSessionId(newSessionId)
    setFormOpen(true)
  }

  return (
    <>
      <UserPage
        profile={profile}
        links={links}
        className="h-screen"
        onFormLinkClick={onFormLinkClick}
      />
      {sessionId && (
        <ChatPopup
          sessionId={sessionId}
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onOpen={() => setFormOpen(true)}
        />
      )}
    </>
  )
}
