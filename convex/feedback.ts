import { v } from "convex/values"
import { internal } from "./_generated/api"
import { authComponent } from "./auth"
import { userAction } from "./custom"
import { checkProfileOwnership } from "./profiles/domain"

export const submit = userAction({
  args: {
    email: v.string(),
    type: v.union(v.literal("feature"), v.literal("bug")),
    title: v.string(),
    area: v.union(
      v.literal("bio"),
      v.literal("forms"),
      v.literal("analytics"),
      v.literal("billing"),
      v.literal("onboarding"),
      v.literal("account"),
      v.literal("other"),
    ),
    summary: v.string(),
    requestedChange: v.optional(v.string()),
    impact: v.optional(v.string()),
    expectedBehavior: v.optional(v.string()),
    reproSteps: v.optional(v.string()),
    currentPath: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    submittedAt: v.string(),
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx)
    const profile = await ctx.runQuery(
      internal.profiles.queries.getProfileByIdInternal,
      {
        profileId: args.profileId,
      },
    )

    checkProfileOwnership(profile, ctx.account._id)

    await ctx.runMutation(internal.emails.sendFeedbackEmail, {
      ...args,
      requesterName: authUser?.name,
      requesterUserId: ctx.user._id,
      requesterUsername: profile?.username ?? undefined,
    })

    return { email: args.email }
  },
})
