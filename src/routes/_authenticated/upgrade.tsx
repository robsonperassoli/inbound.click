import { api } from "@convex/_generated/api"
import { createFileRoute } from "@tanstack/react-router"
import { useAction } from "convex/react"
import { useEffect, useMemo, useState } from "react"
import { ScrollableContainer } from "@/components/app-layout/scrollable-container"
import {
  PricingContactDialog,
  type PricingContactFormValues,
} from "@/components/pricing/pricing-contact-dialog"
import {
  PricingSection,
  type PricingPlanView,
} from "@/components/pricing/pricing-section"
import { useSelectedProfile } from "@/hooks/use-selected-profile"
import { useSession } from "@/hooks/use-session"
import {
  type BillingCycle,
  getPlanIdForPriceId,
  type PricingPlanId,
} from "@/lib/pricing"
import { PRICING_PLANS } from "@/lib/pricing-plans"

export const Route = createFileRoute("/_authenticated/upgrade")({
  component: RouteComponent,
})

function RouteComponent() {
  const createSubscriptionCheckout = useAction(
    api.stripe.createSubscriptionCheckout,
  )
  const submitSalesLead = useAction(api.emails.submitSalesLead)
  const session = useSession()
  const profileData = useSelectedProfile()

  const activePlan =
    session?.subscriptionPriceId === undefined
      ? "free"
      : getPlanIdForPriceId(session.subscriptionPriceId)

  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly")
  const [checkoutPlan, setCheckoutPlan] = useState<PricingPlanId | null>(null)
  const [contactPlan, setContactPlan] = useState<PricingPlanId | null>(null)
  const [contactInitialValues, setContactInitialValues] = useState<
    Partial<PricingContactFormValues>
  >({})

  useEffect(() => {
    setContactInitialValues({
      email: session?.email ?? "",
      phone: session?.phoneNumber ?? "",
      companyName: "",
    })
  }, [session])

  const plans = useMemo(
    (): PricingPlanView[] =>
      PRICING_PLANS.map((plan) => ({
        ...plan,
        pricing: billingCycle === "monthly" ? plan.monthly : plan.yearly,
        isActive: plan.id === activePlan,
      })),
    [activePlan, billingCycle],
  )

  const openContactModal = (planId: PricingPlanId) => {
    setContactPlan(planId)
  }

  const handleSubmitContact = async (values: PricingContactFormValues) => {
    if (!profileData?.profile._id) {
      throw new Error("Profile not selected")
    }

    await submitSalesLead({
      ...values,
      userAgent: window.navigator.userAgent,
      profileId: profileData.profile._id,
    })
  }

  return (
    <>
      <ScrollableContainer className="relative min-h-[calc(100vh-4rem)] bg-muted/25">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_oklch,var(--color-primary)_10%,transparent)_0%,transparent_65%)]" />
        <PricingSection
          billingCycle={billingCycle}
          onBillingCycleChange={setBillingCycle}
          plans={plans}
          getPlanCta={(plan) => ({
            label: plan.isActive ? "Current Plan" : plan.cta,
            disabled: plan.isActive,
            loading: checkoutPlan === plan.id,
          })}
          onPlanCtaClick={async (plan) => {
            if (plan.isActive) {
              return
            }

            const usesContactModal =
              plan.id === "team" || !plan.pricing.stripePriceId

            if (usesContactModal) {
              openContactModal(plan.id)
              return
            }

            const priceId = plan.pricing.stripePriceId
            if (!priceId) {
              openContactModal(plan.id)
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
              console.error("Failed to create checkout session", error)
              openContactModal(plan.id)
            } finally {
              setCheckoutPlan(null)
            }
          }}
        />
      </ScrollableContainer>

      <PricingContactDialog
        open={contactPlan !== null}
        onOpenChange={(open) => {
          if (!open) {
            setContactPlan(null)
          }
        }}
        onSubmit={handleSubmitContact}
        initialValues={contactInitialValues}
      />
    </>
  )
}
