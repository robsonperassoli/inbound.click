import { v } from "convex/values"
import { internal } from "../_generated/api"
import { internalQuery, query } from "../_generated/server"
import { userQuery } from "../custom"
import * as threads from "./domain"

export const getFullChat = internalQuery({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    return await threads.getThreadAndMessages(ctx, args.threadId)
  },
})

export const getFullThread = userQuery({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const thread = await threads.getThreadAndMessages(ctx, args.threadId)

    if (thread.userId !== ctx.user._id) {
      throw new Error("thread not found")
    }

    return thread
  },
})

export const getMessages = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    return await threads.getMessagesByThreadId(ctx, args.threadId)
  },
})

export const getUserFormSubmissionTranscript = userQuery({
  args: { formSubmissionId: v.id("formSubmissions") },
  handler: async (ctx, args) => {
    const thread = await threads.getThreadByFormSubmissionId(
      ctx,
      args.formSubmissionId,
    )

    if (thread.userId !== ctx.user._id) {
      throw new Error("Thread not found")
    }

    return await threads.getThreadAndMessages(ctx, thread._id)
  },
})

export const getAgentState = internalQuery({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const thread = await threads.getThread(ctx, args.threadId)
    return await threads.buildThreadState(ctx, thread)
  },
})
