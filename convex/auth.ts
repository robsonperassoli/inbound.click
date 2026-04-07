import { AuthKit } from "@convex-dev/workos-authkit"
import { v } from "convex/values"
import { components, internal } from "./_generated/api"
import type { DataModel, Doc, Id } from "./_generated/dataModel"
import {
  type ActionCtx,
  internalQuery,
  type MutationCtx,
  type QueryCtx,
  query,
} from "./_generated/server"
import { getUserActiveSubscription } from "./stripe/domain"
import { getAuthenticatedUser, getAuthUser, getUserScope } from "./users/domain"

export const authKit = new AuthKit<DataModel>(components.workOSAuthKit)

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getAuthenticatedUser(ctx)
  },
})

export const getSession = query({
  args: {},
  handler: async (ctx) => {
    const [authUser, scope] = await Promise.all([
      getAuthenticatedUser(ctx),
      getUserScope(ctx),
    ])
    const subscription = await getUserActiveSubscription(ctx, scope.user._id)

    return {
      _id: scope.user._id,
      name: [authUser?.firstName ?? "", authUser?.lastName ?? ""]
        .join(" ")
        .trim(),
      email: authUser!.email,
      image: authUser!.profilePictureUrl,
      username: "",
      phoneNumber: "",
      accountType: scope.account.type,
      subscribed: Boolean(subscription),
      subscriptionPriceId: subscription?.priceId,
    }
  },
})

export const getCurrentUserInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx)
    return user
  },
})

export const getCurrentScopeInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const scope = await getUserScope(ctx)
    return scope
  },
})

export const getUserByIdInternal = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get("users", userId)
  },
})

export const authenticatedUser = async (
  ctx: MutationCtx | ActionCtx | QueryCtx,
) => {
  const user: Doc<"users"> = await ctx.runQuery(
    internal.auth.getCurrentUserInternal,
  )

  return user?._id
}

export const getUserDetails = async (
  ctx: MutationCtx | ActionCtx | QueryCtx,
  userId: Id<"users">,
) => {
  const user = await ctx.runQuery(internal.auth.getUserByIdInternal, { userId })
  if (!user) {
    throw new Error("User not found")
  }

  //const u = await authKit.getAuthUser(ctx)

  const authUser = null // TODO: fix it: await authComponent.getAnyUserById(ctx, user.authId!)

  if (!authUser) {
    throw new Error("Auth User not found")
  }

  return {
    name: "",
    email: "",
  }
}
