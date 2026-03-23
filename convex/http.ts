import { registerRoutes } from "@convex-dev/stripe"
import { httpRouter } from "convex/server"
import type Stripe from "stripe"
import { components } from "./_generated/api"
import { httpAction } from "./_generated/server"
import { authComponent, createAuth } from "./auth"
import { resend } from "./emails"

const http = httpRouter()

authComponent.registerRoutes(http, createAuth)

// Register Stripe webhook handler at /stripe/webhook
registerRoutes(http, components.stripe, {
  webhookPath: "/stripe/webhook",
  events: {
    "customer.subscription.created": async (
      ctx,
      event: Stripe.CustomerSubscriptionCreatedEvent,
    ) => {
      const subscription = event.data.object
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
