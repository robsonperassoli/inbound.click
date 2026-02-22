import { v } from "convex/values"
import { internal } from "../_generated/api"
import type { Doc } from "../_generated/dataModel"
import { internalAction } from "../_generated/server"
import { createFormSubmissionAgent } from "./domain"

export const runFormSubmissionAgent = internalAction({
  args: {
    formSubmissionChatSessionId: v.id("formSubmissionChatSessions"),
    chatId: v.id("chats"),
    state: v.string(),
  },
  handler: async (ctx, args) => {
    const result: { chat: Doc<"chats">; messages: Doc<"chatMessages">[] } =
      await ctx.runQuery(internal.chats.queries.getFullChat, {
        chatId: args.chatId,
      })

    const lastMessage = result.messages[result.messages.length - 1]
    if (lastMessage.status !== "pending") {
      return
    }

    const completionMsgs = result.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    const system = `${result.chat.systemPrompt}\n\n${args.state ?? ""}`

    const agent = createFormSubmissionAgent(
      ctx,
      system,
      args.formSubmissionChatSessionId,
    )

    const { text } = await agent.generate({
      messages: completionMsgs,
    })

    await ctx.runMutation(internal.chats.mutations.updateMessageContent, {
      messageId: lastMessage._id,
      content: text,
    })

    return text
  },
})
