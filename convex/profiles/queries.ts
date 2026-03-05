import { v } from "convex/values"
import { userQuery } from "../custom"
import { getProfileForUserId, isProfileUsernameAvailable } from "./domain"

export const getProfile = userQuery({
  handler: async (ctx, _args) => {
    return await getProfileForUserId(ctx, ctx.user._id)
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
