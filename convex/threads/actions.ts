import { v } from "convex/values"
import { internalAction } from "../_generated/server"
import { executeAgentLoopForThread } from "./agents"

export const runAgent = internalAction({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    await executeAgentLoopForThread(ctx, args.threadId)
  },
})
