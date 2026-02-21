import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useMemo, useState } from "react"
import logo from "../assets/logo.svg"

export const Route = createFileRoute("/")({
  component: LandingPage,
})

const DYNAMIC_NAMES = [
  "fitness-coach",
  "startup-founder",
  "creator",
  "agency-owner",
]

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#2D2E2C]">
      <SpeedLinesBackground />

      <header className="sticky top-0 z-50 border-b border-[#2D2E2C]/8 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <img src={logo} alt="Inbound.click" className="h-9 w-auto" />
            <span className="text-sm font-semibold tracking-tight sm:text-base sr-only">
              Inbound.click
            </span>
          </a>

          <a
            href="#workflow"
            className="rounded-full bg-[#2D2E2C] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(45,46,44,0.24)] transition-transform hover:-translate-y-0.5"
          >
            Start Free
          </a>
        </div>
      </header>

      <main
        id="top"
        className="relative mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8"
      >
        <HeroSection />
        <SpeedDivider />
        <ProblemSection />
        <SpeedDivider />
        <AiArchitectSection />
        <SpeedDivider />
        <WorkflowSection />
      </main>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="pt-12 pb-14 sm:pt-16 sm:pb-16 lg:pt-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.03fr] lg:items-start">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[#2D2E2C]/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#2D2E2C]/70 shadow-[0_6px_20px_rgba(45,46,44,0.08)]">
            <SpeedLines />
            Social Lead Engine
          </p>

          <h1 className="mt-6 text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
            Turn Your Social Traffic into Qualified Leads, Automatically.
          </h1>

          <TypewriterUrl />

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#2D2E2C]/75 sm:text-lg">
            Built for Social Bios. Stop leaking traffic and start capturing
            high-intent leads through zero-setup conversational AI flows.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/signin"
              className="rounded-full bg-[#EE7A64] px-6 py-3.5 text-sm font-semibold text-[#2D2E2C] shadow-[0_14px_30px_rgba(238,122,100,0.34)] transition-transform hover:-translate-y-0.5"
            >
              Launch Your Capture Engine
            </Link>
            <a
              href="#ai-architect"
              className="rounded-full border border-[#2D2E2C]/16 bg-white px-6 py-3.5 text-sm font-semibold text-[#2D2E2C] shadow-[0_10px_24px_rgba(45,46,44,0.08)]"
            >
              See AI Architect
            </a>
          </div>
        </div>

        <HeroMockup />
      </div>
    </section>
  )
}

function TypewriterUrl() {
  const [nameIndex, setNameIndex] = useState(0)
  const [typedLength, setTypedLength] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const activeName = DYNAMIC_NAMES[nameIndex]

  useEffect(() => {
    const typingDelay = isDeleting ? 45 : 95

    if (!isDeleting && typedLength === activeName.length) {
      const holdTimer = window.setTimeout(() => setIsDeleting(true), 1200)
      return () => window.clearTimeout(holdTimer)
    }

    if (isDeleting && typedLength === 0) {
      setIsDeleting(false)
      setNameIndex((index) => (index + 1) % DYNAMIC_NAMES.length)
      return
    }

    const timer = window.setTimeout(() => {
      setTypedLength((length) => length + (isDeleting ? -1 : 1))
    }, typingDelay)

    return () => window.clearTimeout(timer)
  }, [activeName, isDeleting, typedLength])

  const typedName = useMemo(
    () => activeName.slice(0, typedLength),
    [activeName, typedLength],
  )

  return (
    <div className="mt-6 rounded-3xl border border-[#2D2E2C]/12 bg-[#2D2E2C] px-5 py-4 shadow-[0_18px_36px_rgba(45,46,44,0.26)] sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
        Your brand at
      </p>
      <p className="mt-2 text-lg font-semibold text-white sm:text-xl">
        inbound.link/
        <span className="text-[#71D0AC]">{typedName || "\u00a0"}</span>
        <span
          aria-hidden
          className="ml-0.5 inline-block h-5 w-[2px] animate-[blink_1s_steps(1,end)_infinite] bg-[#F7C664] align-middle"
        />
      </p>
    </div>
  )
}

