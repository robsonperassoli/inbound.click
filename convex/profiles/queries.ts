import { query } from "../_generated/server"
import * as auth from "../domain/auth"
import { getProfileForUserId } from "./domain"

export const getProfile = query({
  handler: async (ctx, _args) => {
    const userId = await auth.authenticatedUser(ctx)

    return await getProfileForUserId(ctx, userId)
  },
})
