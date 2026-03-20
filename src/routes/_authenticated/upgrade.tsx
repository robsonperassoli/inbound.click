import { api } from "@convex/_generated/api"
import {
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute } from "@tanstack/react-router"
import { useAction, useQuery } from "convex/react"
import { useEffect, useMemo, useState } from "react"
import { ScrollableContainer } from "@/components/app-layout/scrollable-container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  type BillingCycle,
  getPlanIdForPriceId,
  PRICING,
  type PricingPlanId,
} from "@/lib/pricing"
import { cn } from "@/lib/utils"

type PlanId = PricingPlanId
type PlanFeature =
  | string
  | {
      label: string
      tooltip: string
    }

type PlanConfig = {
  id: PlanId
  title: string
  description: string
  cta: string
  popular?: boolean
  features: PlanFeature[]
  monthly: (typeof PRICING)[PlanId]["monthly"]
  yearly: (typeof PRICING)[PlanId]["yearly"]
}

type ContactFormValues = {
  email: string
  phone: string
  companyName: string
}

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>

const PLANS: PlanConfig[] = [
  {
    id: "starter",
    title: "Starter",
    description: "For solo creators getting their first qualified leads.",
    cta: "Choose Starter",
    features: [
      "Collect leads",
      "Inbound.click branding",
      "Basic lead capture (name, email, phone)",
      "4 themes",
      "Auto-generated link",
    ],
    monthly: PRICING.starter.monthly,
    yearly: PRICING.starter.yearly,
  },
  {
    id: "pro",
    title: "Pro",
    description:
      "For operators who need better conversion workflows and control.",
    cta: "Choose Pro",
    popular: true,
    features: [
      {
        label: "Instant notifications",
        tooltip:
          "Get notified as soon as someone starts or finishes a chat, and review the full conversation transcript anytime.",
      },
      "Analytics",
      "Export leads",
      "Premium themes",
      "Advanced lead capture flows",
      "Full color customization",
      "No Inbound branding",
      "Integrations",
      {
        label: "Custom link",
        tooltip:
          "Choose your own page username, like s.uper.bio/yourname, as long as it is available.",
      },
    ],
    monthly: PRICING.pro.monthly,
    yearly: PRICING.pro.yearly,
  },
  {
    id: "team",
    title: "Team",
    description:
      "Custom pricing for teams and agencies that need a shared setup.",
    cta: "Connect with us",
    features: [
      "Everything in Pro plan",
      "Priority support",
      "Better AI models",
      "Multiple profiles",
    ],
    monthly: PRICING.team.monthly,
    yearly: PRICING.team.yearly,
  },
]

const emptyContactValues: ContactFormValues = {
  email: "",
  phone: "",
  companyName: "",
}

export const Route = createFileRoute("/_authenticated/upgrade")({
  component: RouteComponent,
})

