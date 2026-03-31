import { api } from "@convex/_generated/api"
import { useQuery } from "convex/react"
import { useSelectedProfileId } from "@/stores/profiles"

export function useSelectedProfile() {
  const profileId = useSelectedProfileId()
  const profileData = useQuery(
    api.profiles.queries.getProfileWithLinks,
    profileId
      ? {
          profileId,
        }
      : "skip",
  )

  return profileData ?? null
}
