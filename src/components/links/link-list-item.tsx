import type { Doc } from "@convex/_generated/dataModel"
import { DatabaseLightningIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

export function LinkListItem({
  link,
  actions,
}: {
  link: Doc<"links">
  actions?: ReactNode
}) {
  return (
    <li
      key={link._id}
      className="group grid gap-4 border-b border-border/60 px-5 py-4 last:border-b-0 md:grid-cols-[1fr_auto] md:items-center"
    >
      <div className="min-w-0 space-y-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-semibold">{link.title}</span>
          <span
            className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${
              link.active
                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "border-border/60 bg-muted/40 text-muted-foreground"
            }`}
          >
            {link.active ? "Live" : "Hidden"}
          </span>
        </div>

        {link.type === "form" && link.formId ? (
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/forms/$id/submissions"
              params={{ id: link.formId }}
              className="flex gap-x-1 items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <HugeiconsIcon icon={DatabaseLightningIcon} size={12} /> View
              collected data
            </Link>
          </div>
        ) : (
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="block truncate text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.url}
          </a>
        )}
      </div>

      {actions}
    </li>
  )
}
