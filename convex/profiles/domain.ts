import { type Infer, v } from "convex/values"
import type { Id } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"
import { themeFields } from "../schema"

const profileUsernameRegex = /^[a-zA-Z0-9_-]+$/

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

export const getProfileForUserId = async (
  ctx: QueryCtx,
  userId: Id<"users">,
) => {
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique()

  return profile
    ? {
        ...profile,
        avatarUrl: profile?.avatarId
          ? await ctx.storage.getUrl(profile.avatarId)
          : null,
        backgroundImageUrl: profile?.backgroundImage
          ? await ctx.storage.getUrl(profile.backgroundImage)
          : null,
      }
    : null
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
  ctx: QueryCtx,
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

const themeFieldsObject = v.object(themeFields)
type Theme = Infer<typeof themeFieldsObject>

export async function patchProfileTheme(
  ctx: MutationCtx,
  profileId: Id<"profiles">,
  theme: Theme,
) {
  return await ctx.db.patch(profileId, theme)
}
