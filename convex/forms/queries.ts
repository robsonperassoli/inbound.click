import { v } from "convex/values"
import { internalQuery, query } from "../_generated/server"
import * as auth from "../auth"
import * as forms from "./domain"

export const getUserForm = query({
  args: {
    formId: v.id("forms"),
  },
  handler: async (ctx, { formId }) => {
    const userId = await auth.authenticatedUser(ctx)
    const form = await forms.getForm(ctx, formId)

    if (form.userId !== userId) {
      throw new Error(`Form not found`)
    }

    return form
  },
})

export const getUserForms = query({
  handler: async (ctx, _args) => {
    const userId = await auth.authenticatedUser(ctx)

    return await forms.getForms(ctx, userId)
  },
})

export const getUserFormSubmissions = query({
  args: {
    formId: v.optional(v.id("forms")),
  },
  handler: async (ctx, { formId }) => {
    const userId = await auth.authenticatedUser(ctx)

    return await forms.getFormSubmissions(ctx, userId, formId)
  },
})

export const getUserFormsInternal = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await forms.getForms(ctx, args.userId)
  },
})
