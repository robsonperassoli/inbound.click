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
      .filter((q) => q.eq(q.field("profileId"), args.profileId))
      .collect()

    return links.sort((a, b) => a.order - b.order)
  },
})
