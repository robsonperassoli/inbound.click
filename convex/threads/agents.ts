// import { fireworks } from "@ai-sdk/fireworks"
import { openai } from "@ai-sdk/openai"
import { stepCountIs, ToolLoopAgent, type ToolSet } from "ai"
import { internal } from "../_generated/api"
import type { Doc, Id } from "../_generated/dataModel"
import type { ActionCtx } from "../_generated/server"
import * as agentTools from "./agents/tools"

const model = openai("gpt-4o-mini")
// const model = fireworks("accounts/fireworks/models/kimi-k2-instruct-0905")

type CreateAgentArgs =
  | {
      type: "formSubmission"
      state: string
    }
  | {
      type: "formBuilder"
      state: string
    }

export function createAgent(
  ctx: ActionCtx,
  thread: Doc<"threads">,
  args: CreateAgentArgs,
) {
  let tools: ToolSet
  switch (args.type) {
    case "formSubmission":
      tools = {
        fillForm: agentTools.createFillFormTool(ctx, thread._id),
        submitForm: agentTools.completeFormSubmission(ctx, thread._id),
      }
      break
    case "formBuilder":
      tools = {
        listForms: agentTools.createListFormsTool(ctx, thread.userId),
        createForm: agentTools.createCreateFormTool(
          ctx,
          thread.userId,
          thread._id,
        ),
        updateForm: agentTools.createUpdateFormTool(ctx, thread._id),
      }

      break
    default:
      throw new Error(`Unknown agent type`)
  }

  const instructions = `${thread.systemPrompt}\n\n${args.state}`

  return new ToolLoopAgent({
    model,
    instructions,
    tools,
    stopWhen: [stepCountIs(20)],
  })
}

export async function executeAgentLoopForThread(
  ctx: ActionCtx,
  threadId: Id<"threads">,
) {
  try {
    const result = await ctx.runQuery(internal.threads.queries.getFullChat, {
      threadId,
    })

    const state = await ctx.runQuery(internal.threads.queries.getAgentState, {
      threadId,
    })

    const agent = createAgent(ctx, result, {
      type: result.type,
      state,
    })

    const lastMessage = result.messages[result.messages.length - 1]
    if (lastMessage.status !== "pending") {
      throw new Error("Last message not in pending state")
    }

    const completionMsgs = result.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    const execResult = await agent.generate({
      messages: completionMsgs,
    })

    await ctx.runMutation(internal.threads.mutations.updateMessageContent, {
      messageId: lastMessage._id,
      content: execResult.text,
    })

    return execResult
  } catch (err) {
    console.error(err)
    return null
  }
}
