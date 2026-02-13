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
});
