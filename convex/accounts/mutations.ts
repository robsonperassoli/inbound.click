import { v } from "convex/values"
import type { Id } from "../_generated/dataModel"
import type { MutationCtx } from "../_generated/server"
import { getUserDetails } from "../auth"
import { teamAdminMutation, userMutation } from "../custom"
import { sendInvitationEmail } from "../emails"
import { generateInvitationToken, getInvitationByToken } from "./domain"
import { memberRole } from "./validators"

const INVITATION_EXPIRY_DAYS = 7
const INVITATION_EXPIRY_MS = INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
const profilePermissionsValidator = v.array(
  v.union(v.literal("all"), v.id("profiles")),
)

type MemberPermissions = Array<"all" | Id<"profiles">>

async function normalizeMemberPermissions(
  ctx: { db: MutationCtx["db"]; account: { _id: Id<"accounts"> } },
  role: "owner" | "admin" | "member",
  profiles: MemberPermissions,
): Promise<MemberPermissions> {
  if (role !== "member") {
    return ["all"]
  }

  if (profiles.length === 1 && profiles[0] === "all") {
    return ["all"]
  }

  if (profiles.length === 0 || profiles.includes("all")) {
    throw new Error("Choose all pages or at least one selected page")
  }

  const uniqueProfileIds = [...new Set(profiles)] as Array<Id<"profiles">>
  const accountProfiles = await ctx.db
    .query("profiles")
    .withIndex("by_account", (q) => q.eq("accountId", ctx.account._id))
    .collect()
  const accountProfileIds = new Set(
    accountProfiles.map((profile) => profile._id),
  )

  for (const profileId of uniqueProfileIds) {
    if (!accountProfileIds.has(profileId)) {
      throw new Error("One or more selected pages do not belong to this team")
    }
  }

  return uniqueProfileIds
}

export const createInvitation = teamAdminMutation({
  args: {
    email: v.string(),
    role: memberRole,
    profiles: profilePermissionsValidator,
  },
  handler: async (ctx, args) => {
    const existingInvitation = await ctx.db
      .query("invitations")
      .withIndex("by_account", (q) => q.eq("accountId", ctx.account._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("email"), args.email.toLowerCase()),
          q.eq(q.field("status"), "pending"),
        ),
      )
      .first()

    if (existingInvitation) {
      throw new Error("An invitation is already pending for this email")
    }

    const token = generateInvitationToken()
    const expiresAt = Date.now() + INVITATION_EXPIRY_MS
    const normalizedProfiles = await normalizeMemberPermissions(
      ctx,
      args.role,
      args.profiles,
    )

    const invitationId = await ctx.db.insert("invitations", {
      accountId: ctx.account._id,
      token,
      email: args.email.toLowerCase(),
      role: args.role,
      profiles: normalizedProfiles,
      status: "pending",
      expiresAt,
      invitedByUserId: ctx.user._id,
    })

    const inviter = await getUserDetails(ctx, ctx.user._id)

    await sendInvitationEmail(ctx, {
      to: args.email.toLowerCase(),
      inviterName: inviter.name,
      role: args.role,
      token,
    })

    return { invitationId, token, expiresAt }
  },
})

export const resendInvitation = teamAdminMutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get("invitations", args.invitationId)

    if (!invitation) {
      throw new Error("Invitation not found")
    }

    if (invitation.accountId !== ctx.account._id) {
      throw new Error("Invitation does not belong to your account")
    }

    if (invitation.status !== "pending") {
      throw new Error("Can only resend pending invitations")
    }

    await ctx.db.patch("invitations", args.invitationId, {
      status: "revoked",
      revokedAt: Date.now(),
    })

    const token = generateInvitationToken()
    const expiresAt = Date.now() + INVITATION_EXPIRY_MS

    const newInvitationId = await ctx.db.insert("invitations", {
      accountId: ctx.account._id,
      token,
      email: invitation.email,
      role: invitation.role,
      profiles: invitation.profiles,
      status: "pending",
      expiresAt,
      invitedByUserId: ctx.user._id,
    })

    const inviter = await getUserDetails(ctx, ctx.user._id)

    await sendInvitationEmail(ctx, {
      to: invitation.email,
      inviterName: inviter.name,
      role: invitation.role,
      token,
    })

    return { invitationId: newInvitationId, token, expiresAt }
  },
})

export const revokeInvitation = teamAdminMutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get("invitations", args.invitationId)

    if (!invitation) {
      throw new Error("Invitation not found")
    }

    if (invitation.accountId !== ctx.account._id) {
      throw new Error("Invitation does not belong to your account")
    }

    if (invitation.status !== "pending") {
      throw new Error("Can only revoke pending invitations")
    }

    await ctx.db.patch("invitations", args.invitationId, {
      status: "revoked",
      revokedAt: Date.now(),
    })

    return { success: true }
  },
})

export const updateMemberPermissions = teamAdminMutation({
  args: {
    membershipId: v.id("accountMembers"),
    profiles: profilePermissionsValidator,
  },
  handler: async (ctx, args) => {
    const membership = await ctx.db.get("accountMembers", args.membershipId)

    if (!membership) {
      throw new Error("Member not found")
    }

    if (membership.accountId !== ctx.account._id) {
      throw new Error("Member does not belong to your account")
    }

    if (membership.role !== "member") {
      throw new Error("Only members can have restricted page permissions")
    }

    const normalizedProfiles = await normalizeMemberPermissions(
      ctx,
      membership.role,
      args.profiles,
    )

    await ctx.db.patch(args.membershipId, {
      profiles: normalizedProfiles,
    })

    return { success: true }
  },
})

export const acceptInvitation = userMutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await getInvitationByToken(ctx, args.token)

    if (!invitation) {
      throw new Error("Invitation not found")
    }

    if (invitation.status !== "pending") {
      throw new Error(
        invitation.status === "accepted"
          ? "Invitation already accepted"
          : "Invitation is no longer available",
      )
    }

    if (invitation.expiresAt < Date.now()) {
      throw new Error("Invitation has expired")
    }

    const memberships = await ctx.db
      .query("accountMembers")
      .withIndex("by_user", (q) => q.eq("userId", ctx.user._id))
      .collect()

    for (const membership of memberships) {
      await ctx.db.delete(membership._id)
    }

    await ctx.db.insert("accountMembers", {
      accountId: invitation.accountId,
      userId: ctx.user._id,
      role: invitation.role,
      profiles: invitation.profiles,
      joinedAt: Date.now(),
    })

    await ctx.db.patch(invitation._id, {
      status: "accepted",
      acceptedByUserId: ctx.user._id,
      acceptedAt: Date.now(),
    })

    return { success: true }
  },
})
