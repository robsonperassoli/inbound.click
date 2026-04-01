// import { fireworks } from "@ai-sdk/fireworks"
import {
  type OpenAILanguageModelResponsesOptions,
  openai,
} from "@ai-sdk/openai"
import {
  generateText,
  Output,
  stepCountIs,
  ToolLoopAgent,
  type ToolSet,
} from "ai"
import { internal } from "../_generated/api"
import type { Doc, Id } from "../_generated/dataModel"
import type { ActionCtx } from "../_generated/server"
import { oneShootSystemPrompt } from "./agents/designer"
import * as agentTools from "./agents/tools"

const model = openai("gpt-5.4-nano")
// const model = fireworks("accounts/fireworks/models/kimi-k2-instruct-0905")

type CreateAgentArgs =
  | {
      type: "formSubmission"
    }
  | {
      type: "formBuilder"
    }
  | {
      type: "themeDesigner"
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
      if (thread.type !== "formBuilder") {
        throw new Error(`Invalid thread type for formBuilder agent`)
      }

      tools = {
        listForms: agentTools.createListFormsTool(ctx, thread.userId),
        createForm: agentTools.createCreateFormTool(
          ctx,
          thread.userId,
          thread._id,
          thread.profileId!, //TODO: fix once profile id is not optional
        ),
        updateForm: agentTools.createUpdateFormTool(ctx, thread._id),
      }

      break

    case "themeDesigner":
      if (thread.type !== "themeDesigner") {
        throw new Error(`Invalid thread type for themeDesigner agent`)
      }

      tools = {
        updateTheme: agentTools.createUpdateThemeTool(ctx, thread.profileId),
      }

      break
    default:
      throw new Error(`Unknown agent type`)
  }

  return new ToolLoopAgent({
    model,
    instructions: thread.systemPrompt,
    tools,
    stopWhen: [stepCountIs(20)],
    providerOptions: {
      openai: {
        reasoningEffort: "medium",
        textVerbosity: "low",
      } satisfies OpenAILanguageModelResponsesOptions,
    },
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
    })

    const lastMessage = result.messages[result.messages.length - 1]
    if (lastMessage.status !== "pending") {
      throw new Error("Last message not in pending state")
    }

    const completionMsgs = result.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    const stateMessage = {
      role: "user" as const,
      content: state,
    }

    // Insert the state message before the user message
    const index = completionMsgs.length - 1
    const messagesWithState = [
      ...completionMsgs.slice(0, index),
      stateMessage,
      ...completionMsgs.slice(index),
    ]

    const execResult = await agent.generate({
      messages: messagesWithState,
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

export async function generateTheme(
  username: string,
  title: string,
  subtitle: string,
) {
  const vibeResult = await generateText({
    model: openai("gpt-5.4-nano"),
    prompt: `Give me one strong visual vibe for a link in bio page based on this profile. Keep it short, specific, and creative. Describe the overall feel, the color direction, the typography vibe, and the button style in plain English. Do not give me multiple options. Avoid generic blue startup-style themes unless it clearly fits.
    Username: ${username}
    Title: ${title}
    Subtitle: ${subtitle}
    `,
  })

  const result = await generateText({
    model: openai("gpt-5.4-mini"),
    system: oneShootSystemPrompt,
    prompt: `Please generate a theme with this vibe: ${vibeResult.text}`,
    output: Output.object({ schema: agentTools.themeSchema }),
    providerOptions: {
      openai: {
        reasoningEffort: "high",
        textVerbosity: "low",
      } satisfies OpenAILanguageModelResponsesOptions,
    },
  })

  return result.output
}