function HeroMockup() {
  return (
    <section className="mx-auto w-full max-w-[520px] lg:pt-3">
      <div className="relative rounded-[2rem] border border-[#2D2E2C]/10 bg-[linear-gradient(140deg,rgba(255,255,255,0.92),rgba(241,251,246,0.82))] p-4 shadow-[0_24px_50px_rgba(45,46,44,0.12)] sm:p-5">
        <div className="mx-auto w-full max-w-[340px] rounded-[2rem] border border-[#2D2E2C]/20 bg-[#1F201F] p-2 shadow-[0_20px_40px_rgba(45,46,44,0.45)]">
          <div className="overflow-hidden rounded-[1.6rem] bg-white">
            <div className="flex items-center justify-between bg-[#2D2E2C] px-4 py-3 text-white">
              <p className="text-sm font-semibold">@fitness-coach</p>
              <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold">
                LIVE
              </span>
            </div>

            <div className="space-y-3 px-4 pt-4 pb-5">
              <MockPill bg="#EE7A64" label="Start your intake" />
              <MockPill bg="#F7C664" label="Tell me your struggle" />
              <MockPill bg="#71D0AC" label="Drop your email" />

              <button
                type="button"
                className="mt-3 w-full rounded-full bg-[#71D0AC] px-4 py-3 text-sm font-bold text-[#12382c] shadow-[0_10px_24px_rgba(113,208,172,0.45)]"
              >
                Open AI Capture Flow {"->"}
              </button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -left-2 bottom-5 rounded-2xl border border-white/45 bg-white/48 px-4 py-2 backdrop-blur-xl shadow-[0_12px_24px_rgba(45,46,44,0.15)] sm:-left-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2D2E2C]/65">
            Funnel quality
          </p>
          <p className="text-sm font-extrabold text-[#3AAE86]">
            87% completion
          </p>
        </div>

        <div className="pointer-events-none absolute -right-2 top-[70%] rounded-2xl border border-white/45 bg-white/48 px-4 py-2 backdrop-blur-xl shadow-[0_12px_24px_rgba(45,46,44,0.15)] sm:-right-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2D2E2C]/65">
            Live signal
          </p>
          <p className="text-sm font-extrabold text-[#B47C04]">+3 new leads</p>
        </div>
      </div>
    </section>
  )
}

function ProblemSection() {
  return (
    <section className="py-12 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2D2E2C]/55 sm:text-sm">
        The Problem
      </p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Traditional links are just menus. Inbound.click is an engine.
      </h2>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        <ProblemCard
          title="One tap, no intent"
          body="Most bio links force people to hunt through options, dropping intent before they ever speak to you."
          tone="bg-[#EE7A64]/20"
        />
        <ProblemCard
          title="No qualification"
          body="Traffic volume looks good, but there is no fast way to separate curious visitors from ready-to-buy leads."
          tone="bg-[#F7C664]/20"
        />
        <ProblemCard
          title="Slow follow-up"
          body="By the time you notice activity, your hottest prospects already moved on to the next profile."
          tone="bg-[#71D0AC]/20"
        />
      </div>
    </section>
  )
}

function AiArchitectSection() {
  return (
    <section id="ai-architect" className="py-12 sm:py-14">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2D2E2C]/55 sm:text-sm">
            AI Architect
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Prompt the flow. Ship the form instantly.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#2D2E2C]/73">
            Describe what you need in one sentence and Inbound.click generates a
            complete conversational capture flow with the right fields,
            sequencing, and qualification logic.
          </p>
        </div>

        <div className="rounded-[2rem] border border-[#2D2E2C]/10 bg-white p-5 shadow-[0_18px_42px_rgba(45,46,44,0.1)] sm:p-6">
          <div className="rounded-2xl border border-[#2D2E2C]/8 bg-[#f8f9f8] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2D2E2C]/58">
              You
            </p>
            <p className="mt-2 inline-flex rounded-2xl rounded-bl-md bg-[#2D2E2C] px-4 py-2 text-sm font-medium text-white">
              Collect name and budget
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-[#2D2E2C]/8 bg-[linear-gradient(145deg,rgba(113,208,172,0.25),rgba(255,255,255,0.95))] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2D2E2C]/58">
              AI Architect
            </p>
            <div className="mt-3 space-y-2">
              <GeneratedField name="Full name" />
              <GeneratedField name="Budget range" />
              <GeneratedField name="Preferred callback time" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkflowSection() {
  return (
    <section id="workflow" className="py-12 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2D2E2C]/55 sm:text-sm">
        The Workflow
      </p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Three steps from social click to qualified pipeline.
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <WorkflowStep
          step="1"
          title="Link your bio"
          description="Swap your bio URL with your Inbound.click page and turn every tap into a guided entry point."
          accent="bg-[#EE7A64]"
        />
        <WorkflowStep
          step="2"
          title="AI builds your flow"
          description="Define your intake once. The AI creates the conversational funnel around your lead criteria."
          accent="bg-[#F7C664]"
        />
        <WorkflowStep
          step="3"
          title="Get instant SMS/WhatsApp alerts"
          description="High-intent responses trigger real-time notifications so your follow-up happens while urgency is high."
          accent="bg-[#71D0AC]"
        />
      </div>

      <div className="mt-10 rounded-[2rem] border border-[#2D2E2C]/10 bg-[#2D2E2C] px-6 py-7 text-white shadow-[0_22px_44px_rgba(45,46,44,0.24)]">
        <h3 className="text-2xl font-bold tracking-tight">
          Ready to stop leaking high-intent traffic?
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-white/78 sm:text-base">
          Replace static links with AI capture flows that qualify, convert, and
          notify you in real time.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/signin"
            className="rounded-full bg-[#71D0AC] px-6 py-3 text-sm font-bold text-[#12382c] shadow-[0_12px_28px_rgba(113,208,172,0.4)]"
          >
            Build My Lead Engine
          </Link>
          <a
            href="#ai-architect"
            className="rounded-full border border-white/24 px-6 py-3 text-sm font-semibold text-white"
          >
            Watch It Work
          </a>
        </div>
      </div>
    </section>
  )
}

function SpeedLinesBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_18%,rgba(238,122,100,0.24),transparent_28%),radial-gradient(circle_at_90%_12%,rgba(247,198,100,0.24),transparent_24%),radial-gradient(circle_at_74%_84%,rgba(113,208,172,0.2),transparent_26%)]" />
      <span className="absolute top-[16%] -left-28 h-[5px] w-60 animate-[speedline_6s_linear_infinite] rounded-full bg-[#EE7A64]/36" />
      <span className="absolute top-[32%] -left-36 h-[5px] w-80 animate-[speedline_7.4s_linear_infinite] rounded-full bg-[#F7C664]/34" />
      <span className="absolute top-[68%] -left-32 h-[5px] w-72 animate-[speedline_6.6s_linear_infinite] rounded-full bg-[#71D0AC]/32" />
    </div>
  )
}

