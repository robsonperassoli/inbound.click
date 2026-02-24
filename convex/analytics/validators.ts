import { v } from "convex/values"

const eventsCommonfields = {
  profileId: v.id("profiles"),
  visitorId: v.string(),
}

export const pageViewFields = {
  ...eventsCommonfields,
  type: v.literal("page_view"),
  referrer: v.optional(v.string()),
  device: v.union(v.literal("mobile"), v.literal("desktop")),
}

export const linkClickFields = {
  ...eventsCommonfields,
  type: v.literal("link_click"),
  linkId: v.id("links"),
}

export const eventsSchema = v.union(
  v.object(pageViewFields),
  v.object(linkClickFields),
)
