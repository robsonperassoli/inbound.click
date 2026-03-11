import type { Doc } from "@convex/_generated/dataModel"
import { useSortable } from "@dnd-kit/react/sortable"
import { HugeiconsIcon } from "@hugeicons/react"
import { type ReactNode, type Ref, useMemo, useRef, useState } from "react"
import { socialConfig } from "@/lib/social-links"
import { cn } from "@/lib/utils"

export function SortableSocialLinkItem({
  index,
  link,
}: {
  index: number
  link: Doc<"links">
}) {
  const [element, setElement] = useState<Element | null>(null)
  const handleRef = useRef<HTMLButtonElement | null>(null)
  const { isDragging } = useSortable({
    id: link._id,
    index,
    element,
    handle: handleRef,
  })

  return (
    <SocialLinkItem
      sortable
      link={link}
      handleRef={handleRef}
      setElement={setElement}
      isDragging={isDragging}
    />
  )
}

export function SocialLinkItem({
  link,
  actions,
  sortable,
  handleRef,
  setElement,
  isDragging,
}: {
  link: Doc<"links">
  actions?: ReactNode
  setElement?: (element: Element | null) => void
  handleRef?: Ref<HTMLButtonElement>
  sortable?: boolean
  isDragging?: boolean
}) {
  const platformConfig = useMemo(() => socialConfig[link.platform!], [link])

  return (
    <li
      ref={setElement}
      key={link._id}
      className={cn(
        "bg-background size-16 border border-border/60 rounded-lg p-3 relative hover:bg-accent hover:shadow-md transition-all duration-200",
      )}
    >
      <HugeiconsIcon icon={platformConfig.icon} className="w-full h-full" />

      <div className="absolute -top-2 -right-2">{!sortable && actions}</div>
    </li>
  )
}
