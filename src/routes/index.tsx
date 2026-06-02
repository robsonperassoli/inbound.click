import { createFileRoute, Link } from "@tanstack/react-router"
import {
  ConversationDemo,
  type ConversationTurn,
} from "@/components/marketing/conversation-demo"
import { MarketingFooter } from "@/components/marketing-footer"
import { MarketingHeader } from "@/components/marketing-header"

export const Route = createFileRoute("/")({
  head: () => {
    const title =
      "Inbound.click | Turn social media traffic into qualified leads"
    const description =
      "Replace static link-in-bio pages with conversational experiences that qualify prospects, collect contact details, and help you book more calls and close more business."
    const keywords = [
      "lead generation",
      "customer acquisition",
      "social media leads",
      "lead capture",
      "qualified leads",
      "lead qualification",
      "conversational landing page",
      "link in bio for business",
      "instagram lead generation",
      "tiktok lead generation",
      "coach lead generation",
      "consultant lead generation",
      "agency lead generation",
      "realtor lead generation",
      "creator lead generation",
      "book more calls",
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

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAFAF8] font-inter text-[#2D2D2D] antialiased">
      <MarketingHeader anchorLogoToTop />

      {/* biome-ignore lint/correctness/useUniqueElementIds: stable anchor ID improves deep links for the landing page */}
      <main id="top">
        <HeroSection />
        <LogoStrip />
        <ProblemSection />
        <DemoSection />
        <BenefitsSection />
        <UseCasesSection />
        <HowItWorksSection />
        <FinalCtaSection />
      </main>

      <MarketingFooter />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

const HERO_SCRIPT: ConversationTurn[] = [
  {
    role: "bot",
    text: "Hey! Thanks for stopping by. What are you looking for today?",
  },
  { role: "user", text: "I need a website redesign" },
  { role: "bot", text: "Love it. Roughly what budget are you working with?" },
  { role: "user", text: "Around $5k–10k" },
  {
    role: "bot",
    text: "Perfect. What's the best email to send next steps to?",
  },
  { role: "user", text: "jordan@studio.co" },
]

function HeroSection() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(70%_120%_at_50%_-10%,rgba(238,119,95,0.10),transparent_60%)]"
      />
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="ic-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#56554E] shadow-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#69D0B2]" />
            Lead generation for social-first businesses
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-[#2D2D2D] sm:text-5xl lg:text-[3.5rem]">
            Your social media traffic should generate leads, not just clicks.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#56554E]">
            Replace static link-in-bio pages with conversational experiences
            that qualify prospects, collect contact details, and help you close
            more business.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/signin"
              className="rounded-full bg-[#EE775F] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_-8px_rgba(238,119,95,0.6)] transition-all hover:bg-[#E45F49] hover:shadow-[0_16px_32px_-8px_rgba(238,119,95,0.7)]"
            >
              Start free
            </Link>
            <a
              href="#demo"
              className="rounded-full border border-black/10 bg-white px-7 py-3.5 text-sm font-semibold text-[#2D2D2D] transition-colors hover:bg-[#F4F4F1]"
            >
              See demo
            </a>
          </div>

          <p className="mt-5 text-sm text-[#7C7A71]">
            No credit card required · Live in minutes
          </p>
        </div>

        <div className="ic-fade-up" style={{ animationDelay: "0.12s" }}>
          <ConversationDemo
            handle="@jordan.studio"
            status="Online now"
            script={HERO_SCRIPT}
            lead={{
              fields: [
                { label: "Looking for", value: "Website redesign" },
                { label: "Budget", value: "$5k–10k" },
                { label: "Email", value: "jordan@studio.co" },
              ],
            }}
          />
        </div>
      </div>
    </section>
  )
}

function LogoStrip() {
  const audiences = [
    "Coaches",
    "Consultants",
    "Agencies",
    "Realtors",
    "Creators",
    "Service businesses",
  ]
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#9C9A90]">
        Built for the people who live in their DMs
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {audiences.map((label) => (
          <span
            key={label}
            className="text-base font-semibold text-[#9C9A90] sm:text-lg"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Problem                                                                    */
/* -------------------------------------------------------------------------- */

function ProblemSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        eyebrow="The problem"
        title="Most link-in-bio pages lose potential customers."
        description="A list of links asks visitors to do the work. The ones with real intent get distracted, tap away, and you never even know they were there."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <PathCard
          tone="loss"
          label="A static menu"
          steps={["Instagram", "Linktree", "Visitor leaves"]}
          footnote="Clicks happen. Conversations don't. Leads slip away silently."
        />
        <PathCard
          tone="win"
          label="A conversation"
          steps={[
            "Instagram",
            "Inbound.click",
            "Conversation",
            "Qualified lead",
          ]}
          footnote="Every visitor is greeted, guided, and qualified — then handed to you."
        />
      </div>
    </section>
  )
}

function PathCard({
  tone,
  label,
  steps,
  footnote,
}: {
  tone: "loss" | "win"
  label: string
  steps: string[]
  footnote: string
}) {
  const isWin = tone === "win"
  return (
    <article
      className={`rounded-3xl border p-7 ${
        isWin
          ? "border-[#EE775F]/20 bg-white shadow-[0_24px_50px_-30px_rgba(238,119,95,0.45)]"
          : "border-black/[0.06] bg-[#F4F4F1]"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${
            isWin ? "text-[#EE775F]" : "text-[#9C9A90]"
          }`}
        >
          {label}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          return (
            <div key={step} className="flex items-center gap-2">
              <span
                className={`rounded-full px-3.5 py-2 text-sm font-semibold ${
                  isWin && isLast
                    ? "bg-[#69D0B2] text-white"
                    : isWin
                      ? "bg-[#EE775F]/10 text-[#E45F49]"
                      : !isWin && isLast
                        ? "bg-[#2D2D2D]/[0.06] text-[#9C9A90] line-through"
                        : "bg-white text-[#56554E]"
                }`}
              >
                {step}
              </span>
              {!isLast && (
                <svg
                  viewBox="0 0 20 20"
                  className={`h-4 w-4 ${isWin ? "text-[#EE775F]" : "text-[#9C9A90]"}`}
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10h11m0 0-4-4m4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          )
        })}
      </div>

      <p
        className={`mt-5 text-sm leading-relaxed ${isWin ? "text-[#56554E]" : "text-[#7C7A71]"}`}
      >
        {footnote}
      </p>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/* Interactive demo                                                           */
/* -------------------------------------------------------------------------- */

const DEMO_SCRIPT: ConversationTurn[] = [
  { role: "bot", text: "Hi! What are you hoping to work on right now?" },
  { role: "user", text: "Growing my coaching business" },
  {
    role: "bot",
    text: "Awesome. Where are you at today — just starting or scaling?",
  },
  { role: "user", text: "Scaling — about 5 clients" },
  { role: "bot", text: "Got it. What's the best email to send your plan to?" },
  { role: "user", text: "alex@coachalex.com" },
]

function DemoSection() {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: stable anchor for deep links
    <section id="demo" className="scroll-mt-24 bg-white py-20 sm:py-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <SectionHeading
            align="left"
            eyebrow="See it in action"
            title="Qualification that feels like a conversation, not a form."
            description="Your visitor just chats. Behind the scenes, every answer is captured and organized so you know exactly who's worth your time."
          />

          <div className="mt-8 space-y-5">
            <DemoStep
              index="1"
              title="Understand intent"
              body="Open with a friendly question that surfaces what the visitor actually wants."
            />
            <DemoStep
              index="2"
              title="Qualify naturally"
              body="Follow up on budget, timeline, or fit — one easy question at a time."
            />
            <DemoStep
              index="3"
              title="Capture contact details"
              body="Collect the email or phone number once the visitor is warmed up and ready."
            />
          </div>
        </div>

        <ConversationDemo
          handle="@coach.alex"
          status="Replies in seconds"
          script={DEMO_SCRIPT}
          lead={{
            fields: [
              { label: "Goal", value: "Grow coaching business" },
              { label: "Stage", value: "Scaling · 5 clients" },
              { label: "Email", value: "alex@coachalex.com" },
            ],
          }}
        />
      </div>
    </section>
  )
}

function DemoStep({
  index,
  title,
  body,
}: {
  index: string
  title: string
  body: string
}) {
  return (
    <div className="flex gap-4">
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#EE775F]/10 text-sm font-bold text-[#EE775F]">
        {index}
      </span>
      <div>
        <h3 className="text-base font-semibold text-[#2D2D2D]">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-[#7C7A71]">{body}</p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Benefits                                                                   */
/* -------------------------------------------------------------------------- */

const BENEFITS: {
  title: string
  body: string
  icon: React.ReactNode
}[] = [
  {
    title: "Capture more leads",
    body: "Turn passive visitors into named contacts instead of anonymous clicks that disappear.",
    icon: <IconMagnet />,
  },
  {
    title: "Qualify prospects automatically",
    body: "Know each visitor's intent, budget, and fit before you ever pick up the phone.",
    icon: <IconFilter />,
  },
  {
    title: "Respond instantly",
    body: "Greet every visitor the moment they arrive, day or night, without lifting a finger.",
    icon: <IconBolt />,
  },
  {
    title: "Book more calls",
    body: "Move qualified prospects straight to your calendar while their interest is hot.",
    icon: <IconCalendar />,
  },
  {
    title: "Stop losing social traffic",
    body: "Every profile visit becomes a real opportunity instead of a one-way trip off your page.",
    icon: <IconShield />,
  },
  {
    title: "Follow up at the right time",
    body: "Get notified the instant a high-intent lead comes in so you never miss the window.",
    icon: <IconBell />,
  },
]

function BenefitsSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Why it works"
        title="Built around the outcomes you actually care about."
        description="Not features for the sake of features — just more leads, better quality, and faster follow-up."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <article
            key={benefit.title}
            className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(45,45,45,0.04)] transition-shadow hover:shadow-[0_18px_40px_-26px_rgba(45,45,45,0.35)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EE775F]/10 text-[#EE775F]">
              {benefit.icon}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#2D2D2D]">
              {benefit.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#7C7A71]">
              {benefit.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Use cases                                                                  */
/* -------------------------------------------------------------------------- */

const USE_CASES: {
  audience: string
  tagline: string
  conversation: ConversationTurn[]
}[] = [
  {
    audience: "Coaches",
    tagline: "Fill your programs with people who are ready to commit.",
    conversation: [
      { role: "bot", text: "What goal are you working toward?" },
      { role: "user", text: "Run my first marathon" },
    ],
  },
  {
    audience: "Consultants",
    tagline: "Separate serious projects from tire-kickers before the call.",
    conversation: [
      { role: "bot", text: "What's the challenge you're solving?" },
      { role: "user", text: "Scaling ops past $1M" },
    ],
  },
  {
    audience: "Agencies",
    tagline: "Capture project scope and budget while interest is high.",
    conversation: [
      { role: "bot", text: "What kind of work do you need?" },
      { role: "user", text: "Paid ads + landing pages" },
    ],
  },
  {
    audience: "Realtors",
    tagline: "Qualify buyers and sellers straight from your bio.",
    conversation: [
      { role: "bot", text: "Are you buying, selling, or both?" },
      { role: "user", text: "Buying in Austin" },
    ],
  },
  {
    audience: "Creators",
    tagline: "Turn followers into a list of warm, reachable leads.",
    conversation: [
      { role: "bot", text: "What brought you here today?" },
      { role: "user", text: "Brand collab inquiry" },
    ],
  },
]

function UseCasesSection() {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: stable anchor for deep links
    <section id="use-cases" className="scroll-mt-24 bg-white py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Use cases"
          title="One link, tailored to how you win business."
          description="Every conversation adapts to your world — so the questions sound like you and the leads fit your offer."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((useCase) => (
            <UseCaseCard key={useCase.audience} {...useCase} />
          ))}
          <div className="flex flex-col justify-center rounded-3xl border border-dashed border-[#EE775F]/30 bg-[#EE775F]/[0.04] p-7">
            <p className="text-lg font-semibold text-[#2D2D2D]">
              And your business too.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#7C7A71]">
              If you sell through conversations, Inbound.click works for you.
            </p>
            <Link
              to="/signin"
              className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EE775F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#E45F49]"
            >
              Start free
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function UseCaseCard({
  audience,
  tagline,
  conversation,
}: {
  audience: string
  tagline: string
  conversation: ConversationTurn[]
}) {
  return (
    <article className="flex flex-col rounded-3xl border border-black/[0.06] bg-[#FAFAF8] p-7">
      <h3 className="text-xl font-bold tracking-tight text-[#2D2D2D]">
        {audience}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[#7C7A71]">{tagline}</p>

      <div className="mt-5 space-y-2">
        {conversation.map((turn) => (
          <div
            key={`${audience}-${turn.role}-${turn.text}`}
            className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <span
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${
                turn.role === "user"
                  ? "rounded-br-md bg-[#EE775F] text-white"
                  : "rounded-bl-md bg-white text-[#2D2D2D] shadow-sm"
              }`}
            >
              {turn.text}
            </span>
          </div>
        ))}
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/* How it works                                                               */
/* -------------------------------------------------------------------------- */

function HowItWorksSection() {
  const steps = [
    {
      title: "Create your conversation",
      body: "Set up a few friendly questions that match how you talk to prospects. No design or tech skills needed.",
    },
    {
      title: "Add your Inbound.click link",
      body: "Drop your link into your Instagram, TikTok, or YouTube bio in place of your old menu of links.",
    },
    {
      title: "Receive qualified leads",
      body: "Watch named, qualified leads roll in with their answers attached — ready for you to follow up.",
    },
  ]
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: stable anchor for deep links
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <SectionHeading
        eyebrow="How it works"
        title="From profile visit to qualified lead in three steps."
        description="It takes a few minutes to set up and runs on its own from there."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative rounded-3xl border border-black/[0.06] bg-white p-7"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-[#2D2D2D]"
              style={{
                backgroundColor: ["#EE775F", "#F8C751", "#69D0B2"][index],
              }}
            >
              {index + 1}
            </span>
            <h3 className="mt-5 text-lg font-semibold text-[#2D2D2D]">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#7C7A71]">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Final CTA                                                                  */
/* -------------------------------------------------------------------------- */

function FinalCtaSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[36px] bg-[#2D2D2D] px-6 py-16 text-center sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,rgba(238,119,95,0.35),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-[2.75rem]">
            Stop sending prospects to a menu. Start sending them into a
            conversation.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70">
            Turn every social profile into a lead generation channel.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signin"
              className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#2D2D2D] transition-transform hover:-translate-y-0.5"
            >
              Start free
            </Link>
            <a
              href="#demo"
              className="rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              See demo
            </a>
          </div>
          <p className="mt-5 text-sm text-white/50">
            No credit card required · Set up in minutes
          </p>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Shared bits                                                                */
/* -------------------------------------------------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string
  title: string
  description?: string
  align?: "center" | "left"
}) {
  const alignment =
    align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl text-left"
  return (
    <div className={alignment}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#EE775F]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#2D2D2D] sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-[#7C7A71]">
          {description}
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function IconBase({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function IconMagnet() {
  return (
    <IconBase>
      <path d="M6 3v8a6 6 0 0 0 12 0V3" />
      <path d="M3 3h6M15 3h6M3 11h6" />
    </IconBase>
  )
}

function IconFilter() {
  return (
    <IconBase>
      <path d="M3 5h18l-7 8v6l-4-2v-4z" />
    </IconBase>
  )
}

function IconBolt() {
  return (
    <IconBase>
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
    </IconBase>
  )
}

function IconCalendar() {
  return (
    <IconBase>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4M9 14l2 2 4-4" />
    </IconBase>
  )
}

function IconShield() {
  return (
    <IconBase>
      <path d="M12 3l8 3v6c0 4.5-3 7.5-8 9-5-1.5-8-4.5-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </IconBase>
  )
}

function IconBell() {
  return (
    <IconBase>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </IconBase>
  )
}
