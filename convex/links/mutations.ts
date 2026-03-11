import { v } from "convex/values"
import { userMutation } from "../custom"
import { platformField } from "./validators"

export const addLink = userMutation({
  args: {
    profileId: v.id("profiles"),
    title: v.string(),
    order: v.number(),
    active: v.boolean(),
    details: v.union(
      v.object({
        type: v.literal("url"),
        url: v.string(),
      }),
      v.object({
        type: v.literal("form"),
        formId: v.id("forms"),
      }),
      v.object({
        type: v.literal("social"),
        platform: platformField,
        url: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("links", {
      userId: ctx.user._id,
      profileId: args.profileId,
      title: args.title,
      order: args.order,
      active: args.active,
      type: args.details.type,
      url:
        args.details.type === "url" || args.details.type === "social"
          ? args.details.url
          : undefined,
      formId: args.details.type === "form" ? args.details.formId : undefined,
      platform:
        args.details.type === "social" ? args.details.platform : undefined,
    })
  },
})

export const toggleActive = userMutation({
  args: {
    linkId: v.id("links"),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", ctx.user._id))
      .filter((q) => q.eq(q.field("_id"), args.linkId))
      .unique()

    if (!link) {
      throw new Error("Link not found")
    }

    await ctx.db.patch(args.linkId, {
      active: args.active,
    })
  },
})

export const updateLink = userMutation({
  args: {
    linkId: v.id("links"),
    title: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", ctx.user._id))
      .filter((q) => q.eq(q.field("_id"), args.linkId))
      .unique()

    if (!link) {
      throw new Error("Link not found")
    }

    await ctx.db.patch(args.linkId, {
      title: args.title,
      url: args.url,
    })
  },
})

export const removeLink = userMutation({
  args: {
    linkId: v.id("links"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", ctx.user._id))
      .filter((q) => q.eq(q.field("_id"), args.linkId))
      .unique()

    if (!link) {
      throw new Error("Link not found")
    }

    await ctx.db.delete(args.linkId)
  },
})

export const reorderLinks = userMutation({
  args: {
    links: v.array(
      v.object({
        linkId: v.id("links"),
        order: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const { linkId, order } of args.links) {
      const link = await ctx.db.get("links", linkId)

      if (!link || link.userId !== ctx.user._id) {
        throw new Error(`Link ${linkId} not found`)
      }

      await ctx.db.patch(linkId, { order })
    }
  },
})
