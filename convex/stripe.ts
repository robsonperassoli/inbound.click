import { StripeSubscriptions } from "@convex-dev/stripe"
import { v } from "convex/values"
import { components } from "./_generated/api"
import { userAction } from "./custom"

const stripeClient = new StripeSubscriptions(components.stripe, {})

// Create a checkout session for a subscription
export const createSubscriptionCheckout = userAction({
  args: { priceId: v.string() },
  returns: v.object({
    sessionId: v.string(),
    url: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    // Get or create a Stripe customer
    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId: ctx.user._id,
      email: identity.email,
      name: identity.name,
    })

    // Create checkout session
    return await stripeClient.createCheckoutSession(ctx, {
      priceId: args.priceId,
      customerId: customer.customerId,
      mode: "subscription",
      successUrl: "http://localhost:3000/?success=true",
      cancelUrl: "http://localhost:3000/?canceled=true",
      subscriptionMetadata: { userId: identity.subject },
    })
  },
})

// Create a checkout session for a one-time payment
export const createPaymentCheckout = userAction({
  args: { priceId: v.string() },
  returns: v.object({
    sessionId: v.string(),
    url: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId: ctx.user._id,
      email: identity.email,
      name: identity.name,
    })

    return await stripeClient.createCheckoutSession(ctx, {
      priceId: args.priceId,
      customerId: customer.customerId,
      mode: "payment",
      successUrl: "http://localhost:3000/?success=true",
      cancelUrl: "http://localhost:3000/?canceled=true",
      paymentIntentMetadata: { userId: identity.subject },
    })
  },
})
