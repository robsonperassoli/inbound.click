import { useEffect, useId, useRef, useState } from "react"

export type ConversationTurn = {
  role: "bot" | "user"
  text: string
}

type ConversationDemoProps = {
  /** Name shown in the chat header (e.g. the business handle). */
  handle: string
  /** Short status label under the handle. */
  status?: string
  /** Scripted conversation that plays out automatically. */
  script: ConversationTurn[]
  /** Summary shown once the conversation completes. */
  lead?: {
    name?: string
    fields: { label: string; value: string }[]
  }
  /** Replay the conversation on a loop. Defaults to true. */
  loop?: boolean
  /** Visual accent. Defaults to blue. */
  className?: string
}

const TYPING_MS = 900
const USER_DELAY_MS = 700
const POST_BOT_DELAY_MS = 650
const HOLD_BEFORE_LOOP_MS = 4200

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return reduced
}

export function ConversationDemo({
  handle,
  status = "Typically replies instantly",
  script,
  lead,
  loop = true,
  className,
}: ConversationDemoProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [visible, setVisible] = useState(reducedMotion ? script.length : 0)
  const [typing, setTyping] = useState(false)
  const [showLead, setShowLead] = useState(reducedMotion)
  const scrollRef = useRef<HTMLDivElement>(null)
  const headingId = useId()

  useEffect(() => {
    if (reducedMotion) {
      setVisible(script.length)
      setShowLead(Boolean(lead))
      return
    }

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(() => {
        if (!cancelled) fn()
      }, delay)
      timers.push(id)
    }

    const run = (index: number) => {
      if (cancelled) return

      if (index >= script.length) {
        if (lead) schedule(() => setShowLead(true), 450)
        if (loop) {
          schedule(() => {
            setShowLead(false)
            setVisible(0)
            run(0)
          }, HOLD_BEFORE_LOOP_MS)
        }
        return
      }

      const turn = script[index]
      if (turn.role === "bot") {
        setTyping(true)
        schedule(() => {
          setTyping(false)
          setVisible(index + 1)
          schedule(() => run(index + 1), POST_BOT_DELAY_MS)
        }, TYPING_MS)
      } else {
        schedule(() => {
          setVisible(index + 1)
          schedule(() => run(index + 1), POST_BOT_DELAY_MS)
        }, USER_DELAY_MS)
      }
    }

    // Small initial delay so the entrance feels intentional.
    schedule(() => run(0), 500)

    return () => {
      cancelled = true
      for (const id of timers) clearTimeout(id)
    }
  }, [script, lead, loop, reducedMotion])

  // Keep the latest message in view as new content appears.
  // biome-ignore lint/correctness/useExhaustiveDependencies: deps drive the scroll-to-bottom side effect
  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [visible, typing, showLead])

  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_30px_60px_-24px_rgba(45,45,45,0.28)] ${className ?? ""}`}
      aria-labelledby={headingId}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-black/[0.05] bg-[#FAFAF8] px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EE775F] text-sm font-semibold text-white">
          {handle
            .replace(/[^a-zA-Z]/g, "")
            .slice(0, 2)
            .toUpperCase() || "IC"}
        </div>
        <div className="min-w-0">
          <p
            id={headingId}
            className="truncate text-sm font-semibold text-[#2D2D2D]"
          >
            {handle}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-[#7C7A71]">
            <span className="inline-block h-2 w-2 rounded-full bg-[#69D0B2]" />
            {status}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex h-[360px] flex-col gap-3 overflow-y-auto px-5 py-5 sm:h-[400px]"
      >
        {script.slice(0, visible).map((turn, index) => (
          <ChatBubble
            key={`${turn.role}-${index}-${turn.text}`}
            role={turn.role}
          >
            {turn.text}
          </ChatBubble>
        ))}

        {typing && <TypingBubble />}

        {showLead && lead && <LeadCard lead={lead} />}
      </div>
    </section>
  )
}

function ChatBubble({
  role,
  children,
}: {
  role: "bot" | "user"
  children: React.ReactNode
}) {
  const isUser = role === "user"
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`ic-msg-in max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-md bg-[#EE775F] text-white"
            : "rounded-bl-md bg-[#F1F1ED] text-[#2D2D2D]"
        }`}
      >
        {children}
      </div>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="ic-msg-in flex items-center gap-1 rounded-2xl rounded-bl-md bg-[#F1F1ED] px-4 py-3.5">
        <span className="ic-typing-dot h-2 w-2 rounded-full bg-[#9CA3AF]" />
        <span
          className="ic-typing-dot h-2 w-2 rounded-full bg-[#9CA3AF]"
          style={{ animationDelay: "0.15s" }}
        />
        <span
          className="ic-typing-dot h-2 w-2 rounded-full bg-[#9CA3AF]"
          style={{ animationDelay: "0.3s" }}
        />
      </div>
    </div>
  )
}

function LeadCard({
  lead,
}: {
  lead: NonNullable<ConversationDemoProps["lead"]>
}) {
  return (
    <div className="ic-pop-in mt-1 rounded-2xl border border-[#69D0B2]/40 bg-[#69D0B2]/[0.12] p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#69D0B2] text-white">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path
              d="M5 10.5 8.5 14 15 6.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="text-sm font-semibold text-[#15765A]">
          Qualified lead captured
        </p>
      </div>
      <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {lead.name && (
          <div className="sm:col-span-2">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-[#8B897F]">
              Name
            </dt>
            <dd className="text-sm font-semibold text-[#2D2D2D]">
              {lead.name}
            </dd>
          </div>
        )}
        {lead.fields.map((field) => (
          <div key={field.label}>
            <dt className="text-[11px] font-medium uppercase tracking-wide text-[#8B897F]">
              {field.label}
            </dt>
            <dd className="text-sm font-semibold text-[#2D2D2D]">
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
