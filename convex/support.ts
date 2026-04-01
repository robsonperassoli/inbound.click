import { v } from "convex/values"
import { internal } from "./_generated/api"
import { authComponent } from "./auth"
import { userAction } from "./custom"
import { checkProfileOwnership } from "./profiles/domain"

export const submit = userAction({
  args: {
    email: v.string(),
    subject: v.string(),
    category: v.union(
      v.literal("bio"),
      v.literal("forms"),
      v.literal("billing"),
      v.literal("account"),
      v.literal("bug"),
      v.literal("other"),
    ),
    message: v.string(),
    routeContext: v.optional(v.string()),
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

    await ctx.runMutation(internal.emails.sendSupportEmail, {
      ...args,
      requesterName: authUser?.name,
      requesterUserId: ctx.user._id,
      requesterUsername: profile?.username ?? undefined,
    })

    return { email: args.email }
  },
})
