import { v } from "convex/values"
import { internalQuery, query } from "../_generated/server"
import * as threads from "./domain"

export const getFullChat = internalQuery({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db
      .query("threads")
      .withIndex("by_id", (q) => q.eq("_id", args.threadId))
      .unique()

    if (!thread) {
      throw new Error("thread not found")
    }

    return {
      thread,
      messages: await threads.getMessagesByThreadId(ctx, args.threadId),
    }
  },
})

export const getChatMessages = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    return await threads.getMessagesByThreadId(ctx, args.threadId)
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
