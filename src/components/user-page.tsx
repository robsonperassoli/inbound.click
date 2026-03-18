import { useEffect } from "react"
import { getRelativeLuminance } from "@/lib/colors"
import { loadFont } from "@/lib/load-font"
import type { SocialPlatform } from "@/lib/social-links"
import { getUserPageFontClassName } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Button } from "./user-page/button"
import { SocialLink } from "./user-page/social-link"

export type UserPageProfile = {
  title: string
  bio: string
  avatarUrl: string | null
  backgroundImageUrl: string | null
  backgroundColor: string
  fontFamily: string
  textColor: string
  buttonShape: "square" | "rounded" | "pill"
  buttonStyle: "solid" | "outline" | "paper" | "shadow" | "3d" | "ghost"
  buttonColor: string
  buttonTextColor: string
}

export type UserPageLink = {
  _id: string
  type: "url" | "form" | "social"
  title: string
  url?: string
  formId?: string
  platform?: SocialPlatform
}

export function UserPage({
  profile,
  links,
  className,
  onFormLinkClick,
}: {
  profile: UserPageProfile
  links: UserPageLink[]
  className?: string
  onFormLinkClick: (link: UserPageLink) => void
}) {
  useEffect(() => {
    if (profile.fontFamily) {
      loadFont(profile.fontFamily)
    }
  }, [profile.fontFamily])

  const socialLinks = links.filter((link) => link.type === "social")
  const buttonLinks = links.filter((link) => link.type !== "social")
  const luminance = getRelativeLuminance(profile.backgroundColor)
  const isDarkCard = luminance < 0.2
  const isLightCard = luminance > 0.75
  const overlayColor = isDarkCard
    ? "rgb(255 255 255 / 0.22)"
    : isLightCard
      ? "rgb(15 23 42 / 0.18)"
      : "rgb(17 24 39 / 0.4)"
  const overlayGradient = isDarkCard
    ? "linear-gradient(180deg, rgb(255 255 255 / 0.18), rgb(255 255 255 / 0.32))"
    : isLightCard
      ? "linear-gradient(180deg, rgb(15 23 42 / 0.08), rgb(15 23 42 / 0.2))"
      : "linear-gradient(180deg, rgb(17 24 39 / 0.28), rgb(17 24 39 / 0.5))"
  const fontClassName = getUserPageFontClassName(profile.fontFamily)

  return (
    <div
      className={cn(
        "relative flex @container/user-page bg-up-background text-up-foreground",
        fontClassName,
        className,
      )}
      style={
        {
          "--up-background": profile.backgroundColor,
          "--up-foreground": profile.textColor,
          "--up-button-background": profile.buttonColor,
          "--up-button-foreground": profile.buttonTextColor,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: overlayGradient,
          backgroundColor: overlayColor,
          backgroundPosition: "center top",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div
        className={cn(
          "relative z-0 mx-auto flex-1 max-w-xl bg-up-background",
          "py-8 @xl/user-page:py-16 px-4 @xl/user-page:px-8",
          "@xl/user-page:shadow-2xl @xl/user-page:mt-8 @xl/user-page:rounded-t-[3rem]",
        )}
        style={{
          backgroundImage: profile.backgroundImageUrl
            ? `url(${profile.backgroundImageUrl})`
            : undefined,
          backgroundPosition: "center top",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          boxShadow: isDarkCard
            ? "0 28px 80px rgb(0 0 0 / 0.45)"
            : isLightCard
              ? "0 28px 80px rgb(15 23 42 / 0.08)"
              : "0 28px 80px rgb(15 23 42 / 0.14)",
        }}
      >
        <header className="space-y-4">
          {profile.avatarUrl && (
            <Avatar className="size-24 mx-auto block shadow-lg">
              <AvatarImage src={profile.avatarUrl} />
            </Avatar>
          )}

          <div className="space-y-1 text-center @md/user-page:space-y-1.5">
            <h1 className="text-xl @md/user-page:text-2xl font-semibold">
              {profile.title}
            </h1>
            {profile.bio && (
              <p className="text-sm @md/user-page:text-base">{profile.bio}</p>
            )}
          </div>
        </header>

        <ul className="flex flex-col justify-center gap-y-3 @md/user-page:gap-y-5 mt-6 @md/user-page:mt-8 max-w-sm mx-auto">
          {buttonLinks.map((link) => (
            <li key={link._id} className="min-w-0 flex">
              <Button
                {...(link.type === "url"
                  ? { href: link.url }
                  : { onClick: () => onFormLinkClick(link) })}
                shape={profile.buttonShape}
                buttonStyle={profile.buttonStyle}
                className="truncate text-ellipsis"
              >
                {link.title}
              </Button>
            </li>
          ))}
        </ul>

        {socialLinks.length > 0 && (
          <ul className="flex justify-center mt-6">
            {socialLinks.map((l) => (
              <li key={l._id}>
                <SocialLink link={l} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
