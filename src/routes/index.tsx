import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useMemo, useState } from "react"
import logo from "@/assets/logo.svg"
import { MarketingFooter } from "@/components/marketing-footer"
import { MarketingHeader } from "@/components/marketing-header"

export const Route = createFileRoute("/")({
  head: () => {
    const title =
      "Inbound.click | AI Link in Bio for Lead Capture, Qualification, and Conversion"
    const description =
      "Inbound.click is the platform behind s.uper.bio. Turn your link in bio into an AI lead capture funnel that qualifies prospects, collects contact details, and sends instant SMS or WhatsApp alerts."
    const keywords = [
      "link in bio",
      "ai link in bio",
      "s.uper.bio",
      "inbound.click",
      "lead capture",
      "ai lead capture",
      "lead generation",
      "social media lead generation",
      "qualified leads",
      "lead qualification",
      "conversational forms",
      "conversational lead capture",
      "bio link for business",
      "instagram lead generation",
      "tiktok lead generation",
      "creator lead capture",
      "coach lead capture",
      "realtor lead capture",
      "real estate lead capture",
      "whatsapp lead alerts",
      "sms lead alerts",
      "social bio funnel",
      "link in bio tool",
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
  component: LandingPage,
})

const DYNAMIC_NAMES = [
  "realtor_josh",
  "coach_marcus",
  "design_by_clara",
  "train_with_tara",
  "ads_with_adam",
  "legal_by_laura",
  "socials_with_sam",
]

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FBF8F3] text-[#2D2D2D]">
      <MarketingHeader anchorLogoToTop tone="paper" />

      {/* biome-ignore lint/correctness/useUniqueElementIds: stable anchor ID improves deep links for the landing page */}
      <main id="top" className="relative">
        <HeroSection />
        <DomainSection />
        <ProblemSection />
        <AiArchitectSection />
        <WorkflowSection />
        <FinalCtaSection />
      </main>

      <MarketingFooter />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10">
      {children}
    </div>
  )
}

