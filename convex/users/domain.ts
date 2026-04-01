import type { GenericCtx } from "@convex-dev/better-auth"
import type { DataModel } from "../_generated/dataModel"
import type { QueryCtx } from "../_generated/server"
import { authComponent } from "../auth"

export async function getAuthenticatedUser(ctx: GenericCtx<DataModel>) {
  return await authComponent.getAuthUser(ctx)
}

export async function getAuthUser(ctx: QueryCtx) {
  const { _id: authId } = await getAuthenticatedUser(ctx)

  const user = await ctx.db
    .query("users")
    .withIndex("by_auth", (q) => q.eq("authId", authId))
    .unique()

  if (!user) {
    throw new Error("Not authenticated")
  }

  return user
}

export async function getUserScope(ctx: QueryCtx) {
  const user = await getAuthUser(ctx)

  const membership = await ctx.db
    .query("accountMembers")
    .withIndex("by_user", (q) => q.eq("userId", user?._id))
    .unique()

  if (!membership) {
    throw new Error("Not a member of any account")
  }

  const account = await ctx.db.get("accounts", membership.accountId)
  if (!account) {
    throw new Error("Account not found")
  }

  return {
    user,
    account,
    role: membership.role,
    profiles: membership.profiles,
  }
}
