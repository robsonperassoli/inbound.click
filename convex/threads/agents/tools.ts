import { tool } from "ai"
import { z } from "zod/v4"
import { internal } from "../../_generated/api"
import type { Id } from "../../_generated/dataModel"
import type { ActionCtx } from "../../_generated/server"

export const themeSchema = z.object({
  theme: z.string().describe("The name of the theme"),
  backgroundColor: z.string(),
  backgroundImage: z.string(),
  fontFamily: z.string(),
  textColor: z.string(),
  buttonShape: z.enum(["square", "rounded", "pill"]),
  buttonStyle: z.enum(["solid", "outline", "paper", "shadow", "3d", "ghost"]),
  buttonColor: z.string(),
  buttonTextColor: z.string(),
})

export function createFillFormTool(ctx: ActionCtx, threadId: Id<"threads">) {
  return tool({
    description: "Fill form fields with data",
    inputSchema: z.object({
      values: z.array(
        z.object({
          fieldId: z.string().describe("The ID of the form field to fill"),
          value: z
            .union([z.string(), z.number(), z.array(z.string()), z.boolean()])
            .describe("The value to fill the field with"),
        }),
      ),
    }),
    execute: async (args) => {
      const values = args.values.reduce(
        (acc, v) => ({
          ...acc,
          [v.fieldId]: v.value,
        }),
        {},
      )

      await ctx.runMutation(internal.forms.mutations.fillForm, {
        threadId,
        values,
      })
    },
  })
}

export function completeFormSubmission(
  ctx: ActionCtx,
  threadId: Id<"threads">,
) {
  return tool({
    description: "Close the current chat session and submit the form",
    inputSchema: z.object({}),
    execute: async (_args) => {
      await ctx.runMutation(internal.forms.mutations.setSubmissionComplete, {
        threadId,
      })
    },
  })
}

export function createListFormsTool(ctx: ActionCtx, userId: Id<"users">) {
  return tool({
    description: "List User forms",
    inputSchema: z.object({}),
    execute: async (_args) => {
      const forms = await ctx.runQuery(
        internal.forms.queries.getUserFormsInternal,
        {
          userId,
        },
      )

      return forms.map(({ userId, ...rest }) => rest)
    },
  })
}

export function createCreateFormTool(
  ctx: ActionCtx,
  userId: Id<"users">,
  threadId: Id<"threads">,
) {
  return tool({
    description: "Create User form",
    inputSchema: z.object({
      title: z.string().min(1).max(100),
      description: z.string().min(1).max(1000).optional(),
    }),
    execute: async (args) => {
      await ctx.runMutation(internal.threads.mutations.createFormForThread, {
        userId,
        threadId,
        ...args,
      })

      return "Form created sucessfuly"
    },
  })
}

export function createUpdateFormTool(ctx: ActionCtx, threadId: Id<"threads">) {
  return tool({
    description: "Update User form",
    inputSchema: z.object({
      title: z.string().min(1).max(100),
      description: z.string().min(1).max(1000).optional(),
      fields: z.array(
        z.object({
          id: z.string(),
          type: z.enum([
            "shortText",
            "longText",
            "email",
            "phoneNumber",
            "number",
            "select",
            "checkbox",
            "date",
            "dateTime",
          ]),
          label: z.string(),
          required: z.boolean(),
          options: z.array(z.string()).optional(),
        }),
      ),
    }),
    execute: async (args) => {
      await ctx.runMutation(internal.threads.mutations.updateThreadForm, {
        threadId,
        ...args,
      })

      return "Form updated sucessfuly"
    },
  })
}

export function createUpdateThemeTool(
  ctx: ActionCtx,
  profileId: Id<"profiles">,
) {
  return tool({
    description:
      "Update the users page design using with the provided theme settings",
    inputSchema: themeSchema,
    execute: async (args) => {
      await ctx.runMutation(internal.profiles.mutations.updateThemeInternal, {
        profileId,
        ...args,
        backgroundImage: undefined, // TODO: fix this eventually
      })

      return "Theme updated sucessfuly"
    },
  })
}
