import { v } from "convex/values"

export const platformField = v.union(
  v.literal("instagram"),
  v.literal("tiktok"),
  v.literal("x"),
  v.literal("youtube"),
  v.literal("facebook"),
  v.literal("linkedin"),
)

export const typeField = v.union(
  v.literal("url"),
  v.literal("social"),
  v.literal("form"),
)
