import type { Doc } from "@convex/_generated/dataModel"
import { Button } from "./ui/button"

export function UserPage({
  profile,
  links,
  mode = "view",
  onAddLinkClicked,
}: {
  mode?: "edit" | "view"
  profile: Doc<"profiles">
  links: Doc<"links">[]
  onAddLinkClicked?: () => void
}) {
  return (
    <div>
      <h1>{profile.title}</h1>
      <p>{profile.bio}</p>
      <ul>
        {links.map((link) => (
          <li key={link._id}>
            <a href={link.url} target="_blank">
              {link.title}
            </a>
          </li>
        ))}
        {mode === "edit" && (
          <Button
            variant="secondary"
            onClick={() => (onAddLinkClicked ? onAddLinkClicked() : undefined)}
          >
            Add Link
          </Button>
        )}
      </ul>
    </div>
  )
}
