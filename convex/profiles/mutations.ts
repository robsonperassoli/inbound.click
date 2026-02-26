import { v } from "convex/values"
import { mutation } from "../_generated/server"
import * as auth from "../auth"
import { themeFields } from "../schema"
import * as domain from "./domain"

export const createProfile = mutation({
  args: {
    username: v.string(),
    title: v.string(),
    bio: v.string(),
    ...themeFields,
  },
  handler: async (ctx, args) => {
    const userId = await auth.authenticatedUser(ctx)

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique()

    if (profile) {
      throw new Error("Profile already exists for user")
    }

    await domain.checkProfileUsernameAvailable(ctx, args.username)

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
    const userId = await auth.authenticatedUser(ctx)
    const profile = await domain.getUserProfile(ctx, userId, args.profileId)

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
    const userId = await auth.authenticatedUser(ctx)

    const profile = await domain.getUserProfile(ctx, userId, args.profileId)

    await domain.checkProfileUsernameAvailable(ctx, args.username, profile._id)

    await ctx.db.patch(profile._id, {
      username: args.username,
      title: args.title,
      bio: args.bio,
    })
  },
})

export const updateProfileAvatar = mutation({
  args: {
    profileId: v.id("profiles"),
    avatarId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.authenticatedUser(ctx)
    const profile = await domain.getUserProfile(ctx, userId, args.profileId)

    await ctx.db.patch(profile._id, {
      avatarId: args.avatarId,
    })
  },
})
