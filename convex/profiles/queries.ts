import { v } from "convex/values"
import type { Id } from "../_generated/dataModel"
import { internalQuery } from "../_generated/server"
import { userQuery } from "../custom"
import * as links from "../links/domain"
import {
  checkProfileOwnership,
  getAccountProfiles,
  getAccountProfilesByIds,
  getOnboardingProfileDraftData,
  getProfileById,
  isProfileUsernameAvailable,
} from "./domain"

export const getProfile = userQuery({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, _args) => {
    const profile = await getProfileById(ctx, _args.profileId)

    checkProfileOwnership(profile, ctx.account._id)

    return profile
  },
})

export const getAvailableProfiles = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    if (ctx.profiles[0] === "all") {
      return await getAccountProfiles(ctx, ctx.account._id)
    }

    return await getAccountProfilesByIds(
      ctx,
      ctx.account._id,
      ctx.profiles as Array<Id<"profiles">>,
    )
  },
})

export const getProfileByIdInternal = internalQuery({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, { profileId }) => {
    return await getProfileById(ctx, profileId)
  },
})

export const getProfileWithLinks = userQuery({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, _args) => {
    const profile = await getProfileById(ctx, _args.profileId)

    checkProfileOwnership(profile, ctx.account._id)

    return {
      profile,
      links: await links.getProfileLinks(ctx, profile._id),
    }
  },
})

export const isUsernameAvailable = userQuery({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    return await isProfileUsernameAvailable(ctx, args.username)
  },
})

export const getOnboardingProfileDraft = userQuery({
  args: {},
  handler: async (ctx) => {
    return await getOnboardingProfileDraftData(ctx, {
      accountId: ctx.account._id,
      userName: ctx.user.name,
      userEmail: ctx.user.email,
    })
  },
})
