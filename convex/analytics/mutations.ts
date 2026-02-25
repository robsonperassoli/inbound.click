import { mutation } from "../_generated/server"
import * as events from "./domain"
import { linkClickFields, pageViewFields } from "./validators"

// TODO: Convert mutations to actions and use scheduler to run in the background
export const trackPageView = mutation({
  args: pageViewFields,
  handler: async (ctx, args) => {
    await events.createEvent(ctx, args)
  },
})

export const trackLinkClick = mutation({
  args: linkClickFields,
  handler: async (ctx, args) => {
    await events.createEvent(ctx, args)
  },
})
