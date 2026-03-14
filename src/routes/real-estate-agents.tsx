import { createFileRoute, Link } from "@tanstack/react-router"
import { Authenticated, Unauthenticated } from "convex/react"
import logo from "../assets/logo.svg"

export const Route = createFileRoute("/real-estate-agents")({
  head: () => {
    const title =
      "Real Estate Lead Generation for Agents on Instagram, TikTok, and YouTube | Inbound.click"
    const description =
      "Inbound.click helps real estate agents turn social media traffic into qualified home buyer leads with AI chat funnels, buyer qualification, and instant SMS or WhatsApp alerts."
    const keywords = [
      "real estate lead generation",
      "real estate leads",
      "buyer leads",
      "home buyer leads",
      "real estate social media leads",
      "instagram leads for realtors",
      "tiktok leads for real estate agents",
      "youtube leads for realtors",
      "real estate link in bio",
      "real estate lead capture",
      "buyer lead qualification",
      "real estate ai chatbot",
      "real estate conversational forms",
      "realtor marketing",
      "real estate instagram marketing",
      "social media for real estate agents",
      "lead generation for realtors",
      "whatsapp alerts for real estate leads",
      "sms alerts for realtor leads",
      "real estate funnel",
    ].join(", ")

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: keywords },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    }
  },
  component: RealEstateLandingPage,
})

function RealEstateLandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f3ec] text-[#1c1917]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,166,98,0.24),transparent_32%),radial-gradient(circle_at_88%_16%,rgba(14,116,144,0.18),transparent_26%),radial-gradient(circle_at_70%_84%,rgba(180,83,9,0.16),transparent_24%)]" />
        <div className="absolute top-24 left-[8%] h-48 w-48 rounded-full border border-[#d6c4ab]/40" />
        <div className="absolute right-[10%] bottom-24 h-64 w-64 rounded-full border border-[#0f766e]/10" />
      </div>

      <header className="sticky top-0 z-50 border-b border-[#1c1917]/8 bg-[#f7f3ec]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Inbound.click" className="h-5 w-auto md:h-7" />
            <span className="sr-only text-sm font-semibold tracking-tight sm:text-base">
              Inbound.click
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="#buyer-flow"
              className="hidden rounded-full border border-[#1c1917]/10 bg-white/70 px-4 py-2 text-sm font-semibold text-[#1c1917] shadow-[0_8px_20px_rgba(28,25,23,0.06)] sm:inline-flex"
            >
              See Buyer Flow
            </a>
            <Authenticated>
              <Link
                to="/bio"
                className="rounded-full bg-[#1c1917] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(28,25,23,0.18)] transition-transform hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
            </Authenticated>
            <Unauthenticated>
              <Link
                to="/signin"
                className="rounded-full bg-[#0f766e] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,118,110,0.25)] transition-transform hover:-translate-y-0.5"
              >
                Start Free
              </Link>
            </Unauthenticated>
          </div>
        </div>
      </header>

      {/* biome-ignore lint/correctness/useUniqueElementIds: stable anchor ID improves landing-page SEO and shareable deep links */}
      <main
        id="top"
        className="relative mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8"
      >
        <HeroSection />
        <TrustStrip />
        <PainSection />
        <BuyerFlowSection />
        <QualificationSection />
        <AudienceSection />
        <FinalCtaSection />
      </main>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="pt-12 pb-14 sm:pt-16 sm:pb-18 lg:pt-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.04fr_0.96fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[#1c1917]/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f766e] shadow-[0_8px_22px_rgba(28,25,23,0.06)]">
            Real Estate Social Media Lead Generation
          </p>

          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            Turn Instagram, TikTok, and YouTube traffic into qualified home
            buyer leads.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#1c1917]/72 sm:text-lg">
            Inbound.click gives real estate agents an AI link-in-bio funnel that
            captures buyer intent, asks the right pre-qualification questions,
            and alerts you the moment a serious prospect is ready to talk.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/signin"
              className="rounded-full bg-[#b45309] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(180,83,9,0.28)] transition-transform hover:-translate-y-0.5"
            >
              Build My Buyer Funnel
            </Link>
            <a
              href="#buyer-flow"
              className="rounded-full border border-[#1c1917]/14 bg-white/80 px-6 py-3.5 text-sm font-semibold text-[#1c1917] shadow-[0_10px_24px_rgba(28,25,23,0.06)]"
            >
              See the Buyer Flow
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-medium text-[#1c1917]/70">
            <span className="rounded-full bg-white/80 px-4 py-2 shadow-[0_8px_18px_rgba(28,25,23,0.04)]">
              Buyer qualification
            </span>
            <span className="rounded-full bg-white/80 px-4 py-2 shadow-[0_8px_18px_rgba(28,25,23,0.04)]">
              Instant lead alerts
            </span>
            <span className="rounded-full bg-white/80 px-4 py-2 shadow-[0_8px_18px_rgba(28,25,23,0.04)]">
              Built for social media agents
            </span>
          </div>
        </div>

        <HeroMockup />
      </div>
    </section>
  )
}

