export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "facebook"
  | "linkedin"
  | "youtube"

export type SocialHandles = Record<SocialPlatform, string>

type SocialConfig = {
  title: string
  prefix: string
}

export const socialConfig: Record<SocialPlatform, SocialConfig> = {
  instagram: { title: "Instagram", prefix: "instagram.com/" },
  tiktok: { title: "TikTok", prefix: "tiktok.com/@" },
  facebook: { title: "Facebook", prefix: "facebook.com/" },
  linkedin: { title: "LinkedIn", prefix: "linkedin.com/in/" },
  youtube: { title: "YouTube", prefix: "youtube.com/@" },
}

const socialPlatforms: SocialPlatform[] = [
  "instagram",
  "tiktok",
  "facebook",
  "linkedin",
  "youtube",
]

const sanitizeRawInput = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return ""
  }

  const withProtocol =
    /^https?:\/\//i.test(trimmed) || !trimmed.includes(".")
      ? trimmed
      : `https://${trimmed}`

  try {
    const parsed = new URL(withProtocol)
    return decodeURIComponent(parsed.pathname)
  } catch {
    return trimmed
  }
}

export const normalizeSocialHandle = (
  platform: SocialPlatform,
  value: string,
) => {
  const sanitized = sanitizeRawInput(value)
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .split(/[?#]/)[0]

  if (!sanitized) {
    return ""
  }

  const segments = sanitized
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)

  let handle = segments[0] ?? ""

  if (platform === "linkedin") {
    if (segments[0]?.toLowerCase() === "in" && segments[1]) {
      handle = segments[1]
    } else {
      handle = handle.replace(/^in\//i, "")
    }
  }

  handle = handle.replace(/^@+/, "").trim()

  return handle
}

export const buildSocialUrl = (platform: SocialPlatform, handle: string) => {
  const normalized = normalizeSocialHandle(platform, handle)
  if (!normalized) {
    return null
  }

  if (platform === "tiktok" || platform === "youtube") {
    return `https://${platform}.com/@${normalized}`
  }

  if (platform === "linkedin") {
    return `https://linkedin.com/in/${normalized}`
  }

  return `https://${platform}.com/${normalized}`
}

export const buildSocialLinks = (handles: SocialHandles) => {
  return socialPlatforms
    .map((platform) => {
      const url = buildSocialUrl(platform, handles[platform])
      if (!url) {
        return null
      }

      return {
        title: socialConfig[platform].title,
        url,
      }
    })
    .filter((link): link is { title: string; url: string } => Boolean(link))
}
