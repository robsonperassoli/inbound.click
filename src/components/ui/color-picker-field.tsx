import * as React from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type ColorPickerFieldProps = {
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

function normalizeHex(value: string) {
  const trimmed = value.trim()
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`
  const normalized = withHash.toLowerCase()

  if (/^#[0-9a-f]{3}$/.test(normalized)) {
    const [r, g, b] = normalized.slice(1)
    return `#${r}${r}${g}${g}${b}${b}`
  }

  if (/^#[0-9a-f]{6}$/.test(normalized)) {
    return normalized
  }

  return null
}

export function ColorPickerField({
  value,
  onChange,
  className,
  disabled,
}: ColorPickerFieldProps) {
  const [draft, setDraft] = React.useState(value)

  React.useEffect(() => {
    setDraft(value)
  }, [value])

  const handleDraftCommit = () => {
    const normalized = normalizeHex(draft)
    if (!normalized) {
      setDraft(value)
      return
    }

    if (normalized !== value) {
      onChange(normalized)
    } else {
      setDraft(normalized)
    }
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <label
        className={cn(
          "group relative inline-flex h-10 w-16 overflow-hidden rounded-2xl border border-border bg-input/30 shadow-xs transition-colors",
          "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span
          className="absolute inset-0 bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%,#e5e7eb_100%),linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%,#e5e7eb_100%)] bg-[length:12px_12px] bg-[position:0_0,6px_6px]"
          aria-hidden="true"
        />
        <span
          className="absolute inset-0 transition-transform group-hover:scale-[1.03]"
          style={{ backgroundColor: value }}
          aria-hidden="true"
        />
        <input
          type="color"
          value={normalizeHex(value) ?? "#000000"}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          aria-label="Pick color"
        />
      </label>

      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleDraftCommit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            handleDraftCommit()
          }
        }}
        disabled={disabled}
        className="h-10 rounded-2xl font-mono uppercase tracking-wide"
        aria-label="Hex color value"
      />
    </div>
  )
}
