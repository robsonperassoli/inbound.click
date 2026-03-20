import { components } from "../_generated/api"
import type { MutationCtx, QueryCtx } from "../_generated/server"

export async function getUserActiveSubscription(
  ctx: MutationCtx | QueryCtx,
  userId: string,
) {
  const subscriptions = await ctx.runQuery(
    components.stripe.public.listSubscriptionsByUserId,
    { userId },
  )

  const activeSubscription = subscriptions.find((s) => s.status === "active")

  return activeSubscription
}
