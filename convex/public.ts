import { encode } from "@toon-format/toon"
import { v } from "convex/values"
import { internal } from "./_generated/api"
import { mutation, query } from "./_generated/server"
import * as forms from "./forms/domain"
import { systemPrompt } from "./threads/agents/formSubmission"
import * as threads from "./threads/domain"

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

export const getLinkById = query({
  args: {
    id: v.id("links"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("links")
      .withIndex("by_id", (q) => q.eq("_id", args.id))
      .unique()

    if (!link) {
      throw new Error("Not found")
    }

    return link
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

    // move this logic to the threads folder
    const threadId = await ctx.db.insert("threads", {
      userId: profile.userId,
      title: `${form.title} Form Session`,
      model: "gpt-4o-mini",
      systemPrompt,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      type: "formSubmission",
      formId: form._id,
      formSubmissionId: undefined,
    })

    await ctx.db.insert("messages", {
      threadId,
      role: "assistant",
      content: `Hello! Good to have you here. ${profile.username} has a few questions that I'll help you answer! Is now a good time to chat?`,
      createdAt: Date.now(),
      status: "complete",
    })

    return threadId
  },
})

export const getFormSessionMessages = query({
  args: {
    sessionId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    return await threads.getMessagesByThreadId(ctx, args.sessionId)
  },
})

export const sendFormSessionMessage = mutation({
  args: {
    sessionId: v.id("threads"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const thread = await threads.getThread(ctx, args.sessionId)
    await threads.sendUserMessage(ctx, thread._id, args.message)

    await ctx.scheduler.runAfter(0, internal.threads.actions.runAgent, {
      threadId: thread._id,
    })
  },
})
