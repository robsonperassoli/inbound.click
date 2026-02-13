import { query } from "./_generated/server";
import { v } from "convex/values";

export const getProfile = query({
  args: {
    username: v.string()
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique()

    if (!profile) {
      throw new Error('Not found')
    }

    const unsortedLinks = await ctx.db.query("links")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id)).collect()

    const links = unsortedLinks.sort((a, b) => b.order - a.order)

    return {
      profile,
      links
    };
  },
});
