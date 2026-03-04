export type PricingPlanId = "free" | "pro" | "business"
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
  free: {
    monthly: {
      priceLabel: "$0",
      period: "/mo",
    },
    yearly: {
      priceLabel: "$0",
      period: "/mo",
    },
  },
  pro: {
    monthly: {
      priceLabel: "$14.99",
      period: "/mo",
      stripePriceId: env.VITE_STRIPE_PRO_PRICE_ID,
    },
    yearly: {
      priceLabel: "$140",
      period: "/yr",
      equivalent: "equiv. $11.67/mo",
      badge: "Save $40/year",
      stripePriceId: env.VITE_STRIPE_PRO_PRICE_YEARLY_ID,
    },
  },
  business: {
    monthly: {
      priceLabel: "$49",
      period: "/mo",
      stripePriceId: env.VITE_STRIPE_BUSINESS_PRICE_ID,
    },
    yearly: {
      priceLabel: "$480",
      period: "/yr",
      equivalent: "equiv. $40/mo",
      badge: "Best Value - 2 Months Free",
      stripePriceId: env.VITE_STRIPE_BUSINESS_PRICE_YEARLY_ID,
    },
  },
}
