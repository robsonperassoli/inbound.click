import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import {
  type ActionCtx,
  type MutationCtx,
  mutation,
  type QueryCtx,
  query,
} from "./_generated/server"
import { themeFields } from "./schema"

const getUserProfile = async (
  ctx: QueryCtx,
  userId: Id<"users">,
  profileId: Id<"profiles">,
) => {
  const profile = await ctx.db.get("profiles", profileId)
  if (!profile || profile.userId !== userId) {
    throw new Error("Profile not found")
  }

  return profile
}

const checkProfileUsernameAvailable = async (
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

export const authenticatedUser = async (
  ctx: MutationCtx | QueryCtx | ActionCtx,
) => {
  const userId = await getAuthUserId(ctx)

  if (userId === null) {
    throw new Error("Client is not authenticated!")
  }

  return userId
}

export const getProfile = query({
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx)

    return await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique()
  },
})

export const createProfile = mutation({
  args: {
    username: v.string(),
    title: v.string(),
    bio: v.string(),
    ...themeFields,
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx)

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique()

    if (profile) {
      throw new Error("Profile already exists for user")
    }

    await checkProfileUsernameAvailable(ctx, args.username)

    await ctx.db.insert("profiles", {
      userId,
      title: args.title,
      username: args.username,
      bio: args.bio,
      theme: args.theme,
      backgroundColor: args.backgroundColor,
      backgroundImage: args.backgroundImage,
      fontFamily: args.fontFamily,
      textColor: args.textColor,
      buttonShape: args.buttonShape,
      buttonStyle: args.buttonStyle,
      buttonColor: args.buttonColor,
      buttonTextColor: args.buttonTextColor,
    })
  },
})

export const updateTheme = mutation({
  args: {
    profileId: v.id("profiles"),
    ...themeFields,
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx)
    const profile = await getUserProfile(ctx, userId, args.profileId)

    await ctx.db.patch(profile._id, {
      theme: args.theme,
      backgroundColor: args.backgroundColor,
      backgroundImage: args.backgroundImage,
      fontFamily: args.fontFamily,
      textColor: args.textColor,
      buttonShape: args.buttonShape,
      buttonStyle: args.buttonStyle,
      buttonColor: args.buttonColor,
      buttonTextColor: args.buttonTextColor,
    })
  },
})

export const updateProfileHeader = mutation({
  args: {
    profileId: v.id("profiles"),
    username: v.string(),
    title: v.string(),
    bio: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx)

    const profile = await getUserProfile(ctx, userId, args.profileId)

    await checkProfileUsernameAvailable(ctx, args.username, profile._id)

    await ctx.db.patch(profile._id, {
      username: args.username,
      title: args.title,
      bio: args.bio,
    })
  },
})
