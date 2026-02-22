import { v } from "convex/values"
import { internalMutation, mutation } from "../_generated/server"
import * as auth from "../domain/auth"
import * as chats from "./domain"

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

export const createUserChat = mutation({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const _userId = auth.authenticatedUser(ctx)

    const { chatId, messageId, assistantMessageId } = await chats.createChat(
      ctx,
      {
        message: args.message,
        title: "New Chat",
        mode: "chat",
        systemPrompt: "You are a helpful assistant.",
      },
    )

    return { chatId, messageId, assistantMessageId }
  },
})

export const addMessage = mutation({
  args: {
    chatId: v.id("chats"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const _userId = auth.authenticatedUser(ctx)
    const { messageId, assistantMessageId } = await chats.sendUserMessage(
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
