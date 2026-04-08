import { v } from "convex/values"
import { internal } from "../_generated/api"
import { internalMutation, mutation } from "../_generated/server"
import * as auth from "../auth"
import { userAction, userMutation } from "../custom"
import * as forms from "../forms/domain"

import * as stripe from "../stripe/domain"
import * as agents from "../threads/agents"
import { getFirstName } from "../utils/names"
import * as domain from "./domain"
import { themeFields } from "./validators"

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
      accountId: ctx.account._id,
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

export const publishProfile = userMutation({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, { profileId }) => {
    const activeSubscription = await stripe.getAccountActiveSubscription(
      ctx,
      ctx.account._id,
    )

    if (!activeSubscription) {
      throw new Error("Cannot publish profile without an active subscription")
    }

    const profile = await domain.getUserProfile(ctx, ctx.user._id, profileId)

    await domain.publishProfile(ctx, profile._id)
  },
})

export const updateTheme = userMutation({
  args: {
    profileId: v.id("profiles"),
    ...themeFields,
  },
  handler: async (ctx, { profileId, ...theme }) => {
    const profile = await domain.getUserProfile(ctx, ctx.user._id, profileId)

    await domain.patchProfileTheme(ctx, profile._id, {
      ...theme,
      backgroundImage: theme.backgroundImage ?? undefined,
    })
  },
})

export const generateTheme = userAction({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, { profileId }) => {
    const profile = await ctx.runQuery(
      internal.profiles.queries.getProfileByIdInternal,
      {
        profileId,
      },
    )

    if (profile.userId !== ctx.user._id) {
      throw new Error("Profile not found")
    }

    const theme = await agents.generateTheme(
      profile.username,
      profile.title,
      profile.bio,
    )

    await ctx.runMutation(internal.profiles.mutations.updateThemeInternal, {
      profileId,
      ...theme,
      backgroundImage: undefined,
    })
  },
})

export const updateThemeInternal = internalMutation({
  args: {
    profileId: v.id("profiles"),
    ...themeFields,
  },
  handler: async (ctx, { profileId, ...theme }) => {
    return await domain.patchProfileTheme(ctx, profileId, {
      ...theme,
      backgroundImage: theme.backgroundImage ?? undefined,
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