function HeroMockup() {
  return (
    <section className="mx-auto w-full max-w-[540px]">
      <div className="relative rounded-[2rem] border border-[#1c1917]/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(240,248,246,0.85))] p-4 shadow-[0_26px_56px_rgba(28,25,23,0.12)] sm:p-5">
        <div className="mx-auto w-full max-w-[350px] rounded-[2rem] border border-[#1c1917]/16 bg-[#1c1917] p-2 shadow-[0_20px_42px_rgba(28,25,23,0.35)]">
          <div className="overflow-hidden rounded-[1.6rem] bg-[#fcfaf6]">
            <div className="border-b border-[#1c1917]/8 bg-[#f1e3cf] px-4 py-3">
              <p className="text-sm font-semibold text-[#1c1917]">
                @miami.homes.by.alex
              </p>
              <p className="mt-1 text-xs text-[#1c1917]/60">
                New condos, walkthroughs, and buyer tips
              </p>
            </div>

            <div className="space-y-3 px-4 pt-4 pb-5">
              <MessageBubble tone="dark">
                Looking to buy in Miami this year?
              </MessageBubble>
              <MessageBubble tone="light">
                What price range are you targeting?
              </MessageBubble>
              <MessageBubble tone="light">
                Do you already have financing lined up?
              </MessageBubble>
              <MessageBubble tone="light">
                Which neighborhoods do you want to tour?
              </MessageBubble>

              <button
                type="button"
                className="mt-2 w-full rounded-full bg-[#0f766e] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(15,118,110,0.32)]"
              >
                Start Buyer Intake
              </button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -left-3 top-8 rounded-2xl border border-white/50 bg-white/75 px-4 py-3 backdrop-blur-xl shadow-[0_14px_30px_rgba(28,25,23,0.1)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1c1917]/55">
            Captured info
          </p>
          <p className="mt-1 text-sm font-bold text-[#1c1917]">
            Budget, timeline, financing
          </p>
        </div>

        <div className="pointer-events-none absolute right-0 bottom-8 rounded-2xl border border-white/50 bg-white/78 px-4 py-3 backdrop-blur-xl shadow-[0_14px_30px_rgba(28,25,23,0.1)] sm:-right-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1c1917]/55">
            Agent alert
          </p>
          <p className="mt-1 text-sm font-bold text-[#0f766e]">
            Buyer ready for callback
          </p>
        </div>
      </div>
    </section>
  )
}

function MessageBubble({
  children,
  tone,
}: {
  children: React.ReactNode
  tone: "dark" | "light"
}) {
  return (
    <div
      className={
        tone === "dark"
          ? "max-w-[88%] rounded-2xl rounded-bl-md bg-[#1c1917] px-4 py-3 text-sm font-medium text-white"
          : "max-w-[92%] rounded-2xl rounded-bl-md border border-[#1c1917]/8 bg-white px-4 py-3 text-sm font-medium text-[#1c1917]"
      }
    >
      {children}
    </div>
  )
}

function TrustStrip() {
  return (
    <section className="py-6">
      <div className="grid gap-3 rounded-[2rem] border border-[#1c1917]/8 bg-white/70 px-5 py-5 shadow-[0_18px_40px_rgba(28,25,23,0.06)] sm:grid-cols-3 sm:px-6">
        <StatCard
          label="Best for"
          value="Agents growing through social content"
        />
        <StatCard
          label="Captures"
          value="Buyer timeline, budget, and financing status"
        />
        <StatCard
          label="Follow-up"
          value="SMS or WhatsApp alerts for hot prospects"
        />
      </div>
    </section>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#1c1917]/8 bg-[#fcfaf6] px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1c1917]/50">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-[#1c1917]">
        {value}
      </p>
    </div>
  )
}

function PainSection() {
  return (
    <section className="py-12 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1c1917]/55 sm:text-sm">
        Why Social Agents Lose Buyers
      </p>
      <h2 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
        Views and DMs do not equal qualified buyer leads.
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <PainCard
          title="Your bio link is passive"
          body="Most real estate bio links send buyers to a menu of options instead of guiding them into a buyer intake conversation."
          accent="bg-[#d97706]/18"
        />
        <PainCard
          title="DMs stay unqualified"
          body="You still have to manually figure out who is browsing casually and who has timeline, budget, and financing in place."
          accent="bg-[#0f766e]/16"
        />
        <PainCard
          title="Hot buyers cool off fast"
          body="If you do not respond while intent is high, serious prospects keep scrolling and reach out to the next agent in their feed."
          accent="bg-[#7c2d12]/14"
        />
      </div>
    </section>
  )
}

