import { v } from "convex/values"
import { internal } from "./_generated/api"
import { userAction } from "./custom"
import { checkProfileOwnership } from "./profiles/domain"
import { getAuthenticatedUser } from "./users/domain"

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
  handler: async (ctx, { profileId, ...args }) => {
    const authUser = await getAuthenticatedUser(ctx)
    const profile = await ctx.runQuery(
      internal.profiles.queries.getProfileByIdInternal,
      {
        profileId,
      },
    )

    checkProfileOwnership(profile, ctx.account._id)

    await ctx.runMutation(internal.emails.sendSupportEmail, {
      ...args,
      requesterName: [authUser?.firstName ?? "", authUser?.lastName ?? ""]
        .join(" ")
        .trim(),
      requesterUserId: ctx.user._id,
      requesterUsername: profile?.username ?? undefined,
    })

    return { email: args.email }
  },
})