function SpeedDivider() {
  return (
    <div className="relative h-10 sm:h-12" aria-hidden>
      <span className="absolute top-1/2 left-0 h-[3px] w-20 -translate-y-1/2 rounded-full bg-[#EE7A64]/60" />
      <span className="absolute top-1/2 left-8 h-[3px] w-28 -translate-y-1/2 rounded-full bg-[#F7C664]/58" />
      <span className="absolute top-1/2 left-[4.5rem] h-[3px] w-36 -translate-y-1/2 rounded-full bg-[#71D0AC]/56" />
    </div>
  )
}

function SpeedLines() {
  return (
    <span aria-hidden className="inline-flex items-center gap-1.5">
      <span className="h-1 w-2.5 rounded-full bg-[#EE7A64]" />
      <span className="h-1 w-3.5 rounded-full bg-[#F7C664]" />
      <span className="h-1 w-5 rounded-full bg-[#71D0AC]" />
    </span>
  )
}

function MockPill({ bg, label }: { bg: string; label: string }) {
  return (
    <button
      type="button"
      className="w-full rounded-full border border-[#2D2E2C]/12 px-4 py-3 text-left text-sm font-semibold text-[#2D2E2C] shadow-[0_8px_18px_rgba(45,46,44,0.11)]"
      style={{ backgroundColor: bg }}
    >
      {label}
    </button>
  )
}

function ProblemCard({
  title,
  body,
  tone,
}: {
  title: string
  body: string
  tone: string
}) {
  return (
    <article className="rounded-3xl border border-[#2D2E2C]/10 bg-white p-5 shadow-[0_14px_32px_rgba(45,46,44,0.09)]">
      <div className={`mb-4 h-2.5 w-16 rounded-full ${tone}`} />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#2D2E2C]/72">{body}</p>
    </article>
  )
}

function GeneratedField({ name }: { name: string }) {
  return (
    <div className="rounded-xl border border-[#2D2E2C]/12 bg-white px-3 py-2 text-sm font-semibold text-[#2D2E2C]/78">
      {name}
    </div>
  )
}

function WorkflowStep({
  step,
  title,
  description,
  accent,
}: {
  step: string
  title: string
  description: string
  accent: string
}) {
  return (
    <article className="rounded-3xl border border-[#2D2E2C]/10 bg-white p-5 shadow-[0_14px_32px_rgba(45,46,44,0.09)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2D2E2C]/55">
        Step {step}
      </p>
      <h3 className="mt-2 text-xl font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#2D2E2C]/72">
        {description}
      </p>
      <div className={`mt-4 h-2.5 w-24 rounded-full ${accent}`} />
    </article>
  )
}
