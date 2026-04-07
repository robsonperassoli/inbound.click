import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { memberRole } from "./accounts/validators"
import { formField, formSubmissionValue } from "./forms/validators"
import { platformField, typeField } from "./links/validators"
import { themeFields } from "./profiles/validators"
import { threadsFields } from "./threads/validators"

export default defineSchema({
  accounts: defineTable({
    type: v.union(v.literal("team"), v.literal("individual")),
  }),

  accountMembers: defineTable({
    accountId: v.id("accounts"),
    userId: v.id("users"),
    role: memberRole,
    profiles: v.array(v.union(v.literal("all"), v.id("profiles"))),
    joinedAt: v.number(),
  })
    .index("by_account", ["accountId"])
    .index("by_user", ["userId"]),

  invitations: defineTable({
    accountId: v.id("accounts"),
    token: v.string(),
    email: v.string(),
    role: memberRole,
    profiles: v.array(v.union(v.literal("all"), v.id("profiles"))),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("revoked"),
    ),
    expiresAt: v.number(),
    acceptedByUserId: v.optional(v.id("users")),
    acceptedAt: v.optional(v.number()),
    invitedByUserId: v.id("users"),
    revokedAt: v.optional(v.number()),
  })
    .index("by_account", ["accountId"])
    .index("by_token", ["token"]),

  users: defineTable({
    authId: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
  })
    .index("by_auth", ["authId"])
    .index("by_email", ["email"]),

  profiles: defineTable({
    accountId: v.optional(v.id("accounts")),
    userId: v.id("users"),
    username: v.string(),
    title: v.string(),
    bio: v.string(),
    avatarId: v.optional(v.id("_storage")),
    publishedAt: v.optional(v.number()),
    ...themeFields,
  })
    .index("by_user", ["userId"])
    .index("by_username", ["username"])
    .index("by_account", ["accountId"]),

  links: defineTable({
    userId: v.id("users"),
    profileId: v.id("profiles"),
    title: v.string(),
    order: v.number(),
    active: v.boolean(),
    type: v.union(typeField),
    formId: v.optional(v.id("forms")),
    url: v.optional(v.string()),
    platform: v.optional(platformField),
  })
    .index("by_profile", ["profileId"])
    .index("by_user", ["userId"]),

  threads: defineTable(threadsFields)
    .index("by_type_and_session_ended", ["type", "sessionEndedAt"])
    .index("by_form_submission", ["formSubmissionId"]),

  messages: defineTable({
    threadId: v.id("threads"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
    ),
    content: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("complete"),
      v.literal("streaming"),
      v.literal("error"),
    ),
    createdAt: v.number(),
  }).index("by_thread", ["threadId"]),

  forms: defineTable({
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    title: v.string(),
    description: v.optional(v.string()),
    fields: v.array(formField),
    publishedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  formSubmissions: defineTable({
    userId: v.id("users"),
    formId: v.id("forms"),
    values: v.record(v.string(), formSubmissionValue),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_form", ["formId"])
    .index("by_user", ["userId"]),
})
