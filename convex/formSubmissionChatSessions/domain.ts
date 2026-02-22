import type { Id } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"

export const getSession = async (
  ctx: QueryCtx | MutationCtx,
  sessionId: Id<"formSubmissionChatSessions">,
) => {
  const session = await ctx.db.get("formSubmissionChatSessions", sessionId)
  if (!session) {
    throw new Error("Session not found")
  }

  return session
}
