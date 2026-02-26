import { userQuery } from "../custom"
import { getProfileForUserId } from "./domain"

export const getProfile = userQuery({
  handler: async (ctx, _args) => {
    return await getProfileForUserId(ctx, ctx.user._id)
  },
})
