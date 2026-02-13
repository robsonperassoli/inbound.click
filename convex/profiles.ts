import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const authenticatedUser = async (ctx: MutationCtx | QueryCtx) => {
  const userId = await getAuthUserId(ctx);

  if (userId === null) {
    throw new Error("Client is not authenticated!");
  }

  return userId;
};

export const getProfile = query({
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);

    return await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const createProfile = mutation({
  args: {},
  handler: async (ctx, _args) => {
    // get authed user
    // check if user has a profile
    // create a profile if not
    const userId = await authenticatedUser(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", userId))
      .unique();

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (profile) {
      return profile;
    }

    const username =
      user?.email?.split("@")[0] ?? new Date().getTime().toString();

    return await ctx.db.insert("profiles", {
      userId,
      title: user?.name || "My links",
      username,
      avatarUrl: user?.image,
      bio: "Hello",
    });
  },
});
