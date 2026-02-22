import { query } from "../_generated/server"
import * as auth from "../domain/auth"

export const getProfile = query({
  handler: async (ctx, _args) => {
    const userId = await auth.authenticatedUser(ctx)
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique()

    if (!profile) {
      throw new Error("Profile not found")
    }

    return {
      ...profile,
      avatarUrl: profile?.avatarId
        ? await ctx.storage.getUrl(profile.avatarId)
        : null,
    }
  },
})
