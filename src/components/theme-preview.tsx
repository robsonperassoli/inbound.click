import type { Theme } from "@/lib/themes"
import { cn } from "@/lib/utils"

export function ThemePreview({
  theme,
  selected,
  onClick,
}: {
  theme: Theme
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      key={theme.name}
      className={cn(
        "overflow-hidden rounded-lg border text-left transition",
        "hover:border-primary/70 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        selected
          ? "border-primary border-2 ring-4 ring-primary/35 shadow-md"
          : "border-border",
      )}
      style={{ backgroundColor: theme.backgroundColor }}
      onClick={onClick}
    >
      <div className="min-h-56 space-y-1 px-6 pt-6 pb-8">
        <header className="space-y-2 pt-1">
          <div
            className="mx-auto h-4 w-36 rounded-full"
            style={{ backgroundColor: `${theme.textColor}33` }}
          />
          <div
            className="mx-auto h-3 w-28 rounded-full"
            style={{ backgroundColor: `${theme.textColor}26` }}
          />
        </header>

        <div className="mt-5 space-y-2.5">
          {["one", "two", "three"].map((item) => (
            <div
              key={item}
              className={cn(
                "h-10 w-full border",
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
