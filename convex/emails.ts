import { Resend } from "@convex-dev/resend"
import { v } from "convex/values"
import { components } from "./_generated/api"
import { internalMutation } from "./_generated/server"

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
})

const DEFAULT_FROM = "Inbound.click <robson@send.inbound.click>"
const DEFAULT_SUPPORT_TO =
  process.env.SUPPORT_EMAIL ?? "robson@send.inbound.click"
const DEFAULT_FEEDBACK_TO =
  process.env.FEEDBACK_EMAIL ??
  process.env.SUPPORT_EMAIL ??
  "robson@send.inbound.click"

const supportCategoryLabel: Record<
  "bio" | "forms" | "billing" | "account" | "bug" | "other",
  string
> = {
  bio: "Bio page / links",
  forms: "Forms / submissions",
  billing: "Billing / plan",
  account: "Account / sign-in",
  bug: "Bug / technical problem",
  other: "Other",
}

const feedbackAreaLabel: Record<
  | "bio"
  | "forms"
  | "analytics"
  | "billing"
  | "onboarding"
  | "account"
  | "other",
  string
> = {
  bio: "Bio page",
  forms: "Forms",
  analytics: "Analytics",
  billing: "Billing",
  onboarding: "Onboarding",
  account: "Sign-in / account",
  other: "Other",
}

const formatLine = (label: string, value?: string | null) =>
  `${label}: ${value?.trim() ? value.trim() : "Not provided"}`

const buildSupportEmailText = ({
  email,
  subject,
  category,
  message,
  routeContext,
  currentPath,
  userAgent,
  submittedAt,
  requesterName,
  requesterUserId,
  requesterUsername,
}: {
  email: string
  subject: string
  category: keyof typeof supportCategoryLabel
  message: string
  routeContext?: string
  currentPath?: string
  userAgent?: string
  submittedAt: string
  requesterName?: string
  requesterUserId: string
  requesterUsername?: string
}) =>
  [
    "A new support request was submitted.",
    "",
    formatLine("Customer email", email),
    formatLine("Customer name", requesterName),
    formatLine("Subject", subject),
    formatLine("Category", supportCategoryLabel[category]),
    formatLine("Where were you?", routeContext),
    "",
    "Message",
    message.trim(),
    "",
    "Technical metadata",
    formatLine("Current route", currentPath),
    formatLine("Browser", userAgent),
    formatLine("Submitted at", submittedAt),
    formatLine("User ID", requesterUserId),
    formatLine("Username", requesterUsername),
  ].join("\n")

const buildFeedbackEmailText = ({
  email,
  type,
  title,
  area,
  summary,
  requestedChange,
  impact,
  expectedBehavior,
  reproSteps,
  currentPath,
  userAgent,
  submittedAt,
  requesterName,
  requesterUserId,
  requesterUsername,
}: {
  email: string
  type: "feature" | "bug"
  title: string
  area: keyof typeof feedbackAreaLabel
  summary: string
  requestedChange?: string
  impact?: string
  expectedBehavior?: string
  reproSteps?: string
  currentPath?: string
  userAgent?: string
  submittedAt: string
  requesterName?: string
  requesterUserId: string
  requesterUsername?: string
}) =>
  [
    `A new ${type === "feature" ? "feature idea" : "bug report"} was submitted.`,
    "",
    formatLine("Customer email", email),
    formatLine("Customer name", requesterName),
    formatLine(
      "Feedback type",
      type === "feature" ? "Feature idea" : "Bug report",
    ),
    formatLine("Title", title),
    formatLine("Area", feedbackAreaLabel[area]),
    "",
    type === "feature" ? "What are you trying to do?" : "What happened?",
    summary.trim(),
    "",
    type === "feature"
      ? "What should change?"
      : "What did you expect to happen?",
    (type === "feature" ? requestedChange : expectedBehavior)?.trim() ||
      "Not provided",
    "",
    type === "feature" ? "How would this help you?" : "Steps to reproduce",
    (type === "feature" ? impact : reproSteps)?.trim() || "Not provided",
    "",
    "Technical metadata",
    formatLine("Current route", currentPath),
    formatLine("Browser", userAgent),
    formatLine("Submitted at", submittedAt),
    formatLine("User ID", requesterUserId),
    formatLine("Username", requesterUsername),
  ].join("\n")

