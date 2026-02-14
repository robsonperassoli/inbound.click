import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { authenticatedUser } from "./profiles";

export const getProfileLinks = query({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);

    const links =  await ctx.db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field('profileId'), args.profileId))
      .collect();

    return links.sort((a, b) => a.order - b.order);
  },
});

export const addLink = mutation({
  args: {
    profileId: v.id("profiles"),
    title: v.string(),
    url: v.string(),
    order: v.number(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);

    await ctx.db.insert("links", {
      userId,
      profileId: args.profileId,
      title: args.title,
      url: args.url,
      order: args.order,
      active: args.active,
    })
  },
})

export const toggleActive = mutation({
  args: {
    linkId: v.id("links"),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);

    const link =  await ctx.db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field('_id'), args.linkId))
      .unique();

    if (!link) {
      throw new Error('Link not found')
    }

    await ctx.db.patch(args.linkId, {
      active: args.active,
    })
  },
})
