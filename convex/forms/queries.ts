import { v } from "convex/values"
import { internalQuery, query } from "../_generated/server"
import * as auth from "../auth"
import { userQuery } from "../custom"
import * as threads from "../threads/queries"
import * as forms from "./domain"

export const getUserForm = userQuery({
  args: {
    formId: v.id("forms"),
  },
  handler: async (ctx, { formId }) => {
    const form = await forms.getForm(ctx, formId)

    if (form.userId !== ctx.user._id) {
      throw new Error(`Form not found`)
    }

    return form
  },
})

export const getUserForms = userQuery({
  handler: async (ctx, _args) => {
    return await forms.getForms(ctx, ctx.user._id)
  },
})

export const getUserFormSubmissions = userQuery({
  args: {
    formId: v.optional(v.id("forms")),
  },
  handler: async (ctx, { formId }) => {
    return await forms.getFormSubmissions(ctx, ctx.user._id, formId)
  },
})

export const getUserFormsInternal = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await forms.getForms(ctx, args.userId)
  },
})