function RouteComponent() {
  const createSubscriptionCheckout = useAction(
    api.stripe.createSubscriptionCheckout,
  )
  const submitSalesLead = useAction(api.emails.submitSalesLead)
  const user = useQuery(api.auth.getCurrentUser, {})
  const subscription = useQuery(api.stripe.getUserSubscription, {})

  const activePlan =
    subscription === undefined
      ? "free"
      : getPlanIdForPriceId(subscription === "free" ? null : subscription)

  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly")
  const [checkoutPlan, setCheckoutPlan] = useState<PlanId | null>(null)
  const [contactPlan, setContactPlan] = useState<PlanId | null>(null)
  const [contactValues, setContactValues] =
    useState<ContactFormValues>(emptyContactValues)
  const [contactErrors, setContactErrors] = useState<ContactFormErrors>({})
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [contactFormError, setContactFormError] = useState("")

  useEffect(() => {
    setContactValues((current) => ({
      email: current.email || user?.email || "",
      phone: current.phone || user?.phoneNumber || "",
      companyName: current.companyName,
    }))
  }, [user?.email, user?.phoneNumber])

  const plans = useMemo(
    () =>
      PLANS.map((plan) => {
        const pricing = billingCycle === "monthly" ? plan.monthly : plan.yearly

        return {
          ...plan,
          pricing,
          isActive: plan.id === activePlan,
        }
      }),
    [activePlan, billingCycle],
  )

  const selectedContactPlan = PLANS.find((plan) => plan.id === contactPlan)

  const openContactModal = (planId: PlanId) => {
    setContactPlan(planId)
    setContactErrors({})
    setContactFormError("")
    setContactSubmitted(false)
  }

  const closeContactModal = (open: boolean) => {
    if (open) {
      return
    }

    setContactPlan(null)
    setContactErrors({})
    setContactFormError("")
    setContactSubmitted(false)
  }

  const validateContactForm = () => {
    const errors: ContactFormErrors = {}

    if (!contactValues.email.trim()) {
      errors.email = "Email is required"
    }

    if (!contactValues.phone.trim()) {
      errors.phone = "Phone is required"
    }

    if (!contactValues.companyName.trim()) {
      errors.companyName = "Company name is required"
    }

    setContactErrors(errors)
    return Object.keys(errors).length === 0
  }

  const renderFeature = (feature: PlanFeature) => {
    if (typeof feature === "string") {
      return feature
    }

    return (
      <span className="inline-flex items-center gap-1.5">
        <span>{feature.label}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`More info about ${feature.label.toLowerCase()}`}
            >
              <HugeiconsIcon icon={InformationCircleIcon} size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6}>
            {feature.tooltip}
          </TooltipContent>
        </Tooltip>
      </span>
    )
  }

  return (
    <>
      <ScrollableContainer className="relative min-h-[calc(100vh-4rem)] bg-muted/25">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_oklch,var(--color-primary)_10%,transparent)_0%,transparent_65%)]" />
        <section className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl p-4 sm:p-6">
          <div className="relative space-y-8">
            <header className="space-y-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-primary/80 uppercase">
                Inbound Pricing
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Choose the plan that matches how you capture leads
              </h1>
              <p className="max-w-3xl text-sm text-muted-foreground">
                Start with Starter or Pro, then move to Team or Agency pricing
                when you need multiple profiles, premium support, and a more
                custom setup.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex rounded-full border border-border/70 bg-background/80 p-1 shadow-sm">
                  <button
                    type="button"
                    className={cn(
                      "w-30 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                      billingCycle === "yearly"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground",
                    )}
                    onClick={() => setBillingCycle("yearly")}
                  >
                    Yearly
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "w-30 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                      billingCycle === "monthly"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground",
                    )}
                    onClick={() => setBillingCycle("monthly")}
                  >
                    Monthly
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Save up to 22% with annual billing.
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {plans.map((plan) => {
                const ctaLabel = plan.isActive ? "Current Plan" : plan.cta
                const ctaDisabled = plan.isActive
                const isPro = plan.id === "pro"
                const usesContactModal =
                  plan.id === "team" || !plan.pricing.stripePriceId

                return (
                  <article
                    key={plan.id}
                    className={cn(
                      "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300",
                      "hover:-translate-y-1 hover:shadow-lg",
                      isPro
                        ? "border-primary/70 bg-card shadow-xl ring-2 ring-primary/25 lg:-translate-y-2 lg:scale-[1.02]"
                        : "border-border/65",
                      plan.isActive && "border-muted-foreground/25",
                    )}
                  >
                    {isPro ? (
                      <>
                        <div className="pointer-events-none absolute inset-x-10 top-0 h-24 rounded-b-full bg-[radial-gradient(circle_at_top,color-mix(in_oklch,var(--color-primary)_20%,transparent)_0%,transparent_70%)] opacity-90" />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--color-primary)_5%,transparent)_0%,transparent_28%)]" />
                      </>
                    ) : null}
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold">{plan.title}</h2>
                        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                          {plan.description}
                        </p>
                        {plan.popular ? (
                          <Badge className="mt-3 border border-primary/20 bg-primary text-primary-foreground shadow-sm hover:bg-primary">
                            Most Popular
                          </Badge>
                        ) : null}
                      </div>
                      {plan.pricing.badge ? (
                        <Badge variant="secondary" className="text-xs">
                          {plan.pricing.badge}
                        </Badge>
                      ) : null}
                    </div>

                    <div className="mb-5 border-b border-border/70 pb-5">
                      {billingCycle === "yearly" &&
                      plan.pricing.originalPriceLabel ? (
                        <p className="text-sm font-medium text-muted-foreground line-through">
                          {plan.pricing.originalPriceLabel}
                        </p>
                      ) : null}
                      <p className="text-4xl font-semibold tracking-tight">
                        {plan.pricing.priceLabel}
                        {plan.pricing.period ? (
                          <span className="ml-1 text-base font-medium text-muted-foreground">
                            {plan.pricing.period}
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-2 min-h-5 text-sm text-muted-foreground transition-opacity duration-300">
                        {billingCycle === "yearly" &&
                        plan.pricing.originalPriceLabel
                          ? " "
                          : plan.pricing.equivalent || " "}
                      </p>
                    </div>

                    <ul className="mb-6 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={
                            typeof feature === "string"
                              ? feature
                              : feature.label
                          }
                          className="flex items-start gap-2 text-sm text-foreground/90"
                        >
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" />
                          <span>{renderFeature(feature)}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={cn(
                        "mt-auto w-full",
                        isPro &&
                          !ctaDisabled &&
                          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90",
                        !isPro &&
                          !ctaDisabled &&
                          "bg-background text-foreground ring-1 ring-border hover:bg-muted/60",
                        ctaDisabled &&
                          "bg-muted text-muted-foreground hover:bg-muted",
                      )}
                      disabled={ctaDisabled || checkoutPlan === plan.id}
                      onClick={async () => {
                        if (ctaDisabled) {
                          return
                        }

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
                          console.error(
                            "Failed to create checkout session",
                            error,
                          )
                          openContactModal(plan.id)
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

      <Dialog open={contactPlan !== null} onOpenChange={closeContactModal}>
        <DialogContent>
          {contactSubmitted ? (
            <>
              <DialogHeader className="items-center text-center">
                <div className="relative mx-auto flex size-16 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary/12 blur-md" />
                  <div className="relative flex size-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-sm">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      strokeWidth={2}
                      className="size-7"
                    />
                  </div>
                </div>
                <DialogTitle className="text-xl font-semibold tracking-tight">
                  You&apos;re all set, we&apos;ll be in touch soon
                </DialogTitle>
                <DialogDescription>
                  Our team will review your details and reach out personally to
                  talk through your needs and recommend the best setup.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center" showCloseButton />
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Connect with us</DialogTitle>
                <DialogDescription>
                  Please fill in your contact information and we&apos;ll reach
                  out personally to understand your needs and recommend the best
                  setup for your team.
                </DialogDescription>
              </DialogHeader>

              <form
                className="space-y-6"
                onSubmit={async (event) => {
                  event.preventDefault()

                  if (!selectedContactPlan || !validateContactForm()) {
                    return
                  }

                  try {
                    setContactSubmitting(true)
                    setContactFormError("")

                    await submitSalesLead({
                      email: contactValues.email.trim(),
                      phone: contactValues.phone.trim(),
                      companyName: contactValues.companyName.trim(),
                      userAgent: window.navigator.userAgent,
                    })

                    setContactSubmitted(true)
                  } catch (error) {
                    console.error("Failed to submit pricing inquiry", error)
                    setContactFormError(
                      "We couldn't send your request right now. Please try again.",
                    )
                  } finally {
                    setContactSubmitting(false)
                  }
                }}
              >
                <FieldGroup>
                  <Field data-invalid={Boolean(contactErrors.email)}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      autoComplete="email"
                      value={contactValues.email}
                      onChange={(event) => {
                        setContactValues((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                        setContactErrors((current) => ({
                          ...current,
                          email: undefined,
                        }))
                      }}
                    />
                    {contactErrors.email ? (
                      <FieldError>{contactErrors.email}</FieldError>
                    ) : null}
                  </Field>

                  <Field data-invalid={Boolean(contactErrors.phone)}>
                    <FieldLabel>Phone</FieldLabel>
                    <Input
                      autoComplete="tel"
                      value={contactValues.phone}
                      onChange={(event) => {
                        setContactValues((current) => ({
                          ...current,
                          phone: event.target.value,
                        }))
                        setContactErrors((current) => ({
                          ...current,
                          phone: undefined,
                        }))
                      }}
                    />
                    {contactErrors.phone ? (
                      <FieldError>{contactErrors.phone}</FieldError>
                    ) : null}
                  </Field>

                  <Field data-invalid={Boolean(contactErrors.companyName)}>
                    <FieldLabel>Company name</FieldLabel>
                    <Input
                      autoComplete="organization"
                      value={contactValues.companyName}
                      onChange={(event) => {
                        setContactValues((current) => ({
                          ...current,
                          companyName: event.target.value,
                        }))
                        setContactErrors((current) => ({
                          ...current,
                          companyName: undefined,
                        }))
                      }}
                    />
                    {contactErrors.companyName ? (
                      <FieldError>{contactErrors.companyName}</FieldError>
                    ) : null}
                  </Field>
                </FieldGroup>

                {contactFormError ? (
                  <FieldError>{contactFormError}</FieldError>
                ) : null}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => closeContactModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={contactSubmitting}>
                    {contactSubmitting ? "Sending..." : "Send request"}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
