import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { UserPage } from "../user-page"

export function UserPagePreview({ profileId }: { profileId: Id<"profiles"> }) {
  const data = useQuery(api.profiles.queries.getProfileWithLinks, { profileId })

  if (!data) {
    return null
  }

  return (
    <UserPage
      profile={data.profile}
      links={data.links}
      onFormLinkClick={() => {}}
      className="h-full"
    />
  )
}
