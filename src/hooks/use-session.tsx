import { api } from "@convex/_generated/api"
import { useQuery } from "convex/react"

export function useSession() {
  const session = useQuery(api.auth.getSession)

  return session
}