function PainCard({
  title,
  body,
  accent,
}: {
  title: string
  body: string
  accent: string
}) {
  return (
    <article className="rounded-3xl border border-[#1c1917]/10 bg-white/80 p-5 shadow-[0_14px_32px_rgba(28,25,23,0.06)]">
      <div className={`mb-4 h-2.5 w-18 rounded-full ${accent}`} />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#1c1917]/70">{body}</p>
    </article>
  )
}

function BuyerFlowSection() {
  return (
    <>
      {/* biome-ignore lint/correctness/useUniqueElementIds: stable anchor ID improves landing-page SEO and shareable deep links */}
      <section id="buyer-flow" className="py-12 sm:py-14">
        <div className="grid items-start gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1c1917]/55 sm:text-sm">
              Buyer Lead Funnel
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              A real estate landing page that works like your best ISA.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#1c1917]/72">
              Instead of sending buyers to a dead-end link tree, Inbound.click
              starts a guided conversation that captures what you need before
              you call.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#1c1917]/8 bg-white/75 p-5 shadow-[0_18px_42px_rgba(28,25,23,0.07)] sm:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FlowStep
                step="1"
                title="Lead taps your bio link"
                body="From Instagram Reels, TikTok walkthroughs, YouTube Shorts, or listing content."
              />
              <FlowStep
                step="2"
                title="AI starts buyer intake"
                body="The flow asks about price range, buying timeline, location, and financing status."
              />
              <FlowStep
                step="3"
                title="Serious buyers get flagged"
                body="High-intent responses trigger an instant alert so you can follow up while interest is fresh."
              />
              <FlowStep
                step="4"
                title="You respond with context"
                body="Instead of starting cold, you already know the lead's goals before the first call or tour."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function FlowStep({
  step,
  title,
  body,
}: {
  step: string
  title: string
  body: string
}) {
  return (
    <article className="rounded-3xl border border-[#1c1917]/8 bg-[#fcfaf6] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0f766e]">
        Step {step}
      </p>
      <h3 className="mt-2 text-lg font-bold tracking-tight text-[#1c1917]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[#1c1917]/68">{body}</p>
    </article>
  )
}

function QualificationSection() {
  return (
    <section className="py-12 sm:py-14">
      <div className="rounded-[2rem] border border-[#1c1917]/8 bg-[#1c1917] px-6 py-8 text-white shadow-[0_24px_50px_rgba(28,25,23,0.2)] sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
          What You Can Ask
        </p>
        <h2 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Pre-qualify buyers before they ever hit your calendar.
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <QualificationPill label="Target budget" />
          <QualificationPill label="Cash or mortgage" />
          <QualificationPill label="Buying timeline" />
          <QualificationPill label="Preferred neighborhoods" />
          <QualificationPill label="Need to sell first" />
          <QualificationPill label="Property type" />
          <QualificationPill label="Tour readiness" />
          <QualificationPill label="Best callback time" />
        </div>
      </div>
    </section>
  )
}

function QualificationPill({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/6 px-4 py-4 text-sm font-semibold text-white/92">
      {label}
    </div>
  )
}

function AudienceSection() {
  return (
    <section className="py-12 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1c1917]/55 sm:text-sm">
        Built For
      </p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Agents building audience-driven buyer pipelines.
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <AudienceCard
          title="Instagram agents"
          body="For agents using Reels, stories, and neighborhood content to drive inbound buyer interest."
        />
        <AudienceCard
          title="TikTok realtors"
          body="For short-form creators posting tours, market updates, and home-buying tips that attract first-contact leads."
        />
        <AudienceCard
          title="YouTube educators"
          body="For agents turning local expertise and buyer education into high-intent conversations instead of passive views."
        />
      </div>
    </section>
  )
}

function AudienceCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-3xl border border-[#1c1917]/10 bg-white/80 p-5 shadow-[0_14px_32px_rgba(28,25,23,0.06)]">
      <h3 className="text-xl font-bold tracking-tight text-[#1c1917]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[#1c1917]/70">{body}</p>
    </article>
  )
}

function FinalCtaSection() {
  return (
    <section className="py-12 sm:py-14">
      <div className="rounded-[2rem] border border-[#b45309]/15 bg-[linear-gradient(135deg,#fff8ef_0%,#f3faf9_100%)] px-6 py-8 shadow-[0_22px_44px_rgba(28,25,23,0.08)] sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0f766e]">
          Real Estate Lead Capture
        </p>
        <h2 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-[#1c1917] sm:text-4xl">
          Stop sending buyer traffic to static links.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#1c1917]/72">
          Turn your social media audience into a qualified buyer pipeline with
          an AI landing page built for real estate agents.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/signin"
            className="rounded-full bg-[#0f766e] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(15,118,110,0.24)]"
          >
            Start Capturing Buyer Leads
          </Link>
          <a
            href="#top"
            className="rounded-full border border-[#1c1917]/12 bg-white/80 px-6 py-3 text-sm font-semibold text-[#1c1917]"
          >
            Back to Top
          </a>
        </div>
      </div>
    </section>
  )
}
