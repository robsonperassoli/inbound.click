import { query } from "../_generated/server"
import { authenticatedUser } from "../domain/auth"

export const me = query({
  handler: async (ctx, _args) => {
    const userId = await authenticatedUser(ctx)

    const user = await ctx.db.get(userId)

    return {
      name: user?.name,
      email: user?.email,
      avatarUrl: user?.image,
    }
  },
})
