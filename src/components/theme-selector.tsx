import { ChevronDown, PaintBoardIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type Theme, themes } from "@/lib/themes"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export function ThemeSelector({
  onThemeSelected,
}: {
  onThemeSelected: (theme: Theme) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <HugeiconsIcon icon={PaintBoardIcon} size={18} /> Style{" "}
          <HugeiconsIcon icon={ChevronDown} size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex flex-row gap-x-2 w-[90vw] overflow-x-auto"
      >
        {themes.map((theme) => (
          <Button
            key={theme.name}
            variant="ghost"
            size="sm"
            className="w-40"
            onClick={() => onThemeSelected(theme)}
          >
            {theme.name}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
