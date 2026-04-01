import { getUserDetails } from "../auth"
import { userQuery } from "../custom"

export const listMembers = userQuery({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db
      .query("accountMembers")
      .withIndex("by_account", (q) => q.eq("accountId", ctx.account._id))
      .collect()

    const membersWithUsers = await Promise.all(
      members.map(async (member) => {
        const userDetails = await getUserDetails(ctx, member.userId)

        return {
          userId: member.userId,
          email: userDetails.email,
          name: userDetails.name,
          role: member.role,
          profiles: member.profiles,
          joinedAt: member.joinedAt,
        }
      }),
    )

    return membersWithUsers.sort((a, b) => a.joinedAt - b.joinedAt)
  },
})

export const listInvitations = userQuery({
  args: {},
  handler: async (ctx) => {
    const allInvitations = await ctx.db
      .query("invitations")
      .withIndex("by_account", (q) => q.eq("accountId", ctx.account._id))
      .collect()

    const invitations = allInvitations.filter((i) => i.status === "pending")

    const invitationsWithInviter = await Promise.all(
      invitations.map(async (invitation) => {
        const inviterDetails = await getUserDetails(
          ctx,
          invitation.invitedByUserId,
        )

        return {
          invitationId: invitation._id,
          email: invitation.email,
          role: invitation.role,
          profiles: invitation.profiles,
          expiresAt: invitation.expiresAt,
          invitedByName: inviterDetails.name,
        }
      }),
    )

    return invitationsWithInviter.sort((a, b) => b.expiresAt - a.expiresAt)
  },
})
