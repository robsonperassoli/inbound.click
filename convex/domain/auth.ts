import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server"
import { authComponent } from "../auth"

export const authenticatedUser = async (
  ctx: MutationCtx | ActionCtx | QueryCtx,
) => {
  const user = await authComponent.safeGetAuthUser(ctx)

  return user?._id
}
