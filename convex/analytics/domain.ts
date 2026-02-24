import { type Infer, v } from "convex/values"
import type { MutationCtx } from "../_generated/server"
import { linkClickFields, pageViewFields } from "./validators"

const pageViewObject = v.object(pageViewFields)
const linkClickObject = v.object(linkClickFields)

type CreateEventArgs =
  | Infer<typeof pageViewObject>
  | Infer<typeof linkClickObject>

export async function createEvent(ctx: MutationCtx, args: CreateEventArgs) {
  await ctx.db.insert("events", args)
}
