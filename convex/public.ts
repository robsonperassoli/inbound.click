import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

const getSession = async (ctx: QueryCtx, sessionId: Id<'formSubmissionChatSessions'>) => {
  const session = await ctx.db.get('formSubmissionChatSessions', sessionId)
  if (!session) {
    throw new Error('Session not found')
  }

  return session
}

const getChat = async (ctx: QueryCtx, chatId: Id<'chats'>) => {
  const chat = await ctx.db.get('chats', chatId)
  if (!chat) {
    throw new Error('Chat not found')
  }

  return chat
}

export const getProfile = query({
  args: {
    username: v.string()
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique()

    if (!profile) {
      throw new Error('Not found')
    }

    const unsortedLinks = await ctx.db.query("links")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id)).collect()

    const links = unsortedLinks.sort((a, b) => b.order - a.order)

    return {
      profile,
      links
    };
  },
});

export const startFormSession = mutation({
  args: {
    username: v.string()
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.query('profiles')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .unique()

    if (!profile) {
      throw new Error('user not found')
    }

    const form = await ctx.db.query('forms')
      .withIndex('by_user', (q) => q.eq('userId', profile.userId))
      .unique()

    if (!form) {
      throw new Error('form not found')
    }

    const chatId = await ctx.db.insert('chats', {
      title: `${form.title} Form Session`,
      model: 'gpt-4o-mini',
      systemPrompt: `You are a helpful assistant. Your name is Hugo.
      Your goal is to help people with form submissions, but never mention it.
      You should capture answers in a friendly casual conversation and fill
      the form yourself using the tools provided.`,
      createdAt: new Date().getUTCDate(),
      updatedAt: new Date().getUTCDate()
    })

    await ctx.db.insert('chatMessages', {
      chatId,
      role: 'assistant',
      content: `Hello! Good to have you here. ${profile.username} has a few questions that I'll help you answer! Is now a good time to chat?`,
      createdAt: new Date().getUTCDate(),
      status: 'complete'
    })

    const sessionId = await ctx.db.insert('formSubmissionChatSessions', {
      userId: profile.userId,
      chatId,
      formId: form._id,
      createdAt: new Date().getUTCDate(),
      updatedAt: new Date().getUTCDate()
    })

    return sessionId
  }
})

export const getFormSessionMessages = query({
  args: {
    sessionId: v.id('formSubmissionChatSessions'),
  },
  handler: async (ctx, args) => {
    const session = await getSession(ctx, args.sessionId)
    const chat = await getChat(ctx, session.chatId)

    const chatMessages = await ctx.db.query('chatMessages')
      .withIndex('by_chat', q => q.eq('chatId', chat._id))
      .collect()

    return chatMessages.sort((a, b) => a.createdAt - b.createdAt)
  }
})

export const sendFormSessionMessage = mutation({
  args: {
    sessionId: v.id('formSubmissionChatSessions'),
    message: v.string()
  },
  handler: async (ctx, args) => {
    const session = await getSession(ctx, args.sessionId)
    const chat = await getChat(ctx, session.chatId)

    await ctx.db.insert('chatMessages', {
      chatId: chat._id,
      content: args.message,
      createdAt: new Date().getUTCDate(),
      role: 'user',
      status: 'complete'
    })

     await ctx.db.insert('chatMessages', {
      chatId: chat._id,
      content: '',
      createdAt: new Date().getUTCDate(),
      role: 'assistant',
      status: 'pending'
     })

    await ctx.scheduler.runAfter(0, internal.chats.chatCompletion, {
      chatId: chat._id
    })
  }
})
