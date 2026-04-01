import type { Id } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"

export function generateInvitationToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}

export async function getAccountMembers(
  ctx: QueryCtx,
  accountId: Id<"accounts">,
) {
  return await ctx.db
    .query("accountMembers")
    .withIndex("by_account", (q) => q.eq("accountId", accountId))
    .collect()
}

export async function getAccountInvitations(
  ctx: QueryCtx,
  accountId: Id<"accounts">,
) {
  return await ctx.db
    .query("invitations")
    .withIndex("by_account", (q) => q.eq("accountId", accountId))
    .collect()
}

export async function getInvitationByToken(ctx: MutationCtx, token: string) {
  const invitation = await ctx.db
    .query("invitations")
    .filter((q) => q.eq(q.field("token"), token))
    .first()

  return invitation
}
