import { v } from "convex/values"
import { getUserDetails } from "../auth"
import { teamAdminQuery, userQuery } from "../custom"
import { getAccountProfiles } from "../profiles/domain"
import { getInvitationByTokenForRead } from "./domain"

export const listMembers = teamAdminQuery({
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
          membershipId: member._id,
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

export const listInvitations = teamAdminQuery({
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

export const listManageableProfiles = teamAdminQuery({
  args: {},
  handler: async (ctx) => {
    const profiles = await getAccountProfiles(ctx, ctx.account._id)

    return profiles
      .map((profile) => ({
        _id: profile._id,
        title: profile.title,
        username: profile.username,
      }))
      .sort((a, b) => a.title.localeCompare(b.title))
  },
})

export const getInvitationByToken = userQuery({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await getInvitationByTokenForRead(ctx, args.token)

    if (!invitation) {
      return {
        status: "invalid" as const,
        message: "This invitation link is invalid.",
      }
    }

    if (invitation.status !== "pending") {
      return {
        status: "invalid" as const,
        message:
          invitation.status === "accepted"
            ? "This invitation has already been accepted."
            : "This invitation is no longer available.",
      }
    }

    if (invitation.expiresAt < Date.now()) {
      return {
        status: "invalid" as const,
        message: "This invitation has expired.",
      }
    }

    const inviterDetails = await getUserDetails(ctx, invitation.invitedByUserId)

    return {
      status: "valid" as const,
      email: invitation.email,
      role: invitation.role,
      invitedByName: inviterDetails.name,
    }
  },
})