/** The three right-aligned pills from the logo mark, used as a recurring motif. */
function PillMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex flex-col items-end gap-[3px] ${className}`}
    >
      <span className="h-[5px] w-8 rounded-full bg-[#EE775F]" />
      <span className="h-[5px] w-6 rounded-full bg-[#F8C751]" />
      <span className="h-[5px] w-4 rounded-full bg-[#69D0B2]" />
    </span>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#2D2D2D]/55">
      <PillMark />
      {children}
    </p>
  )
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section className="pt-16 pb-20 sm:pt-24 sm:pb-24">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow>AI link in bio for lead capture</Eyebrow>

            <h1 className="mt-7 text-balance text-[2.75rem] font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              Your link in bio, rebuilt as a{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">lead engine</span>
                <span
                  aria-hidden
                  className="absolute inset-x-[-2px] bottom-[0.08em] z-0 h-[0.32em] -rotate-1 rounded-sm bg-[#F8C751]/80"
                />
              </span>
              .
            </h1>

            <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-[#2D2D2D]/70">
              Inbound.click gives you a conversational page at{" "}
              <strong className="font-semibold text-[#2D2D2D]">
                s.uper.bio/you
              </strong>{" "}
              that greets every visitor, asks the right questions, and pings you
              on WhatsApp the moment a high-intent lead answers.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                to="/signin"
                className="rounded-full bg-[#2D2D2D] px-7 py-3.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EE775F]"
              >
                Claim Your s.uper.bio Link
              </Link>
              <a
                href="#ai-architect"
                className="group text-sm font-semibold text-[#2D2D2D]/75 transition-colors hover:text-[#2D2D2D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EE775F]"
              >
                See the AI build one{" "}
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-200 group-hover:translate-y-0.5 motion-reduce:transition-none"
                >
                  ↓
                </span>
              </a>
            </div>

            <TypewriterUrl />
          </div>

          <HeroPhone />
        </div>
      </Container>
    </section>
  )
}

function TypewriterUrl() {
  const [nameIndex, setNameIndex] = useState(0)
  const [typedLength, setTypedLength] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const activeName = DYNAMIC_NAMES[nameIndex]

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduceMotion(query.matches)
    const onChange = (event: MediaQueryListEvent) =>
      setReduceMotion(event.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    const typingDelay = isDeleting ? 45 : 95

    if (!isDeleting && typedLength === activeName.length) {
      const holdTimer = window.setTimeout(() => setIsDeleting(true), 1400)
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
  }, [activeName, isDeleting, typedLength, reduceMotion])

  const typedName = useMemo(
    () => (reduceMotion ? activeName : activeName.slice(0, typedLength)),
    [activeName, typedLength, reduceMotion],
  )

  return (
    <div className="mt-12">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2D2D2D]/45">
        Your address
      </p>
      <p
        className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
        translate="no"
      >
        <span className="text-[#2D2D2D]/55">s.uper.bio/</span>
        <span className="text-[#EE775F]">{typedName || "\u00a0"}</span>
        <span
          aria-hidden
          className="ml-1 inline-block h-[0.85em] w-[3px] animate-[blink_1s_steps(1,end)_infinite] rounded-full bg-[#F8C751] align-middle motion-reduce:animate-none"
        />
      </p>
    </div>
  )
}

function HeroPhone() {
  return (
    <figure className="mx-auto w-full max-w-[330px]">
      <div className="rounded-[2.4rem] border-[6px] border-[#2D2D2D] bg-white shadow-[0_30px_60px_-24px_rgba(45,45,45,0.4)]">
        <div className="flex items-center justify-between rounded-t-[1.9rem] bg-[#2D2D2D] px-5 pt-3 pb-3.5 text-white">
          <p className="text-sm font-semibold" translate="no">
            s.uper.bio/realtor_josh
          </p>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#69D0B2]">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[#69D0B2]"
            />
            live
          </span>
        </div>

        <div className="space-y-3 px-4 pt-5 pb-4">
          <ChatBubble side="ai">
            Hey, I&rsquo;m Josh&rsquo;s assistant. Buying or selling?
          </ChatBubble>
          <ChatBubble side="visitor">Buying</ChatBubble>
          <ChatBubble side="ai">
            Nice. What budget are you working with?
          </ChatBubble>
          <ChatBubble side="visitor">$400&ndash;500k</ChatBubble>
          <ChatBubble side="ai">
            Got it. Best number to text you a shortlist?
          </ChatBubble>

          <div className="flex gap-2 pt-1" aria-hidden>
            <span className="rounded-full bg-[#EE775F]/16 px-3 py-1.5 text-xs font-semibold text-[#B14B36]">
              555&hellip;
            </span>
            <span className="rounded-full bg-[#F8C751]/22 px-3 py-1.5 text-xs font-semibold text-[#8a6a12]">
              Call me instead
            </span>
          </div>
        </div>

        <div className="mx-4 mb-4 flex items-center justify-between rounded-full border border-[#2D2D2D]/12 px-4 py-2.5">
          <span className="text-sm text-[#2D2D2D]/40">
            Type a reply&hellip;
          </span>
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#69D0B2] text-sm font-bold text-[#12382c]"
          >
            ↑
          </span>
        </div>
      </div>

      <figcaption className="mt-5 text-center text-sm text-[#2D2D2D]/55">
        Every tap becomes a conversation that qualifies the lead for you.
      </figcaption>
    </figure>
  )
}

function ChatBubble({
  side,
  children,
}: {
  side: "ai" | "visitor"
  children: React.ReactNode
}) {
  if (side === "visitor") {
    return (
      <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-[#2D2D2D] px-4 py-2 text-sm font-medium text-white">
        {children}
      </p>
    )
  }
  return (
    <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-[#F4EEE3] px-4 py-2 text-sm text-[#2D2D2D]">
      {children}
    </p>
  )
}

/* ------------------------------------------------------------------ */
/* Two domains, one product                                            */
/* ------------------------------------------------------------------ */

function DomainSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <img
            src={logo}
            alt="Inbound.click"
            width={2909}
            height={399}
            className="mx-auto h-8 w-auto sm:h-10"
          />

          <h2 className="mt-8 text-balance text-3xl font-black tracking-tight sm:text-5xl">
            s.uper.bio is made by Inbound.click.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[#2D2D2D]/70">
            Same product, two addresses. You design and manage your capture
            flows on Inbound.click &mdash; your audience visits the short,
            memorable link in your bio. If a lead lands on{" "}
            <strong className="font-semibold text-[#2D2D2D]">s.uper.bio</strong>
            , Inbound.click is doing the work behind it.
          </p>
        </div>

        <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="text-center sm:flex-1 sm:text-left">
            <p
              className="text-2xl font-extrabold tracking-tight"
              translate="no"
            >
              inbound.click
            </p>
            <p className="mt-1.5 text-sm text-[#2D2D2D]/55">
              Where you build &mdash; the dashboard, the AI architect, your
              leads and alerts.
            </p>
          </div>

          <div
            aria-hidden
            className="flex items-center gap-2.5 pt-1 sm:mt-3 sm:flex-1 sm:px-4"
          >
            <span className="hidden h-px flex-1 bg-[#2D2D2D]/15 sm:block" />
            <span className="h-2 w-2 rounded-full bg-[#EE775F]" />
            <span className="h-2 w-2 rounded-full bg-[#F8C751]" />
            <span className="h-2 w-2 rounded-full bg-[#69D0B2]" />
            <span className="text-sm text-[#2D2D2D]/40">→</span>
            <span className="hidden h-px flex-1 bg-[#2D2D2D]/15 sm:block" />
          </div>

          <div className="text-center sm:flex-1 sm:text-right">
            <p
              className="text-2xl font-extrabold tracking-tight"
              translate="no"
            >
              s.uper.bio/<span className="text-[#EE775F]">you</span>
            </p>
            <p className="mt-1.5 text-sm text-[#2D2D2D]/55">
              Where your audience lands &mdash; the short link you put in every
              social bio.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Problem                                                             */
/* ------------------------------------------------------------------ */

function ProblemSection() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Eyebrow>The problem</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-balance text-3xl font-black tracking-tight sm:text-5xl">
          Most bio links are menus. Menus don&rsquo;t follow up.
        </h2>

        <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
          <ProblemItem
            number="01"
            color="#EE775F"
            title="One tap, zero intent"
            body="A wall of buttons makes visitors hunt for the next step. Most drop off before they ever tell you what they want."
          />
          <ProblemItem
            number="02"
            color="#F8C751"
            title="No qualification"
            body="Click counts look great, but there’s no way to tell a curious scroller from a ready-to-buy lead."
          />
          <ProblemItem
            number="03"
            color="#69D0B2"
            title="Slow follow-up"
            body="By the time you check your inbox, your hottest prospect has already moved on to the next profile."
          />
        </div>
      </Container>
    </section>
  )
}

function ProblemItem({
  number,
  color,
  title,
  body,
}: {
  number: string
  color: string
  title: string
  body: string
}) {
  return (
    <article className="border-t-2 pt-6" style={{ borderTopColor: color }}>
      <p
        className="text-sm font-extrabold tabular-nums"
        style={{ color }}
        aria-hidden
      >
        {number}
      </p>
      <h3 className="mt-3 text-xl font-bold tracking-tight">{title}</h3>
      <p className="mt-3 text-pretty text-base leading-relaxed text-[#2D2D2D]/65">
        {body}
      </p>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* AI Architect                                                        */
/* ------------------------------------------------------------------ */

function AiArchitectSection() {
  return (
    /* biome-ignore lint/correctness/useUniqueElementIds: stable anchor ID improves landing-page SEO and shareable section links */
    <section id="ai-architect" className="scroll-mt-24 bg-white py-20 sm:py-24">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow>AI architect</Eyebrow>
            <h2 className="mt-4 text-balance text-3xl font-black tracking-tight sm:text-5xl">
              Describe your ideal lead. The AI builds the funnel.
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-[#2D2D2D]/70">
              One sentence is all it takes. Inbound.click turns it into a
              complete conversational flow &mdash; the right questions, in the
              right order, with qualification logic tuned to your business.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2D2D2D]/45">
              You
            </p>
            <p className="mt-3 w-fit rounded-2xl rounded-bl-md bg-[#2D2D2D] px-5 py-3 text-sm font-medium text-white">
              &ldquo;Collect name, budget, and when they want to start.&rdquo;
            </p>

            <p className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#2D2D2D]/45">
              AI architect
              <PillMark />
            </p>
            <div className="mt-4 space-y-5">
              <GeneratedField label="Full name" hint="Maria Souza" />
              <GeneratedField label="Budget range" hint="$2,000 – $5,000" />
              <GeneratedField label="Start date" hint="Within 30 days" />
            </div>
            <p className="mt-6 text-sm text-[#2D2D2D]/55">
              <span aria-hidden className="mr-1.5 text-[#69D0B2]">
                ✓
              </span>
              Flow published to your bio link &mdash; ready in seconds.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

function GeneratedField({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="border-b border-[#2D2D2D]/20 pb-2">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2D2D2D]/50">
        {label}
      </p>
      <p className="mt-1 text-base text-[#2D2D2D]/35">{hint}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Workflow                                                            */
/* ------------------------------------------------------------------ */

function WorkflowSection() {
  return (
    /* biome-ignore lint/correctness/useUniqueElementIds: stable anchor ID improves landing-page SEO and shareable section links */
    <section id="workflow" className="scroll-mt-24 py-20 sm:py-24">
      <Container>
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-balance text-3xl font-black tracking-tight sm:text-5xl">
          Live in three steps.
        </h2>

        <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
          <WorkflowStep
            color="#EE775F"
            step="1"
            title="Point your bio at it"
            description="Swap the URL in your Instagram, TikTok, or YouTube bio for your s.uper.bio link. That’s the only change your audience sees."
          />
          <WorkflowStep
            color="#F8C751"
            step="2"
            title="Tell the AI what counts"
            description="Describe your ideal lead once on Inbound.click. The AI builds the conversation that qualifies every visitor against it."
          />
          <WorkflowStep
            color="#69D0B2"
            step="3"
            title="Get pinged while it’s hot"
            description="High-intent answers trigger instant SMS or WhatsApp alerts, so you follow up in minutes — not days."
          />
        </ol>
      </Container>
    </section>
  )
}

function WorkflowStep({
  color,
  step,
  title,
  description,
}: {
  color: string
  step: string
  title: string
  description: string
}) {
  return (
    <li className="list-none">
      <span
        className="flex h-10 w-10 items-center justify-center rounded-full text-base font-extrabold text-[#2D2D2D]"
        style={{ backgroundColor: color }}
        aria-hidden
      >
        {step}
      </span>
      <h3 className="mt-5 text-xl font-bold tracking-tight">{title}</h3>
      <p className="mt-3 text-pretty text-base leading-relaxed text-[#2D2D2D]/65">
        {description}
      </p>
    </li>
  )
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */

function FinalCtaSection() {
  return (
    <section className="bg-[#2D2D2D] py-20 text-white sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <PillMark className="scale-125" />
          <h2 className="mt-7 text-balance text-3xl font-black tracking-tight sm:text-5xl">
            Stop leaking high-intent traffic.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-white/70">
            Replace your static bio link with a conversation that qualifies
            leads and notifies you in real time. Free to start &mdash; and your
            s.uper.bio name might still be available.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
            <Link
              to="/signin"
              className="rounded-full bg-[#69D0B2] px-7 py-3.5 text-sm font-bold text-[#12382c] transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8C751]"
            >
              Start Free on Inbound.click
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-semibold text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F8C751]"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
