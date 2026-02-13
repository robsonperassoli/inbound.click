import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { themeFields } from "./schema";

export const authenticatedUser = async (ctx: MutationCtx | QueryCtx) => {
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
  args: {
    username: v.string(),
    title: v.string(),
    bio: v.string(),
    ...themeFields
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (profile) {
      throw new Error('Profile already exists for user');
    }


     await ctx.db.insert("profiles", {
      userId,
      title: args.title,
      username: args.username,
       bio: args.bio,
       theme: args.theme,
       backgroundColor: args.backgroundColor,
       backgroundImage: args.backgroundImage,
       fontFamily: args.fontFamily,
       textColor: args.textColor,
       buttonShape: args.buttonShape,
       buttonStyle: args.buttonStyle,
       buttonColor: args.buttonColor,
       buttonTextColor: args.buttonTextColor,
    });
  },
});
