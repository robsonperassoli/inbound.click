import { v } from "convex/values"
import { internal } from "../_generated/api"
import { mutation } from "../_generated/server"
import * as auth from "../auth"
import { userMutation } from "../custom"
import * as forms from "../forms/domain"
import { themeFields } from "../schema"
import { getFirstName } from "../utils/names"
import * as domain from "./domain"

export const createProfile = userMutation({
  args: {
    username: v.string(),
    title: v.string(),
    bio: v.string(),
    avatarId: v.optional(v.id("_storage")),
    ...themeFields,
    links: v.array(
      v.object({
        url: v.string(),
        title: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const normalizedUsername = domain.assertValidProfileUsername(args.username)

    const userId = ctx.user._id

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique()

    if (profile) {
      throw new Error("Profile already exists for user")
    }

    await domain.checkProfileUsernameAvailable(ctx, normalizedUsername)

    const profileId = await ctx.db.insert("profiles", {
      userId,
      title: args.title,
      username: normalizedUsername,
      bio: args.bio,
      avatarId: args.avatarId,
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
    const formId = await forms.createBasicLeadForm(ctx, userId)

    await ctx.db.insert("links", {
      userId: ctx.user._id,
      profileId,
      active: true,
      type: "url",
      title: "Get In Touch",
      formId,
      order: 0,
    })

    for (let i = 0; i < args.links.length; i++) {
      const link = args.links[i]
      await ctx.db.insert("links", {
        userId: ctx.user._id,
        profileId,
        active: true,
        type: "url",
        title: link.title,
        url: link.url,
        order: i + 1,
      })
    }

    if (identity?.email) {
      const tenMinutes = 10 * 60 * 1000

      await ctx.scheduler.runAfter(
        tenMinutes,
        internal.emails.sendActivationEmail,
        {
          to: identity.email,
          firstName: identity?.name ? getFirstName(identity.name) : args.title,
          username: args.username,
        },
      )
    }

    return profileId
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
    const normalizedUsername = domain.assertValidProfileUsername(args.username)

    const profile = await domain.getUserProfile(ctx, userId, args.profileId)

    await domain.checkProfileUsernameAvailable(
      ctx,
      normalizedUsername,
      profile._id,
    )

    await ctx.db.patch(profile._id, {
      username: normalizedUsername,
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
