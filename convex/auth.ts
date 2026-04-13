import { type AuthFunctions, AuthKit } from "@convex-dev/workos-authkit"
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
import { getAccountActiveSubscription } from "./stripe/domain"
import { getAuthenticatedUser, getAuthUser, getUserScope } from "./users/domain"

const authFunctions: AuthFunctions = internal.auth

type WorkOSUserData = {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  profilePictureUrl?: string | null
}

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const getUserName = ({ email, firstName, lastName }: WorkOSUserData) => {
  const name = [firstName ?? "", lastName ?? ""].join(" ").trim()
  return name || normalizeEmail(email)
}

const getUserPatch = (user: WorkOSUserData) => ({
  authId: user.id,
  email: normalizeEmail(user.email),
  name: getUserName(user),
  profilePictureUrl: user.profilePictureUrl ?? undefined,
})

async function findUserByEmail(ctx: MutationCtx, email: string) {
  const normalizedEmail = normalizeEmail(email)
  const users = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
    .take(2)

  if (users.length > 1) {
    throw new Error(`Multiple app users found for email ${normalizedEmail}`)
  }

  return users[0] ?? null
}

async function ensureIndividualAccount(ctx: MutationCtx, userId: Id<"users">) {
  const membership = await ctx.db
    .query("accountMembers")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique()

  if (membership) {
    return membership.accountId
  }

  const accountId = await ctx.db.insert("accounts", {
    type: "individual",
  })

  await ctx.db.insert("accountMembers", {
    accountId,
    userId,
    role: "owner",
    profiles: ["all"],
    joinedAt: Date.now(),
  })

  return accountId
}

export const authKit = new AuthKit<DataModel>(components.workOSAuthKit, {
  authFunctions,
})

export const { backfillUsers } = authKit.utils()

export const { authKitEvent } = authKit.events({
  "user.created": async (ctx, event) => {
    const existingByAuthId = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", event.data.id))
      .unique()

    if (existingByAuthId) {
      await ctx.db.patch(existingByAuthId._id, getUserPatch(event.data))
      await ensureIndividualAccount(ctx, existingByAuthId._id)
      return
    }

    const existingByEmail = await findUserByEmail(ctx, event.data.email)
    if (existingByEmail) {
      if (existingByEmail.authId && existingByEmail.authId !== event.data.id) {
        throw new Error(
          `App user ${existingByEmail._id} is already linked to auth user ${existingByEmail.authId}`,
        )
      }

      await ctx.db.patch(existingByEmail._id, getUserPatch(event.data))
      await ensureIndividualAccount(ctx, existingByEmail._id)
      return
    }

    const userId = await ctx.db.insert("users", getUserPatch(event.data))
    await ensureIndividualAccount(ctx, userId)
  },
  "user.updated": async (ctx, event) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", event.data.id))
      .unique()

    if (!user) {
      console.warn(`App user not found for WorkOS user ${event.data.id}`)
      return
    }

    await ctx.db.patch(user._id, getUserPatch(event.data))
    await ensureIndividualAccount(ctx, user._id)
  },
})

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
    const subscription = await getAccountActiveSubscription(
      ctx,
      scope.account._id,
    )

    return {
      _id: scope.user._id,
      name:
        scope.user.name ??
        [authUser?.firstName ?? "", authUser?.lastName ?? ""].join(" ").trim(),
      email: scope.user.email ?? authUser?.email ?? "",
      image:
        scope.user.profilePictureUrl ?? authUser?.profilePictureUrl ?? null,
      accountType: scope.account.type,
      subscribed: Boolean(subscription),
      subscriptionPriceId: subscription?.priceId,
      role: scope.role,
      isSuperUser: scope.isSuperUser,
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
): Promise<{ name: string; email: string }> => {
  const user: Doc<"users"> | null = await ctx.runQuery(
    internal.auth.getUserByIdInternal,
    { userId },
  )
  if (!user) {
    throw new Error("User not found")
  }

  return {
    name: user.name ?? user.email ?? "",
    email: user.email ?? "",
  }
}
