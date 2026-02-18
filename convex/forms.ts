import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import {
  internalMutation,
  type MutationCtx,
  mutation,
  type QueryCtx,
  query,
} from "./_generated/server"
import { authenticatedUser } from "./profiles"
import { getSession } from "./public"
import { formField, formSubmissionValue } from "./schema"

export async function getForm(
  ctx: MutationCtx | QueryCtx,
  formId: Id<"forms">,
) {
  const form = await ctx.db.get(formId)
  if (!form) {
    throw new Error(`Form not found`)
  }

  return form
}

export async function getForms(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db
    .query("forms")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect()
}

export async function getFormSubmission(
  ctx: MutationCtx,
  formSubmissionId: Id<"formSubmissions">,
) {
  const formSubmission = await ctx.db.get(formSubmissionId)
  if (!formSubmission) {
    throw new Error(`Form submission not found`)
  }

  return formSubmission
}

export async function getFormSubmissions(
  ctx: QueryCtx,
  userId: Id<"users">,
  formId?: Id<"forms">,
) {
  let query = ctx.db
    .query("formSubmissions")
    .withIndex("by_user", (q) => q.eq("userId", userId))

  if (formId) {
    query = query.filter((q) => q.eq(q.field("formId"), formId))
  }

  return await query.collect()
}

export async function createFormSubmission(
  ctx: MutationCtx,
  userId: Id<"users">,
  formId: Id<"forms">,
) {
  return await ctx.db.insert("formSubmissions", {
    formId,
    userId,
    createdAt: new Date().getUTCDate(),
    updatedAt: new Date().getUTCDate(),
    values: {},
  })
}

export const createForm = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    fields: v.array(formField),
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx)

    const formId = await ctx.db.insert("forms", {
      userId,
      createdAt: new Date().getUTCDate(),
      updatedAt: new Date().getUTCDate(),
      title: args.title,
      description: args.description,
      fields: args.fields,
    })

    return formId
  },
})

export const getUserFormSubmissions = query({
  args: {
    formId: v.optional(v.id("forms")),
  },
  handler: async (ctx, { formId }) => {
    const userId = await authenticatedUser(ctx)

    return await getFormSubmissions(ctx, userId, formId)
  },
})

export const getUserForms = query({
  handler: async (ctx, _args) => {
    const userId = await authenticatedUser(ctx)

    return await getForms(ctx, userId)
  },
})

export const getUserForm = query({
  args: {
    formId: v.id("forms"),
  },
  handler: async (ctx, { formId }) => {
    const userId = await authenticatedUser(ctx)
    const form = await getForm(ctx, formId)

    if (form.userId !== userId) {
      throw new Error(`Form not found`)
    }

    return form
  },
})

export const fillForm = internalMutation({
  args: {
    formSubmissionChatSessionId: v.id("formSubmissionChatSessions"),
    values: v.record(v.string(), formSubmissionValue),
  },
  handler: async (ctx, args) => {
    const session = await getSession(ctx, args.formSubmissionChatSessionId)

    let formSubmissionId = session.formSubmissionId
    if (!formSubmissionId) {
      formSubmissionId = await createFormSubmission(
        ctx,
        session.userId,
        session.formId,
      )

      ctx.db.patch("formSubmissionChatSessions", session._id, {
        formSubmissionId,
      })
    }

    ctx.db.patch("formSubmissions", formSubmissionId, {
      values: args.values,
      updatedAt: new Date().getUTCDate(),
    })

    return formSubmissionId
  },
})
