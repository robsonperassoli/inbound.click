import { mutation, action, query, internalQuery, internalMutation, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { authenticatedUser } from "./profiles";
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { Doc } from "./_generated/dataModel";

export const getFullChat = internalQuery({
  args: {
    chatId: v.id('chats')
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.query('chats')
      .withIndex('by_id', q => q.eq('_id', args.chatId))
      .unique()

    if (!chat) {
      throw new Error('chat not found')
    }

    const messages = await ctx.db.query('chatMessages')
      .withIndex('by_chat', q => q.eq('chatId', args.chatId))
      .collect()

    return {
      chat,
      messages: messages.sort((a, b) => a.createdAt - b.createdAt)
    }
  }
})

export const updateMessageContent = internalMutation({
  args: {
    messageId: v.id('chatMessages'),
    content: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch('chatMessages', args.messageId, {
      content: args.content,
      status: 'complete'
    })
  }
})

export const createChat = mutation({
  args: {
    message: v.string()
  },
  handler: async (ctx, args) => {
    const _userId = authenticatedUser(ctx)

    const chatId = await ctx.db.insert('chats', {
      model: 'gpt-4o-mini',
      systemPrompt: 'You are a helpful assistant.',
      title: 'New Chat',
      createdAt: new Date().getUTCDate(),
      updatedAt: new Date().getUTCDate()
    })

    const messageId = await ctx.db.insert('chatMessages', {
      chatId,
      content: args.message,
      role: 'user',
      status: 'complete',
      createdAt: new Date().getUTCDate()
    })

    const assistantMessageId = await ctx.db.insert('chatMessages', {
      chatId,
      content: "",
      role: 'assistant',
      status: 'pending',
      createdAt: new Date().getUTCDate()
    })

    return {chatId, messageId, assistantMessageId}
  },
})

export const addMessage = mutation({
  args: {
    chatId: v.id('chats'),
    message: v.string()
  },
  handler: async (ctx, args) => {
    const _userId = authenticatedUser(ctx)

    const messageId = await ctx.db.insert('chatMessages', {
      chatId: args.chatId,
      content: args.message,
      role: 'user',
      status: 'complete',
      createdAt: new Date().getUTCDate()
    })

    const assistantMessageId = await ctx.db.insert('chatMessages', {
      chatId: args.chatId,
      content: "",
      role: 'assistant',
      status: 'pending',
      createdAt: new Date().getUTCDate()
    })

    ctx.scheduler.runAfter(0, internal.chats.chatCompletion, {
      chatId: args.chatId
    })

    return {messageId, assistantMessageId}
  },
})

export const chatCompletion = internalAction({
  args: {
    chatId: v.id('chats'),
  },
  handler: async (ctx, args) => {
    try {
      const result: {chat: Doc<'chats'>, messages: Doc<'chatMessages'>[]} = await ctx.runQuery(internal.chats.getFullChat, {
        chatId: args.chatId,
      })

      const lastMessage = result.messages[result.messages.length - 1]
      if (lastMessage.status !== 'pending') {
        return
      }

      const completionMsgs = result.messages.map(m => ({
        role: m.role,
        content: m.content,
      }))

      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        system: result.chat.systemPrompt,
        messages: completionMsgs,
        // tools: {
        //   weather: tool({
        //     description: 'Get the weather in a location',
        //     inputSchema: z.object({
        //       location: z.string().describe('The location to get the weather for'),
        //     }),
        //     execute: async ({ location }) => ({
        //       location,
        //       temperature: 72 + Math.floor(Math.random() * 21) - 10,
        //     }),
        //   }),
        // }
      })

      await ctx.runMutation(internal.chats.updateMessageContent, {
        messageId: lastMessage._id,
        content: text
      })

      return text;
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error(`Failed to get a response from OpenAI: ${error}`);
    }
  },
});

export const getChatMessages = query({
  args: {
    chatId: v.id('chats')
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db.query('chatMessages')
      .withIndex('by_chat', q => q.eq('chatId', args.chatId))
      .collect()

    return messages.sort((a, b) => a.createdAt - b.createdAt)
  },
});