export const sendActivationEmail = internalMutation({
  args: {
    to: v.string(),
    firstName: v.string(),
    username: v.string(),
  },
  handler: async (ctx, { to, firstName, username }) => {
    await resend.sendEmail(ctx, {
      from: "Robson <robson@send.inbound.click>",
      to,
      template: {
        id: "lead-capture-activation-1",
        variables: {
          firstName,
          username,
        },
      },
    })
  },
})

export const sendSupportEmail = internalMutation({
  args: {
    email: v.string(),
    subject: v.string(),
    category: v.union(
      v.literal("bio"),
      v.literal("forms"),
      v.literal("billing"),
      v.literal("account"),
      v.literal("bug"),
      v.literal("other"),
    ),
    message: v.string(),
    routeContext: v.optional(v.string()),
    currentPath: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    submittedAt: v.string(),
    requesterName: v.optional(v.string()),
    requesterUserId: v.string(),
    requesterUsername: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await resend.sendEmail(ctx, {
      from: DEFAULT_FROM,
      to: DEFAULT_SUPPORT_TO,
      replyTo: [args.email],
      subject: `[Support] ${supportCategoryLabel[args.category]} - ${args.subject}`,
      text: buildSupportEmailText(args),
    })
  },
})

export const sendFeedbackEmail = internalMutation({
  args: {
    email: v.string(),
    type: v.union(v.literal("feature"), v.literal("bug")),
    title: v.string(),
    area: v.union(
      v.literal("bio"),
      v.literal("forms"),
      v.literal("analytics"),
      v.literal("billing"),
      v.literal("onboarding"),
      v.literal("account"),
      v.literal("other"),
    ),
    summary: v.string(),
    requestedChange: v.optional(v.string()),
    impact: v.optional(v.string()),
    expectedBehavior: v.optional(v.string()),
    reproSteps: v.optional(v.string()),
    currentPath: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    submittedAt: v.string(),
    requesterName: v.optional(v.string()),
    requesterUserId: v.string(),
    requesterUsername: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await resend.sendEmail(ctx, {
      from: DEFAULT_FROM,
      to: DEFAULT_FEEDBACK_TO,
      replyTo: [args.email],
      subject: `[Feedback][${args.type === "feature" ? "Feature" : "Bug"}] ${args.title}`,
      text: buildFeedbackEmailText(args),
    })
  },
})

export const sendNewConversation = internalMutation({
  args: {
    formSubmissionId: v.string(),
    to: v.string(),
    firstName: v.string(),
    formSubmissionTranscriptUrl: v.string(),
  },
  handler: async (
    ctx,
    { to, firstName, formSubmissionTranscriptUrl, formSubmissionId },
  ) => {
    await resend.sendEmail(ctx, {
      from: "Inbound.Click <notifications@send.inbound.click>",
      to,
      template: {
        id: "new-conversation",
        variables: {
          firstName,
          formSubmissionTranscriptUrl,
        },
      },
      headers: createProfileChatHeaders(formSubmissionId),
    })
  },
})

export const sendChatCompleted = internalMutation({
  args: {
    formSubmissionId: v.string(),
    to: v.string(),
    firstName: v.string(),
    formSubmissionTranscriptUrl: v.string(),
    conversationStatus: v.union(v.literal("finished"), v.literal("abandoned")),
  },
  handler: async (
    ctx,
    {
      to,
      firstName,
      formSubmissionTranscriptUrl,
      conversationStatus,
      formSubmissionId,
    },
  ) => {
    const completed =
      "The conversation finished and Hugo collected all the key details. The lead is ready for you to review."
    const abandoned =
      "The visitor stopped responding before finishing the conversation. You can still review what was captured up to that moment."

    await resend.sendEmail(ctx, {
      from: "Inbound.Click <notifications@send.inbound.click>",
      to,
      template: {
        id: "chat-completed",
        variables: {
          firstName,
          formSubmissionTranscriptUrl,
          statusMessage:
            conversationStatus === "abandoned" ? abandoned : completed,
        },
      },
      headers: createProfileChatHeaders(formSubmissionId),
    })
  },
})

const createProfileChatHeaders = (formSubmissionId: string) => [
  { name: "In-Reply-To", value: `<${formSubmissionId}@inbound.click>` },
  { name: "References", value: `<${formSubmissionId}@inbound.click>` },
]
