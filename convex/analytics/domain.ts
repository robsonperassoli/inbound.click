import type { Infer } from "convex/values"
import type { MutationCtx } from "../_generated/server"
import type { eventsSchema } from "./validators"

type CreateEventArgs = Infer<typeof eventsSchema>

export async function createEvent(ctx: MutationCtx, args: CreateEventArgs) {
  await ctx.db.insert("events", args)
}
