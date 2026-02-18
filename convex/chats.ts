import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import {
  internalMutation,
  internalQuery,
  type MutationCtx,
  mutation,
  query,
} from "./_generated/server"
import { authenticatedUser } from "./profiles"

export async function sendUserMessage(
  ctx: MutationCtx,
  chatId: Id<"chats">,
  message: string,
) {
  const messageId = await ctx.db.insert("chatMessages", {
    chatId,
    content: message,
    role: "user",
    status: "complete",
    createdAt: new Date().getUTCDate(),
  })

  const assistantMessageId = await ctx.db.insert("chatMessages", {
    chatId,
    content: "",
    role: "assistant",
    status: "pending",
    createdAt: new Date().getUTCDate(),
  })

  return { messageId, assistantMessageId }
}

export const getFullChat = internalQuery({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db
      .query("chats")
      .withIndex("by_id", (q) => q.eq("_id", args.chatId))
      .unique()

    if (!chat) {
      throw new Error("chat not found")
    }

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect()

    return {
      chat,
      messages: messages.sort((a, b) => a.createdAt - b.createdAt),
    }
  },
})

export const updateMessageContent = internalMutation({
  args: {
    messageId: v.id("chatMessages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch("chatMessages", args.messageId, {
      content: args.content,
      status: "complete",
    })
  },
})

export const createChat = mutation({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const _userId = authenticatedUser(ctx)

    const chatId = await ctx.db.insert("chats", {
      model: "gpt-4o-mini",
      systemPrompt: "You are a helpful assistant.",
      title: "New Chat",
      createdAt: new Date().getUTCDate(),
      updatedAt: new Date().getUTCDate(),
    })

    const messageId = await ctx.db.insert("chatMessages", {
      chatId,
      content: args.message,
      role: "user",
      status: "complete",
      createdAt: new Date().getUTCDate(),
    })

    const assistantMessageId = await ctx.db.insert("chatMessages", {
      chatId,
      content: "",
      role: "assistant",
      status: "pending",
      createdAt: new Date().getUTCDate(),
    })

    return { chatId, messageId, assistantMessageId }
  },
})

export const addMessage = mutation({
  args: {
    chatId: v.id("chats"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const _userId = authenticatedUser(ctx)
    const { messageId, assistantMessageId } = await sendUserMessage(
      ctx,
      args.chatId,
      args.message,
    )

    // await ctx.scheduler.runAfter(0, internal.chats.chatCompletion, {
    //   chatId: args.chatId,
    //   context: {},
    // })

    return { messageId, assistantMessageId }
  },
})

export const getChatMessages = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect()

    return messages.sort((a, b) => a.createdAt - b.createdAt)
  },
})
