import migrations from "@convex-dev/migrations/convex.config"
import resend from "@convex-dev/resend/convex.config.js"
import stripe from "@convex-dev/stripe/convex.config.js"
import workOSAuthKit from "@convex-dev/workos-authkit/convex.config"

import { defineApp } from "convex/server"

const app = defineApp()
app.use(workOSAuthKit)
app.use(migrations)
app.use(stripe)
app.use(resend)

export default app
