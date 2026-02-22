import { getAuthUserId } from "@convex-dev/auth/server"
import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server"

export const authenticatedUser = async (
  ctx: MutationCtx | ActionCtx | QueryCtx,
) => {
  const userId = await getAuthUserId(ctx)

  if (userId === null) {
    throw new Error("Client is not authenticated!")
  }

  return userId
}
