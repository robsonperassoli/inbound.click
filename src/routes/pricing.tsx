import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { MarketingFooter } from "@/components/marketing-footer"
import { MarketingHeader } from "@/components/marketing-header"
import {
  type PricingPlanView,
  PricingSection,
} from "@/components/pricing/pricing-section"
import type { BillingCycle } from "@/lib/pricing"
import { PRICING_PLANS } from "@/lib/pricing-plans"

export const Route = createFileRoute("/pricing")({
  head: () => {
    const title = "Pricing | Inbound.click"
    const description =
      "Compare Inbound.click Starter, Pro, and Team plans for AI-powered link-in-bio lead capture, qualification, and conversion."

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    }
  },
  component: PricingPage,
  ssr: true,
})

function PricingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-muted/25 text-foreground">
      <MarketingHeader />
      <main className="relative pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_oklch,var(--color-primary)_10%,transparent)_0%,transparent_65%)]" />
        <div className="relative px-4 pt-8 md:px-6 md:pt-10">
          <PricingSectionContent />
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}

function usePricingPlans(billingCycle: BillingCycle) {
  return useMemo(
    (): PricingPlanView[] =>
      PRICING_PLANS.map((plan) => ({
        ...plan,
        pricing: billingCycle === "monthly" ? plan.monthly : plan.yearly,
      })),
    [billingCycle],
  )
}

function PricingSectionContent() {
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly")
  const plans = usePricingPlans(billingCycle)

  return (
    <PricingSection
      billingCycle={billingCycle}
      onBillingCycleChange={setBillingCycle}
      plans={plans}
      getPlanCta={() => ({ label: "Start Free" })}
      onPlanCtaClick={() => {
        void navigate({ to: "/signin" })
      }}
    />
  )
}
