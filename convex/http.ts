import { registerRoutes } from "@convex-dev/stripe"
import { httpRouter } from "convex/server"
import type Stripe from "stripe"
import { components, internal } from "./_generated/api"
import type { Id } from "./_generated/dataModel"
import { httpAction } from "./_generated/server"
import { authKit } from "./auth"
import { resend } from "./emails"

const http = httpRouter()

authKit.registerRoutes(http)

// Register Stripe webhook handler at /stripe/webhook
registerRoutes(http, components.stripe, {
  webhookPath: "/stripe/webhook",
  events: {
    "customer.subscription.created": async (
      ctx,
      event: Stripe.CustomerSubscriptionCreatedEvent,
    ) => {
      const subscription = event.data.object
      const isTeamSubscription = subscription.metadata.planType === "teams"
      const accountId = subscription.metadata.orgId as Id<"accounts">
      if (isTeamSubscription) {
        await ctx.runMutation(internal.accounts.mutations.updateToTeamAccount, {
          accountId,
        })
      }

      console.log("Subscription created:", subscription.id, subscription.status)
    },

    "customer.subscription.updated": async (
      ctx,
      event: Stripe.CustomerSubscriptionUpdatedEvent,
    ) => {
      const subscription = event.data.object
      console.log("Subscription updated:", subscription.id, subscription.status)
      // Add custom logic here
    },
  },
})

http.route({
  path: "/resend/webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return await resend.handleResendEventWebhook(ctx, req)
  }),
})

export default http
