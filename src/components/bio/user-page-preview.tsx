import { api } from "@convex/_generated/api"
import { useQuery } from "convex/react"
import { UserPage } from "../user-page"

export function UserPagePreview() {
  const data = useQuery(api.profiles.queries.getProfileWithLinks, {})

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
