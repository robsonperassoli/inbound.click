import type { Id } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"

type CreateChatArgs = {
  message: string
  title: string
  mode: string
  systemPrompt: string
}

export async function createChat(ctx: MutationCtx, args: CreateChatArgs) {
  const chatId = await ctx.db.insert("chats", {
    model: "gpt-4o-mini",
    systemPrompt: args.systemPrompt,
    title: args.title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })

  const messageId = await ctx.db.insert("chatMessages", {
    chatId,
    content: args.message,
    role: "user",
    status: "complete",
    createdAt: Date.now(),
  })

  const assistantMessageId = await ctx.db.insert("chatMessages", {
    chatId,
    content: "",
    role: "assistant",
    status: "pending",
    createdAt: Date.now(),
  })

  return { chatId, messageId, assistantMessageId }
}

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
    createdAt: Date.now(),
  })

  const assistantMessageId = await ctx.db.insert("chatMessages", {
    chatId,
    content: "",
    role: "assistant",
    status: "pending",
    createdAt: Date.now(),
  })

  return { messageId, assistantMessageId }
}

export const getChat = async (ctx: QueryCtx, chatId: Id<"chats">) => {
  const chat = await ctx.db.get("chats", chatId)
  if (!chat) {
    throw new Error("Chat not found")
  }

  return chat
}
