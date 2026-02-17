import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const themeFields = {
  theme: v.string(),
  backgroundColor: v.string(),
  backgroundImage: v.optional(v.string()),
  fontFamily: v.string(),
  textColor: v.string(),
  buttonShape: v.union(v.literal("square"), v.literal("rounded"), v.literal("pill")),
  buttonStyle: v.union(v.literal("solid"), v.literal("outline"), v.literal("paper"), v.literal("shadow"), v.literal("3d"), v.literal("ghost")),
  buttonColor: v.string(),
  buttonTextColor: v.string(),
};

export const formField = v.object({
  id: v.string(),
  type: v.union(
    v.literal('shortText'),
    v.literal('longText'),
    v.literal('email'),
    v.literal('phoneNumber'),
    v.literal('number'),
    v.literal('select'),
    v.literal('checkbox'),
    v.literal('date'),
    v.literal('dateTime'),
  ),
  label: v.string(),
  required: v.boolean(),
  options: v.optional(v.array(v.string())),
})

export default defineSchema({
  ...authTables,

  profiles: defineTable({
    userId: v.id("users"),
    username: v.string(),
    title: v.string(),
    bio: v.string(),
    avatarUrl: v.optional(v.string()),
    ...themeFields
  })
    .index("by_user", ["userId"])
    .index("by_username", ["username"]),

  links: defineTable({
    userId: v.id("users"),
    profileId: v.id("profiles"),
    title: v.string(),
    url: v.string(),
    order: v.number(),
    active: v.boolean(),
  }).index("by_profile", ["profileId"])
    .index("by_user", ["userId"]),

  chats: defineTable({
    title: v.string(),
    model: v.string(),
    systemPrompt: v.string(),
    createdAt: v.number(),
    updatedAt: v.number()
  }),

  chatMessages: defineTable({
    chatId: v.id("chats"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
    status: v.union(v.literal("pending"), v.literal("complete"), v.literal("streaming"), v.literal("error")),
    createdAt: v.number(),
  }).index("by_chat", ["chatId"]),

  forms: defineTable({
    userId: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
    title: v.string(),
    description: v.optional(v.string()),
    fields: v.array(formField),
    publishedAt: v.optional(v.number()),
  })
  .index("by_user", ["userId"]),

  formSubmissions : defineTable({
    userId: v.id('users'),
    formId: v.id('forms'),
    values: v.record(
      v.string(),
      v.union(
        v.string(),
        v.number(),
        v.array(v.string()),
        v.boolean()
      ),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  formSubmissionChatSessions: defineTable({
    chatId: v.id('chats'),
    formId: v.id('forms'),
    userId: v.id('users'),
    formSubmissionId: v.optional(v.id('formSubmissions')),
    createdAt: v.number(),
    updatedAt: v.number(),
    finishedAt: v.optional(v.number()),
  })
  .index('by_form', ['formId'])

});
