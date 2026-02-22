import { v } from "convex/values"
import { internalQuery, query } from "../_generated/server"

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
