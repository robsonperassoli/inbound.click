import { v } from "convex/values"

export const themeFields = {
  theme: v.string(),
  backgroundColor: v.string(),
  backgroundImage: v.optional(v.id("_storage")),
  fontFamily: v.string(),
  textColor: v.string(),
  buttonShape: v.union(
    v.literal("square"),
    v.literal("rounded"),
    v.literal("pill"),
  ),
  buttonStyle: v.union(
    v.literal("solid"),
    v.literal("outline"),
    v.literal("paper"),
    v.literal("shadow"),
    v.literal("3d"),
    v.literal("ghost"),
  ),
  buttonColor: v.string(),
  buttonTextColor: v.string(),
}
