import type { QueryCtx } from "../_generated/server"
import { authComponent } from "../auth"

export async function getAuthUser(ctx: QueryCtx) {
  const { _id: authId } = await authComponent.getAuthUser(ctx)

  const user = await ctx.db
    .query("users")
    .withIndex("by_auth", (q) => q.eq("authId", authId))
    .unique()

  if (!user) {
    throw new Error("Not authenticated")
  }

  return user
}
