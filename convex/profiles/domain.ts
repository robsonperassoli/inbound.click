import type { Id } from "../_generated/dataModel"
import type { QueryCtx } from "../_generated/server"

export const getUserProfile = async (
  ctx: QueryCtx,
  userId: Id<"user">,
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
  userId: Id<"user">,
) => {
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique()

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
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_username", (q) => q.eq("username", username))
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
