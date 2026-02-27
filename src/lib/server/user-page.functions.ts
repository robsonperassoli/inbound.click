import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { Temporal } from "@js-temporal/polyfill"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import z from "zod"
import { convexHttpClient } from "@/integrations/convex/provider"
import { tinybird } from "@/tinybird"
import { formatToTinybirdDateTime } from "../dates"
import { getOrCreateVisitorId } from "./visitor-id"

const formSessionInputSchema = z.object({
  profileId: z.string(),
  formId: z.string(),
  linkId: z.string(),
})

export const startFormSession = createServerFn({ method: "POST" })
  .inputValidator(formSessionInputSchema)
  .handler(async ({ data: { profileId, formId, linkId } }) => {
    const request = getRequest()
    const { visitorId } = getOrCreateVisitorId(request)

    await tinybird.linkClicks.ingest({
      profile_id: profileId,
      visitor_id: visitorId,
      link_id: linkId,
      timestamp: formatToTinybirdDateTime(Temporal.Now.instant()),
    })

    const sessionId = await convexHttpClient.mutation(
      api.public.startFormSession,
      {
        profileId: profileId as Id<"profiles">,
        formId: formId as Id<"forms">,
      },
    )

    return sessionId
  })
