import { registerRoutes } from "@convex-dev/stripe"
import { httpRouter } from "convex/server"
import { components } from "./_generated/api"
import { httpAction } from "./_generated/server"
import { authComponent, createAuth } from "./auth"
import { resend } from "./emails"

const http = httpRouter()

authComponent.registerRoutes(http, createAuth)

// Register Stripe webhook handler at /stripe/webhook
registerRoutes(http, components.stripe, {
  webhookPath: "/stripe/webhook",
})

http.route({
  path: "/resend/webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return await resend.handleResendEventWebhook(ctx, req)
  }),
})

export default http
