import { v } from "convex/values"
import { internal } from "../_generated/api"
import { internalMutation, mutation } from "../_generated/server"
import * as auth from "../auth"
import { userMutation } from "../custom"
import { formSubmissionTranscriptUrl } from "../frontend"
import { formField, formSubmissionValue } from "../schema"
import * as threads from "../threads/domain"
import { getFirstName } from "../utils/names"
import * as forms from "./domain"

export const createForm = userMutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    fields: v.array(formField),
  },
  handler: async (ctx, args) => {
    const formId = await ctx.db.insert("forms", {
      userId: ctx.user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: args.title,
      description: args.description,
      fields: args.fields,
    })

    return formId
  },
})

export const updateFormHeader = mutation({
  args: {
    id: v.id("forms"),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.authenticatedUser(ctx)

    const form = await forms.getForm(ctx, args.id)
    if (form.userId !== userId) {
      throw new Error("Not found")
    }

    await ctx.db.patch("forms", args.id, {
      updatedAt: Date.now(),
      title: args.title,
      description: args.description,
    })
  },
})

export const addFormField = mutation({
  args: {
    formId: v.id("forms"),
    field: formField,
  },
  handler: async (ctx, args) => {
    const userId = await auth.authenticatedUser(ctx)

    const form = await forms.getForm(ctx, args.formId)
    if (form.userId !== userId) {
      throw new Error("Not found")
    }

    await ctx.db.patch("forms", args.formId, {
      updatedAt: Date.now(),
      fields: [...form.fields, args.field],
    })
  },
})

export const updateFormField = mutation({
  args: {
    formId: v.id("forms"),
    field: formField,
  },
  handler: async (ctx, args) => {
    const userId = await auth.authenticatedUser(ctx)

    const form = await forms.getForm(ctx, args.formId)
    if (form.userId !== userId) {
      throw new Error("Not found")
    }

    const existingField = form.fields.find((f) => f.id === args.field.id)
    if (!existingField) {
      throw new Error("Form Field not found")
    }

    await ctx.db.patch("forms", args.formId, {
      updatedAt: Date.now(),
      fields: form.fields.map((f) => (f.id === args.field.id ? args.field : f)),
    })
  },
})

export const removeFormField = mutation({
  args: {
    id: v.id("forms"),
    fieldId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.authenticatedUser(ctx)

    const form = await forms.getForm(ctx, args.id)
    if (form.userId !== userId) {
      throw new Error("Not found")
    }

    await ctx.db.patch("forms", args.id, {
      updatedAt: Date.now(),
      fields: form.fields.filter((f) => f.id !== args.fieldId),
    })
  },
})

export const fillForm = internalMutation({
  args: {
    threadId: v.id("threads"),
    values: v.record(v.string(), formSubmissionValue),
  },
  handler: async (ctx, args) => {
    const thread = await threads.getThread(ctx, args.threadId)

    if (thread.type !== "formSubmission") {
      throw new Error("Invalid session type")
    }

    let formSubmissionId = thread.formSubmissionId
    if (!formSubmissionId) {
      formSubmissionId = await forms.createFormSubmission(
        ctx,
        thread.userId,
        thread.formId,
      )

      await threads.setFormSubmissionId(ctx, thread._id, formSubmissionId)

      const userDetails = await auth.getUserDetails(ctx, thread.userId)
      await ctx.scheduler.runAfter(0, internal.emails.sendNewConversation, {
        formSubmissionId: formSubmissionId,
        to: userDetails.email,
        firstName: getFirstName(userDetails.name),
        formSubmissionTranscriptUrl: formSubmissionTranscriptUrl(
          thread.formId,
          formSubmissionId,
        ),
      })
    }

    const formSubmission = await ctx.db.get("formSubmissions", formSubmissionId)

    await ctx.db.patch("formSubmissions", formSubmissionId, {
      values: {
        ...(formSubmission?.values ?? {}),
        ...args.values,
      },
      updatedAt: Date.now(),
    })

    return formSubmissionId
  },
})

export const setSubmissionComplete = internalMutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const thread = await threads.getThread(ctx, args.threadId)

    if (thread.type !== "formSubmission") {
      throw new Error("Invalid session type")
    }

    if (!thread.formSubmissionId) {
      throw new Error("Submission not found for thread")
    }

    await ctx.db.patch("formSubmissions", thread.formSubmissionId, {
      completedAt: Date.now(),
      updatedAt: Date.now(),
    })

    await ctx.db.patch("threads", thread._id, {
      sessionEndedAt: Date.now(),
      updatedAt: Date.now(),
    })

    const userDetails = await auth.getUserDetails(ctx, thread.userId)

    await ctx.scheduler.runAfter(0, internal.emails.sendChatCompleted, {
      formSubmissionId: thread.formSubmissionId,
      to: userDetails.email,
      conversationStatus: "finished",
      firstName: getFirstName(userDetails.name),
      formSubmissionTranscriptUrl: formSubmissionTranscriptUrl(
        thread.formId,
        thread.formSubmissionId,
      ),
    })
  },
})
