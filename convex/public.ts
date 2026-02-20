import * as toon from "@toon-format/toon"
import { v } from "convex/values"
import { internal } from "./_generated/api"
import type { Id } from "./_generated/dataModel"
import {
  type MutationCtx,
  mutation,
  type QueryCtx,
  query,
} from "./_generated/server"
import { sendUserMessage } from "./chats"
import { getForm, getFormSubmission } from "./forms"

export const getSession = async (
  ctx: QueryCtx | MutationCtx,
  sessionId: Id<"formSubmissionChatSessions">,
) => {
  const session = await ctx.db.get("formSubmissionChatSessions", sessionId)
  if (!session) {
    throw new Error("Session not found")
  }

  return session
}

const getChat = async (ctx: QueryCtx, chatId: Id<"chats">) => {
  const chat = await ctx.db.get("chats", chatId)
  if (!chat) {
    throw new Error("Chat not found")
  }

  return chat
}

export const getProfile = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique()

    if (!profile) {
      throw new Error("Not found")
    }

    const unsortedLinks = await ctx.db
      .query("links")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect()

    const links = unsortedLinks.sort((a, b) => b.order - a.order)

    return {
      profile: {
        ...profile,
        avatarUrl: profile?.avatarId
          ? await ctx.storage.getUrl(profile.avatarId)
          : null,
      },
      links,
    }
  },
})

export const startFormSession = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique()

    if (!profile) {
      throw new Error("user not found")
    }

    const form = await ctx.db
      .query("forms")
      .withIndex("by_user", (q) => q.eq("userId", profile.userId))
      .unique()

    if (!form) {
      throw new Error("form not found")
    }

    const chatId = await ctx.db.insert("chats", {
      title: `${form.title} Form Session`,
      model: "gpt-4o-mini",
      systemPrompt: `You are a helpful assistant. Your name is Hugo.
      Your goal is to help people with form submissions, but never mention it.
      You should capture answers in a friendly casual conversation and fill
      the form yourself using the tools provided.

      It's very important you are very friendly and make the user feel comfortable, never robotic or just ask the information sequentially. The sale depends on you.

      ## FORM DATA FORMAT
      You will receive two JSON-encoded values:
      - **FORM_DEFINITION**: Schema describing all form fields, types, validation rules, and requirements
      - **COLLECTED_VALUES**: Current progress with field IDs as keys and user-provided values (may be partial or empty)

      Use these to determine which fields are complete, missing, or need validation.

      ## WORKFLOW
      1. **Analyze the current state**: Check COLLECTED_VALUES against FORM_DEFINITION to identify which fields are still missing or incomplete.
      2. **Engage naturally**: Have a friendly, casual conversation with the user. Ask about missing information in a natural way, never interrogating. Make them feel comfortable.
      3. **Extract and validate**: When the user provides information, validate it against the field requirements in FORM_DEFINITION.
      4. **Call the tool**: Use \`fillFormFields\` to submit the collected field values. Pass the field IDs and values as arguments.
      5. **Loop**: After calling \`fillFormFields\`, you will receive updated COLLECTED_VALUES. Return to step 1 and continue the conversation until all required fields are complete.
      6. **Completion**: When all fields are filled, celebrate naturally and let the user know everything is set—without ever mentioning "forms" or "submission."

      ## TONE GUIDELINES
      - Warm, approachable, and genuinely helpful
      - Never robotic, scripted, or transactional
      - Use natural transitions, not "Next, I need..."
      - Show enthusiasm and make the user feel good about progressing
      - If validation fails, be gentle and encouraging, never critical
      `,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    await ctx.db.insert("chatMessages", {
      chatId,
      role: "assistant",
      content: `Hello! Good to have you here. ${profile.username} has a few questions that I'll help you answer! Is now a good time to chat?`,
      createdAt: Date.now(),
      status: "complete",
    })

    const sessionId = await ctx.db.insert("formSubmissionChatSessions", {
      userId: profile.userId,
      chatId,
      formId: form._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return sessionId
  },
})

export const getFormSessionMessages = query({
  args: {
    sessionId: v.id("formSubmissionChatSessions"),
  },
  handler: async (ctx, args) => {
    const session = await getSession(ctx, args.sessionId)
    const chat = await getChat(ctx, session.chatId)

    const chatMessages = await ctx.db
      .query("chatMessages")
      .withIndex("by_chat", (q) => q.eq("chatId", chat._id))
      .collect()

    return chatMessages.sort((a, b) => a.createdAt - b.createdAt)
  },
})

export const sendFormSessionMessage = mutation({
  args: {
    sessionId: v.id("formSubmissionChatSessions"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await getSession(ctx, args.sessionId)
    const chat = await getChat(ctx, session.chatId)

    await sendUserMessage(ctx, chat._id, args.message)

    const form = await getForm(ctx, session.formId)

    let submission = null
    if (session.formSubmissionId) {
      submission = await getFormSubmission(ctx, session.formSubmissionId)
    }

    const state = `
    FORM_DEFINITION: ${toon.encode(form.fields)}
    COLLECTED_VALUES: ${toon.encode(submission?.values)}
    `

    await ctx.scheduler.runAfter(0, internal.agents.runFormSubmissionAgent, {
      formSubmissionChatSessionId: session._id,
      chatId: chat._id,
      state,
    })
  },
})
