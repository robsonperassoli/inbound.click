import { v } from "convex/values"
import { getUserDetails } from "../auth"
import { teamAdminMutation } from "../custom"
import { sendInvitationEmail } from "../emails"
import { generateInvitationToken } from "./domain"
import { memberRole } from "./validators"

const INVITATION_EXPIRY_DAYS = 7
const INVITATION_EXPIRY_MS = INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000

export const createInvitation = teamAdminMutation({
  args: {
    email: v.string(),
    role: memberRole,
    profiles: v.array(v.union(v.literal("all"), v.id("profiles"))),
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

    const invitationId = await ctx.db.insert("invitations", {
      accountId: ctx.account._id,
      token,
      email: args.email.toLowerCase(),
      role: args.role,
      profiles: args.profiles,
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

    const token = await generateInvitationToken()
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
