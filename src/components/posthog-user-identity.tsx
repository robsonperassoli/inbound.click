import posthog from "posthog-js"
import { useEffect } from "react"
import { useSession } from "@/hooks/use-session"

export function PostHogUserIdentify() {
  const session = useSession()
  useEffect(() => {
    if (!session) return

    posthog.identify(session._id, {
      email: session.email,
      name: session.name,
    })
  }, [session])

  return null
}
