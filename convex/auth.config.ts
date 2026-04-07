import type { AuthConfig } from "convex/server"
import { authKit } from "./auth"

export default {
  providers: authKit.getAuthConfigProviders(),
} satisfies AuthConfig
