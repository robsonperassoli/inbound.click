import type { Doc } from "@convex/_generated/dataModel"
import { useEffect } from "react"
import { loadFont } from "@/lib/load-font"
import { createUpThemeStyles } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Button } from "./user-page/button"

export function UserPage({
  profile,
  links,
  className,
}: {
  profile: Doc<"profiles"> & {
    avatarUrl: string | null
  }
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
      className={cn("up-theme py-10 px-8 flex", className)}
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
        <header className="space-y-5">
          {profile.avatarUrl && (
            <Avatar className="size-20 mx-auto block shadow-lg">
              <AvatarImage src={profile.avatarUrl} />
            </Avatar>
          )}

          <div className="text-center space-y-1.5">
            <h1 className="text-3xl font-semibold">{profile.title}</h1>
            <p className="text-base">{profile.bio}</p>
          </div>
        </header>

        <ul className="flex flex-col justify-center gap-y-5 mt-8 max-w-md mx-auto">
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
