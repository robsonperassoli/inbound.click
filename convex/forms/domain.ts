import type { Infer } from "convex/values"
import type { Id } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"
import type { formField } from "../schema"

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
  ctx: MutationCtx | QueryCtx,
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
    createdAt: Date.now(),
    updatedAt: Date.now(),
    values: {},
  })
}

export async function createEmptyForm(
  ctx: MutationCtx,
  userId: Id<"users">,
  title: string,
  description?: string,
) {
  return await ctx.db.insert("forms", {
    userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    title,
    description,
    fields: [],
  })
}

export async function updateForm(
  ctx: MutationCtx,
  formId: Id<"forms">,
  title: string,
  fields: Infer<typeof formField>[],
  description?: string,
) {
  return await ctx.db.patch("forms", formId, {
    updatedAt: Date.now(),
    title: title,
    description: description,
    fields: fields,
  })
}
