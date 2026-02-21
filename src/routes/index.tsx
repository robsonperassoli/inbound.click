import {
  AiChat01Icon,
  ArrowRight02Icon,
  Chart01Icon,
  Link01Icon,
  Message01Icon,
  Mic01Icon,
  Notification01Icon,
  SmartPhone01Icon,
  WebhookIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute } from "@tanstack/react-router"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useId, useMemo, useState } from "react"
import logo from "../assets/logo.svg"

export const Route = createFileRoute("/")({
  component: IndexPage,
})

const handles = ["john", "acme-corp", "fitness-coach"]

function IndexPage() {
  const baseId = useId().replaceAll(":", "")
  const sectionIds = useMemo(
    () => ({
      top: `${baseId}-top`,
      howItWorks: `${baseId}-how-it-works`,
      useCases: `${baseId}-use-cases`,
      integrations: `${baseId}-integrations`,
      pricing: `${baseId}-pricing`,
    }),
    [baseId],
  )

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Nav sectionIds={sectionIds} />
      <Hero topId={sectionIds.top} />
      <ProblemSolution pricingId={sectionIds.pricing} />
      <HowItWorks howItWorksId={sectionIds.howItWorks} />
      <UseCases useCasesId={sectionIds.useCases} />
      <Features integrationsId={sectionIds.integrations} />
      <FinalCta />
    </div>
  )
}

