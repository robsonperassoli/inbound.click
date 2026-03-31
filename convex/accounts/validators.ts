import { v } from "convex/values"

export const memberRole = v.union(
  v.literal("owner"),
  v.literal("admin"),
  v.literal("member"),
)
