import { v } from "convex/values"
import { userQuery } from "../custom"

export const getProfileLinks = userQuery({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", ctx.user._id))
      .collect()

    return links
      .filter((l) => l.profileId === args.profileId)
      .sort((a, b) => a.order - b.order)
  },
})

export const getProfileLink = userQuery({
  args: {
    linkId: v.id("links"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db.get("links", args.linkId)
    if (!link || link.userId !== ctx.user._id) {
      throw new Error("Link not found")
    }

    return link
  },
})