function Nav({ sectionIds }: { sectionIds: Record<string, string> }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href={`#${sectionIds.top}`} className="flex items-center gap-3">
          <img src={logo} alt="Inbound.click logo" className="h-7 w-auto" />
          <span className="sr-only text-lg font-semibold tracking-tight text-slate-900">
            Inbound.click
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            { href: `#${sectionIds.howItWorks}`, label: "How it Works" },
            { href: `#${sectionIds.useCases}`, label: "Use Cases" },
            { href: `#${sectionIds.integrations}`, label: "Integrations" },
            { href: `#${sectionIds.pricing}`, label: "Pricing" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-full bg-[#EE775F] px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(238,119,95,0.35)] transition-all hover:scale-[1.02] hover:bg-[#e5664d]"
        >
          Claim Your Link
        </button>
      </div>
    </header>
  )
}

function Hero({ topId }: { topId: string }) {
  const handle = useTypingHandle()

  return (
    <section
      id={topId}
      className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(238,119,95,.18), transparent 35%), radial-gradient(circle at 80% 15%, rgba(105,208,178,.18), transparent 35%), linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 32px 32px, 32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f7c7be] bg-[#fff6f4] px-4 py-1.5 text-sm font-medium text-[#b14f3d]">
            <HugeiconsIcon icon={AiChat01Icon} size={16} />
            AI-powered social lead engine
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            The link-in-bio that actually generates{" "}
            <span className="bg-gradient-to-r from-[#EE775F] via-[#f2a33c] to-[#69D0B2] bg-clip-text text-transparent">
              revenue
            </span>
            .
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Stop leaking social media traffic. Inbound.click is an AI-powered
            lead engine that turns followers into clients. Zero drag-and-drop
            form building required, just tell the AI what you need.
          </p>

          <div className="mx-auto mt-10 w-full max-w-2xl rounded-2xl border border-slate-200/70 bg-white p-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex h-14 flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500">
                <span className="font-medium text-slate-500">s.uper.bio/</span>
                <span className="ml-1 font-semibold text-slate-900">
                  {handle}
                </span>
                <motion.span
                  aria-hidden
                  className="ml-0.5 inline-block h-5 w-px bg-slate-700"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{
                    duration: 0.9,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </div>
              <button
                type="button"
                className="h-14 rounded-xl bg-[#EE775F] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(238,119,95,0.35)] transition-all hover:scale-[1.02] hover:bg-[#e5664d]"
              >
                Claim &amp; Build
              </button>
            </div>
            <p className="mt-2 text-left text-sm text-slate-500 sm:px-1">
              Setup takes 60 seconds. Free forever plan available.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-5xl">
          <ChatToBioDemo />
        </div>
      </div>
    </section>
  )
}

function ChatToBioDemo() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhase((current) => (current + 1) % 3)
    }, 2600)

    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[980px] rounded-[32px] border border-slate-200/70 bg-gradient-to-b from-white to-slate-50 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:h-[520px] sm:p-8">
      <div className="absolute left-10 top-10 h-52 w-52 rounded-full bg-[#EE775F]/20 blur-3xl" />
      <div className="absolute bottom-8 right-10 h-56 w-56 rounded-full bg-[#69D0B2]/20 blur-3xl" />

      <div className="relative mx-auto h-full w-full max-w-[360px] [perspective:1200px]">
        <AnimatePresence mode="wait">
          {phase < 2 ? (
            <motion.div
              key={`chat-${phase}`}
              initial={{ opacity: 0, rotateY: -14, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, rotateY: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 18, y: -12, scale: 0.96 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-[30px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_48px_rgba(15,23,42,0.12)]"
            >
              <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-slate-200" />
              <div className="mb-4 flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-full bg-[#fff2ef] text-[#d55d46]">
                  <HugeiconsIcon icon={AiChat01Icon} size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Inbound AI
                  </p>
                  <p className="text-xs text-slate-500">Online now</p>
                </div>
              </div>

              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-[#EE775F] px-4 py-3 text-sm text-white"
                >
                  I need a form for my coaching business to collect name, email,
                  and their biggest fitness struggle.
                </motion.div>

                {phase === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-[72%] rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <TypingDots />
                  </motion.div>
                ) : null}

                {phase === 1 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-[80%] rounded-2xl rounded-bl-md border border-[#d9f3eb] bg-[#effbf7] px-4 py-3 text-sm text-slate-700"
                  >
                    Got it! Building your capture page...
                  </motion.div>
                ) : null}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="bio"
              initial={{ opacity: 0, rotateY: -24, scale: 0.92, y: 18 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="h-full rounded-[30px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_48px_rgba(15,23,42,0.12)]"
            >
              <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-slate-200" />
              <div className="rounded-2xl border border-[#f3d7cf] bg-gradient-to-b from-[#fff7f5] to-white p-4">
                <div className="mx-auto mb-3 grid size-14 place-items-center rounded-full bg-white shadow-sm">
                  <HugeiconsIcon
                    icon={SmartPhone01Icon}
                    size={24}
                    className="text-[#EE775F]"
                  />
                </div>
                <p className="text-center text-sm font-semibold text-slate-900">
                  @fitness-coach
                </p>
                <p className="mt-1 text-center text-xs text-slate-500">
                  DM-grade capture page
                </p>

                <div className="mt-4 space-y-2">
                  {[
                    "Start your coaching intake",
                    "Tell me your biggest fitness struggle",
                    "Drop your email to get your plan",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#69D0B2] py-2.5 text-sm font-semibold text-slate-900"
                >
                  Open AI Capture Flow
                  <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-[#d9f3eb] bg-[#effbf7] px-3 py-2 text-slate-700">
                  87% completion
                </div>
                <div className="rounded-xl border border-[#fde7bd] bg-[#fff9eb] px-3 py-2 text-slate-700">
                  +3 new leads
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="size-2 rounded-full bg-slate-400"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            delay: dot * 0.15,
          }}
        />
      ))}
    </div>
  )
}

function ProblemSolution({ pricingId }: { pricingId: string }) {
  return (
    <section id={pricingId} className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Linktree leaks traffic. Typeform kills conversions.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            You&apos;re working too hard on content to send your audience to a
            dead-end list of links, or a 5-page form they&apos;ll abandon. You
            need a frictionless bridge between social discovery and your sales
            pipeline.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-red-100 bg-red-50/50 p-7 shadow-sm">
            <h3 className="text-lg font-semibold tracking-tight text-red-700">
              The Old Way
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-red-800/85">
              {[
                "❌ Multi-step forms",
                "❌ Coding required",
                "❌ High drop-off rates",
                "❌ Dead leads",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-7 shadow-sm">
            <h3 className="text-lg font-semibold tracking-tight text-emerald-700">
              The Inbound Way
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-emerald-800/90">
              {[
                "✅ Conversational forms",
                "✅ Voice/audio capture",
                "✅ Instant notifications",
                "✅ High conversion",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks({ howItWorksId }: { howItWorksId: string }) {
  const steps = useMemo(
    () => [
      {
        icon: Link01Icon,
        title: "Connect Your World",
        body: "Plug in your social handles, top links, and even your own custom domain (e.g., links.yourbrand.com). You maintain 100% brand authority.",
        tone: "bg-[#fff6f4] text-[#d55d46]",
      },
      {
        icon: Message01Icon,
        title: "Just Text Our AI Agent",
        body: "Throw away complex form builders. Just type what data you want to collect. Our AI instantly architects an optimized, high-converting capture flow.",
        tone: "bg-[#fff9eb] text-[#c58d1b]",
      },
      {
        icon: Mic01Icon,
        title: "Capture via Text or Voice",
        body: "Paste your link on Instagram, TikTok, or LinkedIn. When leads click, they don't fill out a rigid form, they chat. They can even reply with audio messages.",
        tone: "bg-[#effbf7] text-[#178467]",
      },
    ],
    [],
  )

  return (
    <section
      id={howItWorksId}
      className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            From setup to your first lead in under 2 minutes.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm"
            >
              <div className={`mb-5 inline-flex rounded-xl p-3 ${step.tone}`}>
                <HugeiconsIcon icon={step.icon} size={20} />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {step.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function UseCases({ useCasesId }: { useCasesId: string }) {
  const cards = [
    {
      title: "Creators & Influencers",
      body: "Turn casual viewers into an owned email list or capture inbound brand sponsorship requests instantly.",
      icon: Notification01Icon,
    },
    {
      title: "Consultants & Agencies",
      body: "Qualify inbound leads by asking about monthly budgets and pain points before you ever get on a discovery call.",
      icon: Message01Icon,
    },
    {
      title: "Real Estate & Local Biz",
      body: "Let potential buyers leave voice notes about what kind of property they are looking for directly from your Instagram bio.",
      icon: SmartPhone01Icon,
    },
  ]

  return (
    <section id={useCasesId} className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Built for the modern internet business.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-5 inline-flex rounded-xl bg-slate-100 p-3 text-slate-700">
                <HugeiconsIcon icon={card.icon} size={20} />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features({ integrationsId }: { integrationsId: string }) {
  const items = [
    {
      title: "Speed-to-Lead Alerts",
      body: "The moment a lead finishes the flow, your phone buzzes. Get instant pings via WhatsApp, SMS, or Email.",
      icon: ZapIcon,
      tone: "bg-[#fff6f4] text-[#d55d46]",
    },
    {
      title: "Audio/Voice Capture",
      body: "Forms feel like a conversation. Leads can drop a quick voice note instead of typing paragraphs.",
      icon: Mic01Icon,
      tone: "bg-[#effbf7] text-[#178467]",
    },
    {
      title: "Built-in Lightweight CRM",
      body: "View clicks, conversion rates, and a clean database of all your captured leads in one dashboard.",
      icon: Chart01Icon,
      tone: "bg-[#fff9eb] text-[#c58d1b]",
    },
    {
      title: "Universal Webhooks",
      body: "Route data instantly to HubSpot, Salesforce, Slack, or Google Sheets.",
      icon: WebhookIcon,
      tone: "bg-slate-100 text-slate-700",
    },
  ]

  return (
    <section
      id={integrationsId}
      className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to capture, route, and close.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className={`mb-4 inline-flex rounded-xl p-3 ${item.tone}`}>
                <HugeiconsIcon icon={item.icon} size={20} />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <footer className="px-4 pb-10 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-800 bg-slate-900 p-8 text-white shadow-[0_25px_70px_rgba(15,23,42,0.35)] sm:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Stop dropping the ball on social leads.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Join the smart creators and founders who are automating their
            inbound pipeline.
          </p>
          <button
            type="button"
            className="mt-8 rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition-all hover:scale-[1.02] hover:bg-slate-100"
          >
            Create Your AI Page Free
          </button>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-400 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a href="/privacy" className="transition-colors hover:text-white">
              Privacy
            </a>
            <a href="/terms" className="transition-colors hover:text-white">
              Terms
            </a>
            <a
              href="https://twitter.com"
              className="transition-colors hover:text-white"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com"
              className="transition-colors hover:text-white"
            >
              LinkedIn
            </a>
          </div>
          <p>Copyright 2026 Inbound.click</p>
        </div>
      </div>
    </footer>
  )
}

function useTypingHandle() {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = handles[wordIndex]
    const speed = isDeleting ? 45 : 95

    const timeout = window.setTimeout(() => {
      if (!isDeleting) {
        const next = currentWord.slice(0, text.length + 1)
        setText(next)
        if (next === currentWord) {
          window.setTimeout(() => setIsDeleting(true), 900)
        }
      } else {
        const next = currentWord.slice(0, text.length - 1)
        setText(next)
        if (next.length === 0) {
          setIsDeleting(false)
          setWordIndex((index) => (index + 1) % handles.length)
        }
      }
    }, speed)

    return () => window.clearTimeout(timeout)
  }, [isDeleting, text, wordIndex])

  return text
}
