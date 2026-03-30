import { v } from "convex/values"

export const formField = v.object({
  id: v.string(),
  type: v.union(
    v.literal("shortText"),
    v.literal("longText"),
    v.literal("email"),
    v.literal("phoneNumber"),
    v.literal("number"),
    v.literal("select"),
    v.literal("checkbox"),
    v.literal("date"),
    v.literal("dateTime"),
  ),
  label: v.string(),
  required: v.boolean(),
  options: v.optional(v.array(v.string())),
})

export const formSubmissionValue = v.union(
  v.string(),
  v.number(),
  v.array(v.string()),
  v.boolean(),
)
