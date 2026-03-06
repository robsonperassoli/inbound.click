import { v } from "convex/values"
import { api, internal } from "./_generated/api"
import { userAction } from "./custom"

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
  },
  handler: async (ctx, args) => {
    const [authUser, profile] = await Promise.all([
      ctx.runQuery(api.auth.getCurrentUser, {}),
      ctx.runQuery(api.profiles.queries.getProfile, {}),
    ])

    await ctx.runMutation(internal.emails.sendSupportEmail, {
      ...args,
      requesterName: authUser?.name,
      requesterUserId: ctx.user._id,
      requesterUsername: profile?.username ?? undefined,
    })

    return { email: args.email }
  },
})
