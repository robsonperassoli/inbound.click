import { type Infer, v } from "convex/values"
import type { Doc, Id } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"
import { getFirstName } from "../utils/names"
import { themeFields } from "./validators"

const profileUsernameRegex = /^[a-zA-Z0-9_-]+$/
const usernameSourceRegex = /[^a-z0-9_-]+/g
const usernameBoundaryRegex = /^[-_]+|[-_]+$/g
const repeatedSeparatorRegex = /[-_]{2,}/g

export const assertValidProfileUsername = (username: string) => {
  const normalizedUsername = username.trim()

  if (normalizedUsername.length < 3 || normalizedUsername.length > 30) {
    throw new Error("Username must be between 3 and 30 characters")
  }

  if (!profileUsernameRegex.test(normalizedUsername)) {
    throw new Error("Username can only contain letters, numbers, _ and -")
  }

  return normalizedUsername
}

export const getUserProfile = async (
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  profileId: Id<"profiles">,
) => {
  const profile = await ctx.db.get("profiles", profileId)
  if (!profile || profile.userId !== userId) {
    throw new Error("Profile not found")
  }

  return profile
}

export const getProfileByUsername = async (ctx: QueryCtx, username: string) => {
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_username", (q) => q.eq("username", username))
    .unique()

  if (!profile) {
    throw new Error("Profile not found")
  }

  return {
    ...profile,
    avatarUrl: profile?.avatarId
      ? await ctx.storage.getUrl(profile.avatarId)
      : null,
    backgroundImageUrl: profile?.backgroundImage
      ? await ctx.storage.getUrl(profile.backgroundImage)
      : null,
  }
}

export const getProfileById = async (
  ctx: QueryCtx,
  profileId: Id<"profiles">,
) => {
  const profile = await ctx.db.get("profiles", profileId)

  if (!profile) {
    throw new Error("Profile not found")
  }

  return {
    ...profile,
    avatarUrl: profile?.avatarId
      ? await ctx.storage.getUrl(profile.avatarId)
      : null,
    backgroundImageUrl: profile?.backgroundImage
      ? await ctx.storage.getUrl(profile.backgroundImage)
      : null,
  }
}

export const checkProfileUsernameAvailable = async (
  ctx: QueryCtx,
  username: string,
  excludeProfileId?: Id<"profiles">,
) => {
  const normalizedUsername = assertValidProfileUsername(username)

  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_username", (q) => q.eq("username", normalizedUsername))
    .unique()

  if (!profile) {
    return
  }

  if (excludeProfileId && profile._id === excludeProfileId) {
    return
  } else {
    throw new Error("Username already taken")
  }
}

export const isProfileUsernameAvailable = async (
  ctx: QueryCtx | MutationCtx,
  username: string,
) => {
  const normalizedUsername = username.trim()
  if (
    normalizedUsername.length < 3 ||
    normalizedUsername.length > 30 ||
    !profileUsernameRegex.test(normalizedUsername)
  ) {
    return false
  }

  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_username", (q) => q.eq("username", normalizedUsername))
    .unique()

  return !profile
}

function getEmailHandle(email?: string) {
  return email?.split("@")[0]?.trim() ?? ""
}

function formatTitleFromHandle(handle: string) {
  const words = handle
    .replace(/[._-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) {
    return "My Page"
  }

  return words
    .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
    .join(" ")
}

function normalizeUsernameSeed(value: string) {
  const normalized = value
    .normalize("NFKD")
    .split("")
    .filter((char) => char.charCodeAt(0) <= 0x7f)
    .join("")
    .trim()
    .toLowerCase()
    .replace(usernameSourceRegex, "-")
    .replace(repeatedSeparatorRegex, "-")
    .replace(usernameBoundaryRegex, "")
    .slice(0, 30)

  if (normalized.length >= 3) {
    return normalized
  }

  if (normalized.length > 0) {
    return `${normalized}${"page".slice(0, 3 - normalized.length)}`
  }

  return "page"
}

export async function getAvailableUsernameSuggestion(
  ctx: QueryCtx | MutationCtx,
  sources: string[],
) {
  const candidates = new Set(
    sources.map(normalizeUsernameSeed).filter((value) => value.length >= 3),
  )

  if (candidates.size === 0) {
    candidates.add("page")
  }

  for (const candidate of candidates) {
    const available = await isProfileUsernameAvailable(ctx, candidate)
    if (available) {
      return candidate
    }

    for (let suffix = 1; suffix <= 100; suffix++) {
      const suffixText = `-${suffix}`
      const suffixedCandidate = `${candidate.slice(0, 30 - suffixText.length)}${suffixText}`

      if (await isProfileUsernameAvailable(ctx, suffixedCandidate)) {
        return suffixedCandidate
      }
    }
  }

  throw new Error("Could not generate an available username")
}

export async function getOnboardingProfileDraftData(
  ctx: QueryCtx,
  {
    accountId,
    userName,
    userEmail,
  }: {
    accountId: Id<"accounts">
    userName?: string
    userEmail?: string
  },
) {
  const existingProfiles = await ctx.db
    .query("profiles")
    .withIndex("by_account", (q) => q.eq("accountId", accountId))
    .take(1)

  const emailHandle = getEmailHandle(userEmail)
  const defaultTitle = userName?.trim() || formatTitleFromHandle(emailHandle)

  return {
    hasExistingProfiles: existingProfiles.length > 0,
    greetingName: getFirstName(defaultTitle) || "there",
    draft: {
      title: defaultTitle,
      username: await getAvailableUsernameSuggestion(ctx, [
        emailHandle,
        userName?.trim() ?? "",
        defaultTitle,
        "page",
      ]),
      bio: "",
    },
  }
}

const themeFieldsObject = v.object(themeFields)
type Theme = Infer<typeof themeFieldsObject>

export async function patchProfileTheme(
  ctx: MutationCtx,
  profileId: Id<"profiles">,
  theme: Theme,
) {
  return await ctx.db.patch(profileId, theme)
}

export async function publishProfile(
  ctx: MutationCtx,
  profileId: Id<"profiles">,
) {
  return await ctx.db.patch(profileId, { publishedAt: Date.now() })
}

export const checkProfileOwnership = async (
  profile: Doc<"profiles">,
  accountId: Id<"accounts">,
) => {
  if (profile.accountId !== accountId) {
    throw new Error("Profile not found")
  }
}

export const getAccountProfiles = async (
  ctx: QueryCtx | MutationCtx,
  accountId: Id<"accounts">,
) => {
  return await ctx.db
    .query("profiles")
    .withIndex("by_account", (q) => q.eq("accountId", accountId))
    .collect()
}

export const getAccountProfilesByIds = async (
  ctx: QueryCtx | MutationCtx,
  accountId: Id<"accounts">,
  profileIds: Array<Id<"profiles">>,
) => {
  const profiles = await getAccountProfiles(ctx, accountId)

  return profiles.filter((profile) => profileIds.includes(profile._id))
}
