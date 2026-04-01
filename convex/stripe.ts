import { StripeSubscriptions } from "@convex-dev/stripe"
import { v } from "convex/values"
import { components } from "./_generated/api"
import { userAction } from "./custom"
import { SITE_URL } from "./frontend"

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
    const userId = ctx.user._id
    // Get or create a Stripe customer
    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId: userId,
      email: identity.email,
      name: identity.name,
    })

    // Create checkout session
    return await stripeClient.createCheckoutSession(ctx, {
      priceId: args.priceId,
      customerId: customer.customerId,
      mode: "subscription",
      successUrl: `${SITE_URL}/bio?success=true`,
      cancelUrl: `${SITE_URL}/bio?canceled=true`,
      subscriptionMetadata: { userId },
    })
  },
})

export const getCustomerPortalUrl = userAction({
  args: {},
  returns: v.union(
    v.object({
      url: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, _args) => {
    const userId = ctx.user._id

    // Find customer ID from subscriptions or payments
    const subscriptions = await ctx.runQuery(
      components.stripe.public.listSubscriptionsByUserId,
      { userId },
    )

    if (subscriptions.length > 0) {
      return await stripeClient.createCustomerPortalSession(ctx, {
        customerId: subscriptions[0].stripeCustomerId,
        returnUrl: `${SITE_URL}/bio`,
      })
    }

    const payments = await ctx.runQuery(
      components.stripe.public.listPaymentsByUserId,
      { userId },
    )

    if (payments.length > 0 && payments[0].stripeCustomerId) {
      return await stripeClient.createCustomerPortalSession(ctx, {
        customerId: payments[0].stripeCustomerId,
        returnUrl: `${SITE_URL}/bio`,
      })
    }

    // No customer found
    return null
  },
})
