import {
  AiChat02Icon,
  AiMicIcon,
  ArrowRight02Icon,
  ChartLineData02Icon,
  Link01Icon,
  MessageUser01Icon,
  Notification03Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute } from "@tanstack/react-router"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useId, useMemo, useState } from "react"

import logo from "../assets/logo.svg"

export const Route = createFileRoute("/")({
  component: LandingPage,
})

const handles = ["john", "acme-corp", "fitness-coach"]

type DemoPhase = "typing" | "reply" | "preview"

function LandingPage() {
  const topId = useId().replaceAll(":", "")
  const howItWorksId = useId().replaceAll(":", "")
  const useCasesId = useId().replaceAll(":", "")
  const integrationsId = useId().replaceAll(":", "")
  const pricingId = useId().replaceAll(":", "")
  const [handleIndex, setHandleIndex] = useState(0)
  const [count, setCount] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [demoPhase, setDemoPhase] = useState<DemoPhase>("typing")

  const currentHandle = handles[handleIndex]
  const typedHandle = useMemo(
    () => currentHandle.slice(0, count),
    [count, currentHandle],
  )

  useEffect(() => {
    const doneTyping = count === currentHandle.length
    const doneDeleting = count === 0
    const delay = deleting ? 55 : doneTyping ? 1100 : 90

    const id = window.setTimeout(() => {
      if (!deleting && !doneTyping) return setCount((value) => value + 1)
      if (!deleting && doneTyping) return setDeleting(true)
      if (deleting && !doneDeleting) return setCount((value) => value - 1)
      setDeleting(false)
      setHandleIndex((value) => (value + 1) % handles.length)
    }, delay)

    return () => window.clearTimeout(id)
  }, [count, deleting, currentHandle])

  useEffect(() => {
    const timeout =
      demoPhase === "typing"
        ? window.setTimeout(() => setDemoPhase("reply"), 1200)
        : demoPhase === "reply"
          ? window.setTimeout(() => setDemoPhase("preview"), 1400)
          : window.setTimeout(() => setDemoPhase("typing"), 2300)

    return () => window.clearTimeout(timeout)
  }, [demoPhase])

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 [background-image:radial-gradient(circle_at_16%_8%,rgba(79,70,229,0.12),transparent_28%),radial-gradient(circle_at_86%_14%,rgba(16,185,129,0.09),transparent_25%),linear-gradient(to_right,rgba(148,163,184,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.09)_1px,transparent_1px)] [background-size:auto,auto,28px_28px,28px_28px]">
      <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href={`#${topId}`} className="inline-flex items-center gap-2">
            <img src={logo} alt="Inbound.click logo" className="h-8 w-auto" />
            <span className="sr-only">Inbound.click</span>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
            <a
              href={`#${howItWorksId}`}
              className="transition-colors hover:font-semibold hover:text-slate-900"
            >
              How it Works
            </a>
            <a
              href={`#${useCasesId}`}
              className="transition-colors hover:font-semibold hover:text-slate-900"
            >
              Use Cases
            </a>
            <a
              href={`#${integrationsId}`}
              className="transition-colors hover:font-semibold hover:text-slate-900"
            >
              Integrations
            </a>
            <a
              href={`#${pricingId}`}
              className="transition-colors hover:font-semibold hover:text-slate-900"
            >
              Pricing
            </a>
          </nav>

          <button
            type="button"
            className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(79,70,229,0.35)] transition-all hover:scale-[1.02] hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          >
            Claim Your Link
          </button>
        </div>
      </header>

      <section
        id={topId}
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl"
          >
            The link-in-bio that actually generates{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              revenue.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600"
          >
            Stop leaking social media traffic. Inbound.click is an AI-powered
            lead engine that turns followers into clients. Zero drag-and-drop
            form building required, just tell the AI what you need.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="mx-auto mt-10 max-w-2xl rounded-2xl border border-slate-200/70 bg-white p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex h-12 flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800">
                <span className="text-slate-500">s.uper.bio/</span>
                <span className="ml-1 text-indigo-600">{typedHandle}</span>
                <motion.span
                  className="ml-0.5 h-5 w-px bg-indigo-600"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </div>
              <button
                type="button"
                className="h-12 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
              >
                Claim &amp; Build
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Setup takes 60 seconds. Free forever plan available.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-14 w-full max-w-5xl rounded-3xl border border-slate-200/60 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 sm:p-5 lg:min-h-[340px]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Live AI Build Session
              </p>

              <div className="mt-4">
                <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-md bg-indigo-600 px-4 py-3 text-sm text-white shadow-sm">
                  I need a form for my coaching business to collect name, email,
                  and their biggest fitness struggle.
                </div>

                <div className="mt-4 h-[250px]">
                  <AnimatePresence mode="wait">
                    {(demoPhase === "typing" || demoPhase === "reply") && (
                      <motion.div
                        key="chat-state"
                        initial={{ opacity: 0, rotateY: -8, y: 8 }}
                        animate={{ opacity: 1, rotateY: 0, y: 0 }}
                        exit={{ opacity: 0, rotateY: 10, y: -8 }}
                        transition={{ duration: 0.35 }}
                        className="origin-left [transform-style:preserve-3d]"
                      >
                        {demoPhase === "typing" ? (
                          <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                            <TypingDot delay={0} />
                            <TypingDot delay={0.15} />
                            <TypingDot delay={0.3} />
                          </div>
                        ) : (
                          <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                            Got it! Building your capture page...
                          </div>
                        )}
                      </motion.div>
                    )}

                    {demoPhase === "preview" && (
                      <motion.div
                        key="preview-state"
                        initial={{ opacity: 0, rotateY: -75, scale: 0.92 }}
                        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                        exit={{ opacity: 0, rotateY: 75, scale: 0.92 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className="mx-auto mt-2 w-[235px] rounded-[26px] border border-slate-200 bg-white p-3 shadow-[0_14px_36px_rgba(15,23,42,0.16)] [transform-style:preserve-3d]"
                      >
                        <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-200" />
                        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 p-3 text-white">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">
                            Inbound Page
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            @fitness-coach
                          </p>
                        </div>
                        <div className="mt-3 space-y-2 text-xs">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                            Start Chat Intake
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                            Leave Voice Note
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                            Book Discovery Call
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <HeroStat
                icon={SparklesIcon}
                label="Conversion lift"
                value="+43%"
              />
              <HeroStat
                icon={Notification03Icon}
                label="Lead alerts"
                value="Instant"
              />
              <HeroStat
                icon={AiMicIcon}
                label="Voice responses"
                value="Enabled"
              />
              <HeroStat
                icon={ChartLineData02Icon}
                label="Pipeline view"
                value="Realtime"
              />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Linktree leaks traffic. Typeform kills conversions.
          </h2>
          <p className="mt-4 max-w-3xl text-slate-600">
            You&apos;re working too hard on content to send your audience to a
            dead-end list of links, or a 5-page form they&apos;ll abandon. You
            need a frictionless bridge between social discovery and your sales
            pipeline.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6">
              <p className="text-lg font-semibold tracking-tight text-red-900">
                The Old Way
              </p>
              <p className="mt-3 text-sm leading-relaxed text-red-700">
                ❌ Multi-step forms, coding required, high drop-off rates, dead
                leads.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
              <p className="text-lg font-semibold tracking-tight text-emerald-900">
                The Inbound Way
              </p>
              <p className="mt-3 text-sm leading-relaxed text-emerald-700">
                ✅ Conversational forms, voice/audio capture, instant
                notifications, high conversion.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id={howItWorksId}
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          From setup to your first lead in under 2 minutes.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StepCard
            icon={Link01Icon}
            step="01"
            title="Connect Your World"
            body="Plug in your social handles, top links, and even your own custom domain (e.g., links.yourbrand.com). You maintain 100% brand authority."
          />
          <StepCard
            icon={AiChat02Icon}
            step="02"
            title="Just Text Our AI Agent"
            body="Throw away complex form builders. Just type what data you want to collect. Our AI instantly architects an optimized, high-converting capture flow."
          />
          <StepCard
            icon={AiMicIcon}
            step="03"
            title="Capture via Text or Voice"
            body="Paste your link on Instagram, TikTok, or LinkedIn. When leads click, they don't fill out a rigid form, they chat. They can even reply with audio messages."
          />
        </div>
      </section>

      <section
        id={useCasesId}
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Built for the modern internet business.
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <UseCaseCard
            icon={MessageUser01Icon}
            title="Creators & Influencers"
            body="Turn casual viewers into an owned email list or capture inbound brand sponsorship requests instantly."
          />
          <UseCaseCard
            icon={ChartLineData02Icon}
            title="Consultants & Agencies"
            body="Qualify inbound leads by asking about monthly budgets and pain points before you ever get on a discovery call."
          />
          <UseCaseCard
            icon={AiMicIcon}
            title="Real Estate & Local Biz"
            body="Let potential buyers leave voice notes about what kind of property they are looking for directly from your Instagram bio."
          />
        </div>
      </section>

      <section
        id={integrationsId}
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Everything you need to capture, route, and close.
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <FeatureCard
            icon={SparklesIcon}
            title="Speed-to-Lead Alerts"
            body="The moment a lead finishes the flow, your phone buzzes. Get instant pings via WhatsApp, SMS, or Email."
          />
          <FeatureCard
            icon={AiMicIcon}
            title="Audio/Voice Capture"
            body="Forms feel like a conversation. Leads can drop a quick voice note instead of typing paragraphs."
          />
          <FeatureCard
            icon={ChartLineData02Icon}
            title="Built-in Lightweight CRM"
            body="View clicks, conversion rates, and a clean database of all your captured leads in one dashboard."
          />
          <FeatureCard
            icon={Link01Icon}
            title="Universal Webhooks"
            body="Route data instantly to HubSpot, Salesforce, Slack, or Google Sheets."
          />
        </div>
      </section>

      <section
        id={pricingId}
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-10 text-white shadow-[0_24px_64px_rgba(15,23,42,0.4)] sm:p-12">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Stop dropping the ball on social leads.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            Join the smart creators and founders who are automating their
            inbound pipeline.
          </p>
          <button
            type="button"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:scale-[1.02] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            Create Your AI Page Free
            <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
          </button>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Copyright 2026 Inbound.click</p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/privacy"
              className="transition-colors hover:text-slate-900"
            >
              Privacy
            </a>
            <a href="/terms" className="transition-colors hover:text-slate-900">
              Terms
            </a>
            <a
              href="https://twitter.com"
              className="transition-colors hover:text-slate-900"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com"
              className="transition-colors hover:text-slate-900"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}

function TypingDot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="h-1.5 w-1.5 rounded-full bg-slate-400"
      animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay }}
    />
  )
}

function HeroStat({
  icon,
  label,
  value,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
      <div className="inline-flex rounded-lg bg-indigo-50 p-2 text-indigo-600">
        <HugeiconsIcon icon={icon} size={18} />
      </div>
      <p className="mt-3 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  )
}

function StepCard({
  icon,
  step,
  title,
  body,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  step: string
  title: string
  body: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="inline-flex rounded-full bg-indigo-50 p-2 text-indigo-600">
          <HugeiconsIcon icon={icon} size={18} />
        </span>
        <span className="text-xs font-semibold tracking-[0.12em] text-slate-400">
          {step}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  )
}

function UseCaseCard({
  icon,
  title,
  body,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  title: string
  body: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="inline-flex rounded-xl bg-violet-50 p-2 text-violet-600">
        <HugeiconsIcon icon={icon} size={18} />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  title: string
  body: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
      <div className="inline-flex rounded-xl bg-emerald-50 p-2 text-emerald-600">
        <HugeiconsIcon icon={icon} size={19} />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  )
}
