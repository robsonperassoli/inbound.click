import { components } from "../_generated/api"
import type { Id } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"

export async function getAccountActiveSubscription(
  ctx: MutationCtx | QueryCtx,
  accountId: Id<"accounts">,
) {
  const subscription = await ctx.runQuery(
    components.stripe.public.getSubscriptionByOrgId,
    { orgId: accountId },
  )

  if (!subscription || subscription.status !== "active") {
    return null
  }

  return subscription
}
