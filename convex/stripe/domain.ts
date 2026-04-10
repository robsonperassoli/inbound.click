import { components } from "../_generated/api"
import type { Id } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"

export async function getAccountActiveSubscription(
  ctx: MutationCtx | QueryCtx,
  accountId: Id<"accounts">,
) {
  const subscriptions = await ctx.runQuery(
    components.stripe.public.listSubscriptionsByOrgId,
    {
      orgId: accountId,
    },
  )

  return subscriptions.filter((s) => s.status === "active")[0]
}
