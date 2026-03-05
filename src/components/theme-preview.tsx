import type { Theme } from "@/lib/themes"
import { cn } from "@/lib/utils"

export function ThemePreview({
  theme,
  selected,
  onClick,
  className,
  buttonCount = 3,
  size = "default",
}: {
  theme: Theme
  selected: boolean
  onClick: () => void
  className?: string
  buttonCount?: number
  size?: "default" | "compact"
}) {
  const normalizedButtonCount = Math.max(1, Math.min(4, buttonCount))
  const previewButtonIds = Array.from(
    { length: normalizedButtonCount },
    (_, idx) => `preview-${idx + 1}`,
  )

  return (
    <button
      type="button"
      key={theme.name}
      className={cn(
        "overflow-hidden rounded-lg border text-left transition",
        size === "compact" ? "max-w-48" : "max-w-56",
        "hover:border-primary/70 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        selected
          ? "border-primary border-2 ring-4 ring-primary/35 shadow-md"
          : "border-border",
        className,
      )}
      style={{ backgroundColor: theme.backgroundColor }}
      onClick={onClick}
    >
      <div
        className={cn(
          "space-y-1",
          size === "compact"
            ? "min-h-40 px-4 pt-4 pb-5"
            : "min-h-56 px-6 pt-6 pb-8",
        )}
      >
        <header className="space-y-2 pt-1">
          <div
            className={cn(
              "mx-auto rounded-full w-full",
              size === "compact" ? "h-3.5" : "h-4",
            )}
            style={{ backgroundColor: `${theme.textColor}33` }}
          />
          <div
            className={cn(
              "mx-auto rounded-full",
              size === "compact" ? "h-3 w-20" : "h-3 w-28",
            )}
            style={{ backgroundColor: `${theme.textColor}26` }}
          />
        </header>

        <div
          className={cn(
            size === "compact" ? "mt-3 space-y-2" : "mt-5 space-y-2.5",
          )}
        >
          {previewButtonIds.map((buttonId) => (
            <div
              key={buttonId}
              className={cn(
                "w-full border",
                size === "compact" ? "h-8" : "h-10",
                theme.buttonShape === "pill"
                  ? "rounded-full"
                  : theme.buttonShape === "rounded"
                    ? "rounded-lg"
                    : "rounded-none",
              )}
              style={{
                backgroundColor:
                  theme.buttonStyle === "outline" ||
                  theme.buttonStyle === "ghost"
                    ? "transparent"
                    : theme.buttonColor,
                borderColor:
                  theme.buttonStyle === "ghost"
                    ? "transparent"
                    : theme.buttonColor,
                color:
                  theme.buttonStyle === "outline" ||
                  theme.buttonStyle === "ghost"
                    ? theme.buttonColor
                    : theme.buttonTextColor,
                boxShadow:
                  theme.buttonStyle === "shadow"
                    ? "0 6px 12px rgb(0 0 0 / 0.25)"
                    : theme.buttonStyle === "3d"
                      ? "6px 6px 0px 0px black"
                      : "none",
                transform:
                  theme.buttonStyle === "3d" ? "translateY(-2px)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </button>
  )
}
