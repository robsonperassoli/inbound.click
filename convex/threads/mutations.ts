import { v } from "convex/values"
import { internal } from "../_generated/api"
import { internalMutation, mutation } from "../_generated/server"
import * as auth from "../auth"
import { userMutation } from "../custom"
import * as forms from "../forms/domain"
import { formField } from "../forms/validators"
import { formSubmissionTranscriptUrl } from "../frontend"
import * as links from "../links/domain"
import * as profiles from "../profiles/domain"
import { getFirstName } from "../utils/names"
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
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    const profile = await profiles.getProfileById(ctx, args.profileId)
    profiles.checkProfileOwnership(profile, ctx.account._id)

    const { threadId, messageId, assistantMessageId } =
      await threads.createFormBuilderThread(
        ctx,
        ctx.user._id,
        args.profileId,
        args.message,
      )

    await ctx.scheduler.runAfter(0, internal.threads.actions.runAgent, {
      threadId,
    })

    return { threadId, messageId, assistantMessageId }
  },
})

export const createThemeDesignerThread = userMutation({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    const profile = await profiles.getProfileById(ctx, args.profileId)
    profiles.checkProfileOwnership(profile, ctx.account._id)

    const { threadId, messageId, assistantMessageId } =
      await threads.createThemeDesignerThread(ctx, ctx.user._id, profile._id)

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
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    const thread = await threads.getThread(ctx, args.threadId)
    if (thread.type !== "formBuilder") {
      throw new Error("Thread is not a form builder")
    }

    if (thread.formId) {
      throw new Error("Thread already has a form")
    }

    const formId = await forms.createEmptyForm(
      ctx,
      args.userId,
      args.title,
      args.description,
    )

    await links.createFormLink(ctx, {
      userId: args.userId,
      profileId: args.profileId,
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
    if (thread.type !== "formBuilder") {
      throw new Error("Thread is not a form builder")
    }

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

export const autoCloseAbandonedThreads = internalMutation({
  args: {},
  handler: async (ctx, _args) => {
    const threadList = await ctx.db
      .query("threads")
      .withIndex("by_type_and_session_ended", (q) =>
        q.eq("type", "formSubmission").eq("sessionEndedAt", undefined),
      )
      .collect()

    const twentyFiveMinutesAgo = Date.now() - 25 * 60 * 1000
    const twoHoursAgo = Date.now() - 25 * 60 * 1000

    // no user message or submission, opened and abandoned
    const endWithNoAction = threadList
      .filter((thread) => {
        if (thread.type !== "formSubmission") {
          throw new Error(`Invalid thread type`)
        }

        return (
          (!thread.lastUserMessageAt || !thread.formSubmissionId) &&
          thread.createdAt < twoHoursAgo
        )
      })
      .map(({ _id }) => _id)

    await threads.endFormSubmissionThreads(ctx, endWithNoAction)

    const endWithCompleteEmail = threadList.filter((thread) => {
      if (thread.type !== "formSubmission") {
        throw new Error(`Invalid thread type`)
      }

      if (!thread.lastUserMessageAt || !thread.formSubmissionId) {
        return false
      }

      return thread.lastUserMessageAt < twentyFiveMinutesAgo
    })

    for (const thread of endWithCompleteEmail) {
      if (thread.type !== "formSubmission") {
        throw new Error(`Invalid thread type`)
      }

      if (!thread.lastUserMessageAt) {
        throw new Error(`The thread has no lastUserMessageAt: ${thread._id}`)
      }

      if (!thread.formSubmissionId) {
        throw new Error(`The thread has no formSubmissionId: ${thread._id}`)
      }

      await threads.endFormSubmissionThreads(ctx, [thread._id])

      const user = await auth.getUserDetails(ctx, thread.userId)
      ctx.runMutation(internal.emails.sendChatCompleted, {
        formSubmissionId: thread.formSubmissionId,
        conversationStatus: "abandoned",
        to: user.email,
        firstName: getFirstName(user.name),
        formSubmissionTranscriptUrl: formSubmissionTranscriptUrl(
          thread.formId,
          thread.formSubmissionId,
        ),
      })
    }
  },
})
