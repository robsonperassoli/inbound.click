import { stepCountIs, tool, ToolLoopAgent } from "ai";
import { openai } from '@ai-sdk/openai'
import { z } from "zod/v4";
import { ActionCtx, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

function createTool(ctx: ActionCtx, formSubmissionChatSessionId: Id<'formSubmissionChatSessions'>) {
  return tool({
    description: 'Fill form fields with data',
    inputSchema: z.object({
      values: z.array(
          z.object({
            fieldId: z.string().describe('The ID of the form field to fill'),
            value: z.union([
              z.string(),
              z.number(),
              z.array(z.string()),
              z.boolean()
            ]).describe('The value to fill the field with')
          })
        )
    }),
    execute: async (args) => {
      const values = args.values.reduce((acc, v) => ({
        ...acc,
        [v.fieldId]: v.value
      }), {})

      await ctx.runMutation(internal.forms.fillForm, {
        formSubmissionChatSessionId,
        values
      })
    },
  })
}

export function createFormSubmissionAgent(ctx: ActionCtx, system: string, formSubmissionChatSessionId: Id<'formSubmissionChatSessions'>) {
  return new ToolLoopAgent({
    model: openai("gpt-4o-mini"),
    instructions: system,
    tools: {
      fillForm: createTool(ctx, formSubmissionChatSessionId)
    },
    stopWhen: [
      stepCountIs(20),
    ]
  });
}

export const runFormSubmissionAgent = internalAction({
  args: {
    formSubmissionChatSessionId: v.id('formSubmissionChatSessions'),
    chatId: v.id('chats'),
    state: v.string()
  },
  handler: async (ctx, args) => {
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

    const system = `${result.chat.systemPrompt}\n\n${args.state ?? ''}`


    const agent = createFormSubmissionAgent(ctx, system, args.formSubmissionChatSessionId);

    const { text } = await agent.generate({
      messages: completionMsgs,
    });

    await ctx.runMutation(internal.chats.updateMessageContent, {
      messageId: lastMessage._id,
      content: text
    })

    return text;
  }
})
