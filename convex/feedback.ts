import { v } from "convex/values"
import { api, internal } from "./_generated/api"
import type { Id } from "./_generated/dataModel"
import { userAction } from "./custom"

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
  },
  handler: async (ctx, args) => {
    const [authUser, profile] = await Promise.all([
      ctx.runQuery(api.auth.getCurrentUser, {}),
      ctx.runQuery(api.profiles.queries.getProfile, {
        profileId: "" as Id<"profiles">, //TODO: change this
      }),
    ])

    await ctx.runMutation(internal.emails.sendFeedbackEmail, {
      ...args,
      requesterName: authUser?.name,
      requesterUserId: ctx.user._id,
      requesterUsername: profile?.username ?? undefined,
    })

    return { email: args.email }
  },
})
