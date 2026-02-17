import { internalMutation, mutation, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { authenticatedUser } from "./profiles";
import { formField, formSubmissionValue } from "./schema";
import { Id } from "./_generated/dataModel";
import { getSession } from "./public";

export async function getForm(ctx: MutationCtx, formId: Id<'forms'>) {
  const form = await ctx.db.get(formId);
  if (!form) {
    throw new Error(`Form not found`);
  }

  return form;
}

export async function getFormSubmission(ctx: MutationCtx, formSubmissionId: Id<'formSubmissions'>) {
  const formSubmission = await ctx.db.get(formSubmissionId);
  if (!formSubmission) {
    throw new Error(`Form submission not found`);
  }

  return formSubmission;
}

export async function createFormSubmission(ctx: MutationCtx, userId: Id<'users'>, formId: Id<'forms'>) {
  return await ctx.db.insert('formSubmissions', {
    formId,
    userId,
    createdAt: new Date().getUTCDate(),
    updatedAt: new Date().getUTCDate(),
    values: {}
  })
}


export const createForm = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    fields: v.array(formField),
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);

    const formId = await ctx.db.insert('forms', {
      userId,
      createdAt: new Date().getUTCDate(),
      updatedAt: new Date().getUTCDate(),
      title: args.title,
      description: args.description,
      fields: args.fields,
    });

    return formId;
  }
});

export const fillForm = internalMutation({
  args: {
    formSubmissionChatSessionId: v.id('formSubmissionChatSessions'),
    values: v.record(v.string(), formSubmissionValue),
  },
  handler: async (ctx, args) => {
    const session = await getSession(ctx, args.formSubmissionChatSessionId);

    let formSubmissionId = session.formSubmissionId
    if (!formSubmissionId) {
      formSubmissionId = await createFormSubmission(ctx, session.userId, session.formId);

      ctx.db.patch('formSubmissionChatSessions', session._id, {
        formSubmissionId,
      })
    }

    ctx.db.patch('formSubmissions', formSubmissionId, {
      values: args.values,
      updatedAt: new Date().getUTCDate()
    })

    return formSubmissionId;
  }
})
