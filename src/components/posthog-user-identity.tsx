import { api } from "@convex/_generated/api"
import { useQuery } from "convex/react"
import posthog from "posthog-js"
import { useEffect } from "react"

export function PostHogUserIdentify() {
  const user = useQuery(api.auth.getCurrentUser, {})
  useEffect(() => {
    if (!user) return

    posthog.identify(user._id, {
      email: user.email,
      name: user.name,
    })
  }, [user])

  return null
}
