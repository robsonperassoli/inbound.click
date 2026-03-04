import { api } from "@convex/_generated/api"
import { createFileRoute } from "@tanstack/react-router"
import { useAction } from "convex/react"
import { useMemo, useState } from "react"
import { ScrollableContainer } from "@/components/app-layout/scrollable-container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type BillingCycle, PRICING } from "@/lib/pricing"
import { cn } from "@/lib/utils"

type PlanId = "free" | "pro" | "business"

type PlanConfig = {
  id: PlanId
  title: string
  cta: string
  popular?: boolean
  features: string[]
  monthly: (typeof PRICING)[PlanId]["monthly"]
  yearly: (typeof PRICING)[PlanId]["yearly"]
}

const PLANS: PlanConfig[] = [
  {
    id: "free",
    title: "Free",
    cta: "Current Plan",
    features: [
      "Basic lead capture",
      "1 active lead magnet",
      "Standard analytics",
      "Inbound branding",
    ],
    monthly: PRICING.free.monthly,
    yearly: PRICING.free.yearly,
  },
  {
    id: "pro",
    title: "Pro",
    cta: "Upgrade to Pro",
    popular: true,
    features: [
      "Remove branding",
      "Advanced analytics",
      "500 leads/mo",
      "Email marketing integrations",
    ],
    monthly: PRICING.pro.monthly,
    yearly: PRICING.pro.yearly,
  },
  {
    id: "business",
    title: "Business",
    cta: "Upgrade to Business",
    features: [
      "0% Platform Fees",
      "Unlimited leads",
      "Custom domains",
      "CRM Sync (HubSpot/Salesforce)",
      "Full Tracking Pixels",
      "API Access",
    ],
    monthly: PRICING.business.monthly,
    yearly: PRICING.business.yearly,
  },
]

export const Route = createFileRoute("/_authenticated/upgrade")({
  component: RouteComponent,
})

function RouteComponent() {
  const createSubscriptionCheckout = useAction(
    api.stripe.createSubscriptionCheckout,
  )
  const activePlan: PlanId = "free"
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [checkoutPlan, setCheckoutPlan] = useState<PlanId | null>(null)

  const plans = useMemo(
    () =>
      PLANS.map((plan) => {
        const pricing = billingCycle === "monthly" ? plan.monthly : plan.yearly
        const isActive = plan.id === activePlan

        return {
          ...plan,
          pricing,
          isActive,
        }
      }),
    [billingCycle],
  )

  return (
    <ScrollableContainer className="min-h-[calc(100vh-4rem)] bg-muted/25 relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_oklch,var(--color-primary)_10%,transparent)_0%,transparent_65%)]" />
      <section className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl p-4 sm:p-6">
        <div className="relative space-y-8">
          <header className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.12em] text-primary/80 uppercase">
              Inbound Pricing
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Upgrade Inbound
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Scale lead generation with richer analytics, higher limits, and
              advanced integrations.
            </p>
            <div className="inline-flex rounded-full border border-border/70 bg-background/80 p-1 shadow-sm">
              <button
                type="button"
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  billingCycle === "monthly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground",
                )}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <button
                type="button"
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  billingCycle === "yearly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground",
                )}
                onClick={() => setBillingCycle("yearly")}
              >
                Yearly
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {plans.map((plan) => {
              const ctaLabel = plan.isActive ? "Current Plan" : plan.cta
              const ctaDisabled = plan.isActive
              const isPro = plan.id === "pro"

              return (
                <article
                  key={plan.id}
                  className={cn(
                    "flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300",
                    "hover:-translate-y-1 hover:shadow-lg",
                    isPro
                      ? "border-primary/60 ring-1 ring-primary/20"
                      : "border-border/65",
                    plan.isActive && "border-muted-foreground/25",
                  )}
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">{plan.title}</h2>
                      {plan.popular ? (
                        <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/10">
                          Most Popular
                        </Badge>
                      ) : null}
                    </div>
                    {billingCycle === "yearly" && plan.pricing.badge ? (
                      <Badge variant="secondary" className="text-xs">
                        {plan.pricing.badge}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mb-5 border-b border-border/70 pb-5">
                    <p className="text-4xl font-semibold tracking-tight">
                      {plan.pricing.priceLabel}
                      <span className="ml-1 text-base font-medium text-muted-foreground">
                        {plan.pricing.period}
                      </span>
                    </p>
                    <p className="mt-2 min-h-5 text-sm text-muted-foreground transition-opacity duration-300">
                      {billingCycle === "yearly" && plan.pricing.equivalent
                        ? plan.pricing.equivalent
                        : " "}
                    </p>
                  </div>

                  <ul className="mb-6 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-foreground/90"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={cn(
                      "mt-auto w-full",
                      ctaDisabled &&
                        "bg-muted text-muted-foreground hover:bg-muted",
                    )}
                    disabled={ctaDisabled || checkoutPlan === plan.id}
                    onClick={async () => {
                      if (plan.id === "free" || ctaDisabled) {
                        return
                      }
                      const priceId = plan.pricing.stripePriceId
                      if (!priceId) {
                        return
                      }

                      try {
                        setCheckoutPlan(plan.id)
                        const result = await createSubscriptionCheckout({
                          priceId,
                        })
                        if (!result.url) {
                          throw new Error("Missing checkout URL")
                        }
                        window.location.href = result.url
                      } catch (error) {
                        console.error(
                          "Failed to create checkout session",
                          error,
                        )
                      } finally {
                        setCheckoutPlan(null)
                      }
                    }}
                  >
                    {checkoutPlan === plan.id ? "Redirecting..." : ctaLabel}
                  </Button>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </ScrollableContainer>
  )
}
