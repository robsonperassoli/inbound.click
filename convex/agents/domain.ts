import { openai } from "@ai-sdk/openai"
import { stepCountIs, ToolLoopAgent, tool } from "ai"
import { type Infer, v } from "convex/values"
import { z } from "zod/v4"
import { internal } from "../_generated/api"
import type { Doc, Id } from "../_generated/dataModel"
import type { ActionCtx } from "../_generated/server"

export const agent = v.union(
  v.literal("formSubmission"),
  v.literal("formManager"),
)
export type Agent = Infer<typeof agent>

function createFillFormTool(
  ctx: ActionCtx,
  formSubmissionChatSessionId: Id<"formSubmissionChatSessions">,
) {
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
        formSubmissionChatSessionId,
        values,
      })
    },
  })
}

function createListFormsTool(ctx: ActionCtx, userId: Id<"users">) {
  return tool({
    description: "List User forms",
    inputSchema: z.void(),
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

// function createCreateFormTool(ctx: ActionCtx, userId: Id<"users">) {
//   return tool({
//     description: "Create User form",
//     inputSchema: z.object({
//       title: z.string().min(1).max(100),
//       description: z.string().min(1).max(1000).optional(),
//     }),
//     execute: async (args) => {
//       throw new Error("Not implemented yet")
//     },
//   })
// }

export function createFormSubmissionAgent(
  ctx: ActionCtx,
  system: string,
  formSubmissionChatSessionId: Id<"formSubmissionChatSessions">,
) {
  return new ToolLoopAgent({
    model: openai("gpt-4o-mini"),
    instructions: system,
    tools: {
      fillForm: createFillFormTool(ctx, formSubmissionChatSessionId),
    },
    stopWhen: [stepCountIs(20)],
  })
}

export function createFormManagerAgent(
  ctx: ActionCtx,
  system: string,
  userId: Id<"users">,
) {
  return new ToolLoopAgent({
    model: openai("gpt-4o-mini"),
    instructions: system,
    tools: {
      listForms: createListFormsTool(ctx, userId),
      // createForm: createCreateFormTool(ctx, userId),
    },
    stopWhen: [stepCountIs(20)],
  })
}
