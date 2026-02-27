import { v } from "convex/values"
import { internal } from "../_generated/api"
import { internalMutation, mutation } from "../_generated/server"
import * as auth from "../auth"
import { userMutation } from "../custom"
import * as forms from "../forms/domain"
import * as links from "../links/domain"
import * as profiles from "../profiles/domain"
import { formField } from "../schema"
import * as threads from "./domain"

export const updateMessageContent = internalMutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch("messages", args.messageId, {
      content: args.content,
      status: "complete",
    })
  },
})

export const createFormBuilderThread = userMutation({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const { threadId, messageId, assistantMessageId } =
      await threads.createFormBuilderThread(ctx, ctx.user._id, args.message)

    await ctx.scheduler.runAfter(0, internal.threads.actions.runAgent, {
      threadId,
    })

    return { threadId, messageId, assistantMessageId }
  },
})

export const addMessage = mutation({
  args: {
    threadId: v.id("threads"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.authenticatedUser(ctx)
    const thread = await threads.getThread(ctx, args.threadId)
    if (thread.userId !== userId) {
      throw new Error("Thread not found")
    }

    const { messageId, assistantMessageId } = await threads.sendUserMessage(
      ctx,
      args.threadId,
      args.message,
    )

    await ctx.scheduler.runAfter(0, internal.threads.actions.runAgent, {
      threadId: args.threadId,
    })

    return { messageId, assistantMessageId }
  },
})

export const createFormForThread = internalMutation({
  args: {
    userId: v.id("users"),
    threadId: v.id("threads"),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const thread = await threads.getThread(ctx, args.threadId)
    if (thread.formId) {
      throw new Error("Thread already has a form")
    }

    const formId = await forms.createEmptyForm(
      ctx,
      args.userId,
      args.title,
      args.description,
    )

    const profile = await profiles.getProfileForUserId(ctx, args.userId)
    if (!profile) {
      throw new Error("User doesn't have a bio page")
    }

    await links.createFormLink(ctx, {
      userId: args.userId,
      profileId: profile._id,
      title: args.title,
      formId,
    })

    await ctx.db.patch("threads", args.threadId, {
      formId: formId,
    })
  },
})

export const updateThreadForm = internalMutation({
  args: {
    threadId: v.id("threads"),
    title: v.string(),
    description: v.optional(v.string()),
    fields: v.array(formField),
  },
  handler: async (ctx, args) => {
    const thread = await threads.getThread(ctx, args.threadId)
    if (!thread.formId) {
      throw new Error("Not form linked to this thread")
    }

    await forms.updateForm(
      ctx,
      thread.formId,
      args.title,
      args.fields,
      args.description,
    )
  },
})
