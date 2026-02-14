import type { Doc } from "@convex/_generated/dataModel"
import { useEffect } from "react"
import { loadFont } from "@/lib/load-font"
import { createUpThemeStyles } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { Button } from "./user-page/button"

export function UserPage({
  profile,
  links,
  className,
}: {
  profile: Doc<"profiles">
  links: Doc<"links">[]
  className?: string
}) {
  useEffect(() => {
    if (profile.fontFamily) {
      loadFont(profile.fontFamily)
    }
  }, [profile.fontFamily])

  return (
    <div
      className={cn("up-theme p-6 flex", className)}
      style={createUpThemeStyles({
        backgroundColor: profile.backgroundColor,
        fontFamily: profile.fontFamily,
        textColor: profile.textColor,
        buttonShape: profile.buttonShape,
        buttonStyle: profile.buttonStyle,
        buttonColor: profile.buttonColor,
        buttonTextColor: profile.buttonTextColor,
      })}
    >
      <div className="max-w-2xl mx-auto flex-1">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">{profile.title}</h1>
          <p className="text-base">{profile.bio}</p>
        </header>

        <ul className="flex flex-col justify-center gap-y-4 mt-8">
          {links.map((link) => (
            <li key={link._id}>
              <Button
                href={link.url}
                target="_blank"
                shape={profile.buttonShape}
                buttonStyle={profile.buttonStyle}
              >
                {link.title}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
