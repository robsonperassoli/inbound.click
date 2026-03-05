import { Resend } from "@convex-dev/resend"
import { v } from "convex/values"
import { components } from "./_generated/api"
import { internalMutation } from "./_generated/server"

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
})

export const sendActivationEmail = internalMutation({
  args: {
    to: v.string(),
    firstName: v.string(),
    username: v.string(),
  },
  handler: async (ctx, { to, firstName, username }) => {
    await resend.sendEmail(ctx, {
      from: "Robson <robson@send.inbound.click>",
      to,
      template: {
        id: "lead-capture-activation-1",
        variables: {
          firstName,
          username,
        },
      },
    })
  },
})
