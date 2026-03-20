import { api } from "@convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { Temporal } from "@js-temporal/polyfill"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { createMiddleware, useServerFn } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"
import { useState } from "react"
import { UnpublishedProfilePage } from "@/components/unpublished-profile-page"
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

    try {
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      if (errorMessage.toLowerCase().includes("profile not found")) {
        return await next()
      }
      throw error
    }

    return await next()
  },
)

export const Route = createFileRoute("/$username/")({
  component: RouteComponent,
  server: {
    middleware: [trackPageView],
  },
  loader: async ({ context, params }) => {
    try {
      const { profile, links } = await context.queryClient.ensureQueryData(
        convexQuery(api.public.getProfile, {
          username: params.username,
        }),
      )

      const linksWithRedirect = links.map((l) => ({
        ...l,
        url: `/${profile.username}/link/${l._id}`,
      }))

      return {
        profile,
        links: linksWithRedirect,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      if (errorMessage.toLowerCase().includes("profile not found")) {
        throw notFound()
      }
      throw error
    }
  },
  head: ({ loaderData }) => {
    const profile = loaderData?.profile
    if (!profile) {
      return {
        meta: [{ title: "Profile Not Found" }],
      }
    }

    const title = profile.title || `${profile.username}'s Profile`
    const description =
      profile.bio || `Check out ${profile.username}'s profile on Superbio`
    const url = `https://s.uper.bio/${profile.username}`

    const meta = [
      { title: title },
      { name: "description", content: description },

      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "Superbio" },

      {
        name: "twitter:card",
        content: profile.avatarUrl ? "summary_large_image" : "summary",
      },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },

      { name: "robots", content: "index, follow" },
      { rel: "canonical", href: url },
    ]

    if (profile.avatarUrl) {
      meta.push({ property: "og:image", content: profile.avatarUrl })
      meta.push({ name: "twitter:image", content: profile.avatarUrl })
    }

    return { meta }
  },
})

function RouteComponent() {
  const startFormSession = useServerFn(startFormSessionServer)
  const { profile, links } = Route.useLoaderData()
  const [sessionId, setSessionId] = useState<string>()
  const [formOpen, setFormOpen] = useState(false)

  // Check if profile is not published
  if (!profile.publishedAt) {
    return <UnpublishedProfilePage username={profile.username} />
  }

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
      <title>{profile.title}</title>
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
