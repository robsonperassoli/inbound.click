import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type PageTitleProps = {
  title: ReactNode
  description?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  className?: string
}

export function PageTitle({
  title,
  description,
  meta,
  actions,
  className,
}: PageTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="max-w-xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {meta}
      </div>
      {actions && <div className="w-full sm:w-auto">{actions}</div>}
    </div>
  )
}
