import Markdown from "react-markdown"
import { cn } from "@/lib/utils"

export function ChatMessageContent({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <div className={cn("prose-sm", className)}>
      <Markdown>{children}</Markdown>
    </div>
  )
}
