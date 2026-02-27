import { v } from "convex/values"
import { internal } from "./_generated/api"
import type { Doc } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import * as profiles from "./profiles/domain"
import { systemPrompt } from "./threads/agents/formSubmission"
import * as threads from "./threads/domain"

export const getProfile = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await profiles.getProfileByUsername(ctx, args.username)

    const unsortedLinks = await ctx.db
      .query("links")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect()

    const links = unsortedLinks.sort((a, b) => b.order - a.order)

    return {
      profile,
      links: links.map(removeUnsafeData),
    }
  },
})

const removeUnsafeData = ({ userId, ...rest }: Doc<"links">) => rest

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

    return removeUnsafeData(link)
  },
})

export const startFormSession = mutation({
  args: {
    profileId: v.id("profiles"),
    formId: v.id("forms"),
  },
  handler: async (ctx, args) => {
    const profile = await profiles.getProfileById(ctx, args.profileId)

    const form = await ctx.db.get("forms", args.formId)
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
