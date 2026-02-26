import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { tinybird } from "@/tinybird"

const dateRangeSchema = z.object({
  profileId: z.string(),
  start: z.string(),
  end: z.string(),
})

export const getOverview = createServerFn({ method: "GET" })
  .inputValidator(dateRangeSchema)
  .handler(async ({ data: { start, end, profileId } }) => {
    const params = {
      profile_id: profileId,
      start_date: start,
      end_date: end,
    }

    const [linkClicks, overview, deviceBreakdown, referrerBreakdown] =
      await Promise.all([
        tinybird.linkClicksByLink.query({
          ...params,
          limit: 10,
          offset: 0,
        }),
        tinybird.overview.query(params),
        tinybird.deviceBreakdown.query({ ...params, limit: 10 }),
        tinybird.referrerBreakdown.query({ ...params, limit: 20 }),
        tinybird.referrerBreakdown.query({ ...params, limit: 20 }),
      ])

    return {
      linkClicks: linkClicks.data ?? null,
      overview: overview.data[0] ?? null,
      deviceBreakdown: deviceBreakdown.data ?? null,
      referrerBreakdown: referrerBreakdown.data ?? null,
    }
  })
