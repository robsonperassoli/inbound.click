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
    const userId = ctx.user._id
    const orgId = ctx.account._id

    // Get or create a Stripe customer
    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId: userId,
      email: ctx.user.email,
      name: ctx.user.name,
    })

    // Create checkout session
    return await stripeClient.createCheckoutSession(ctx, {
      priceId: args.priceId,
      customerId: customer.customerId,
      mode: "subscription",
      successUrl: `${SITE_URL}/bio?success=true`,
      cancelUrl: `${SITE_URL}/bio?canceled=true`,
      subscriptionMetadata: { userId, orgId },
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
    const orgId = ctx.account._id

    // Find customer ID from subscriptions or payments
    const subscription = await ctx.runQuery(
      components.stripe.public.getSubscriptionByOrgId,
      { orgId },
    )

    if (subscription) {
      return await stripeClient.createCustomerPortalSession(ctx, {
        customerId: subscription.stripeCustomerId,
        returnUrl: `${SITE_URL}/bio`,
      })
    }

    const payments = await ctx.runQuery(
      components.stripe.public.listPaymentsByOrgId,
      { orgId },
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
