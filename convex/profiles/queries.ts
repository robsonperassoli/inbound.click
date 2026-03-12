import { v } from "convex/values"
import { userQuery } from "../custom"
import * as links from "../links/domain"
import { getProfileForUserId, isProfileUsernameAvailable } from "./domain"

export const getProfile = userQuery({
  handler: async (ctx, _args) => {
    return await getProfileForUserId(ctx, ctx.user._id)
  },
})

export const getProfileWithLinks = userQuery({
  handler: async (ctx, _args) => {
    const profile = await getProfileForUserId(ctx, ctx.user._id)
    if (!profile) {
      return null
    }

    return {
      profile,
      links: await links.getProfileLinks(ctx, profile._id),
    }
  },
})

export const isUsernameAvailable = userQuery({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    return await isProfileUsernameAvailable(ctx, args.username)
  },
})
