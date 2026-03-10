import { encode } from "@toon-format/toon"
import type { Infer } from "convex/values"
import type { Doc, Id } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"
import * as forms from "../forms/domain"
import { systemPrompt as formBuilderSystemPrompt } from "../threads/agents/formBuilder"
import type { threadsFields } from "./validators"

export type Thread = Infer<typeof threadsFields>

export async function createFormBuilderThread(
  ctx: MutationCtx,
  userId: Id<"users">,
  firstPrompt: string,
) {
  return await createThread(
    ctx,
    {
      userId,
      model: "gpt-4o-mini",
      title: "Form Builder Session",
      type: "formBuilder",
      systemPrompt: formBuilderSystemPrompt,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    firstPrompt,
  )
}

async function createThread(
  ctx: MutationCtx,
  args: Thread,
  userMessage: string,
) {
  const values = {
    ...args,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  } as Thread

  const threadId = await ctx.db.insert("threads", values)

  const messageId = await ctx.db.insert("messages", {
    threadId,
    content: userMessage,
    role: "user",
    status: "complete",
    createdAt: Date.now(),
  })

  const assistantMessageId = await ctx.db.insert("messages", {
    threadId,
    content: "",
    role: "assistant",
    status: "pending",
    createdAt: Date.now(),
  })

  return { threadId, messageId, assistantMessageId }
}

export async function sendUserMessage(
  ctx: MutationCtx,
  threadId: Id<"threads">,
  message: string,
) {
  await ctx.db.patch("threads", threadId, {
    lastUserMessageAt: Date.now(),
    updatedAt: Date.now(),
  })

  const messageId = await ctx.db.insert("messages", {
    threadId,
    content: message,
    role: "user",
    status: "complete",
    createdAt: Date.now(),
  })

  const assistantMessageId = await ctx.db.insert("messages", {
    threadId,
    content: "",
    role: "assistant",
    status: "pending",
    createdAt: Date.now(),
  })

  return { messageId, assistantMessageId }
}

export const getThreadAndMessages = async (
  ctx: QueryCtx,
  threadId: Id<"threads">,
) => {
  const thread = await getThread(ctx, threadId)

  return {
    ...thread,
    messages: await getMessagesByThreadId(ctx, threadId),
  }
}

export const getThread = async (ctx: QueryCtx, threadId: Id<"threads">) => {
  const thread = await ctx.db.get("threads", threadId)
  if (!thread) {
    throw new Error("Thread not found")
  }

  return thread
}

export const getMessagesByThreadId = async (
  ctx: QueryCtx,
  threadId: Id<"threads">,
) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_thread", (q) => q.eq("threadId", threadId))
    .collect()

  return messages.sort((a, b) => a.createdAt - b.createdAt)
}

export const setFormSubmissionId = async (
  ctx: MutationCtx,
  threadId: Id<"threads">,
  formSubmissionId: Id<"formSubmissions">,
) => {
  await ctx.db.patch("threads", threadId, {
    formSubmissionId,
  })
}

export async function buildThreadState(ctx: QueryCtx, thread: Doc<"threads">) {
  if (thread.type === "formBuilder") {
    if (!thread.formId) {
      return "FORM DEFINITION: Form not created yet"
    }

    const form = await forms.getForm(ctx, thread.formId)
    const formData = {
      title: form.title,
      description: form.description,
      fields: form.fields,
    }

    return `FORM DEFINITION: ${encode(formData)}`
  }

  if (thread.type === "formSubmission") {
    const form = await forms.getForm(ctx, thread.formId)
    let submission = null
    if (thread.formSubmissionId) {
      submission = await forms.getFormSubmission(ctx, thread.formSubmissionId)
    }

    return `
    FORM_DEFINITION: ${encode(form.fields)}
    COLLECTED_VALUES: ${encode(submission?.values)}
    `
  }

  throw new Error("Thread type not handled")
}

export async function endFormSubmissionThreads(
  ctx: MutationCtx,
  ids: Array<Id<"threads">>,
) {
  for (const id of ids) {
    await ctx.db.patch("threads", id, {
      sessionEndedAt: Date.now(),
    })
  }
}

export async function getThreadByFormSubmissionId(
  ctx: QueryCtx,
  formSubmissionId: Id<"formSubmissions">,
) {
  const submission = await ctx.db
    .query("threads")
    .withIndex("by_form_submission", (q) =>
      q.eq("formSubmissionId", formSubmissionId),
    )
    .unique()

  if (!submission) {
    throw new Error(`No thread found for form submission ${formSubmissionId}`)
  }

  return submission
}
