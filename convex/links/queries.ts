import { v } from "convex/values"
import { userQuery } from "../custom"
import * as domain from "./domain"

export const getProfileLinks = userQuery({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    const links = await domain.getProfileLinks(ctx, args.profileId)

    return links.filter((l) => l.userId === ctx.user._id)
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
