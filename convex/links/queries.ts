import { v } from "convex/values"
import { query } from "../_generated/server"
import * as auth from "../domain/auth"

export const getProfileLinks = query({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.authenticatedUser(ctx)

    const links = await ctx.db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("profileId"), args.profileId))
      .collect()

    return links.sort((a, b) => a.order - b.order)
  },
})
