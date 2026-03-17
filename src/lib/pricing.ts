export type PricingPlanId = "starter" | "pro" | "team"
export type BillingCycle = "monthly" | "yearly"

export type PriceConfig = {
  priceLabel: string
  period: string
  equivalent?: string
  badge?: string
  stripePriceId?: string
}

const env = import.meta.env

export const PRICING: Record<
  PricingPlanId,
  Record<BillingCycle, PriceConfig>
> = {
  starter: {
    monthly: {
      priceLabel: "$9",
      period: "/mo",
      stripePriceId: env.VITE_STRIPE_STARTER_PRICE_ID,
    },
    yearly: {
      priceLabel: "$99",
      period: "/yr",
      equivalent: "equiv. $8.25/mo",
      badge: "Save $10/year",
      stripePriceId: env.VITE_STRIPE_STARTER_PRICE_YEARLY_ID,
    },
  },
  pro: {
    monthly: {
      priceLabel: "$19",
      period: "/mo",
      stripePriceId: env.VITE_STRIPE_PRO_PRICE_ID,
    },
    yearly: {
      priceLabel: "$178",
      period: "/yr",
      equivalent: "equiv. $14.83/mo",
      badge: "Save $50/year",
      stripePriceId: env.VITE_STRIPE_PRO_PRICE_YEARLY_ID,
    },
  },
  team: {
    monthly: {
      priceLabel: "Custom",
      period: "",
      equivalent: "For teams and agencies",
      badge: "Custom Pricing",
    },
    yearly: {
      priceLabel: "Custom",
      period: "",
      equivalent: "For teams and agencies",
      badge: "Custom Pricing",
    },
  },
}

export function getPlanIdForPriceId(
  priceId: string | null | undefined,
): PricingPlanId | "free" {
  if (!priceId) {
    return "free"
  }

  if (
    [
      env.VITE_STRIPE_STARTER_PRICE_ID,
      env.VITE_STRIPE_STARTER_PRICE_YEARLY_ID,
    ].includes(priceId)
  ) {
    return "starter"
  }

  if (
    [
      env.VITE_STRIPE_PRO_PRICE_ID,
      env.VITE_STRIPE_PRO_PRICE_YEARLY_ID,
    ].includes(priceId)
  ) {
    return "pro"
  }

  return "free"
}
