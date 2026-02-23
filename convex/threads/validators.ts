import { v } from "convex/values"

const commonThreadFields = {
  userId: v.id("users"),
  title: v.string(),
  model: v.string(),
  systemPrompt: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
}

export const threadsFields = v.union(
  v.object({
    type: v.literal("formSubmission"),
    formSubmissionId: v.optional(v.id("formSubmissions")),
    formId: v.id("forms"),
    ...commonThreadFields,
  }),
  v.object({
    type: v.literal("formBuilder"),
    formId: v.optional(v.id("forms")),
    ...commonThreadFields,
  }),
)
