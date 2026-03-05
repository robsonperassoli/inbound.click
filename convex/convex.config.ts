import betterAuth from "@convex-dev/better-auth/convex.config"
import migrations from "@convex-dev/migrations/convex.config"
import resend from "@convex-dev/resend/convex.config.js"
import stripe from "@convex-dev/stripe/convex.config.js"

import { defineApp } from "convex/server"

const app = defineApp()
app.use(betterAuth)
app.use(migrations)
app.use(stripe)
app.use(resend)

export default app
