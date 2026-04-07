import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server"
import { authKit } from "../auth"

export async function getAuthenticatedUser(
  ctx: QueryCtx | ActionCtx | MutationCtx,
) {
  return await authKit.getAuthUser(ctx)
}

export async function getAuthUser(ctx: QueryCtx) {
  const authKitUser = await getAuthenticatedUser(ctx)

  if (!authKitUser) {
    throw new Error("Not authenticated")
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_auth", (q) => q.eq("authId", authKitUser.id))
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
