import { v } from "convex/values"
import { userMutation } from "../custom"
import { memberRole } from "./validators"

export const inviteUser = userMutation({
  args: {
    email: v.string(),
    role: memberRole,
    profiles: v.array(v.union(v.literal("all"), v.id("profiles"))),
  },
  handler: async (ctx, args) => {},
})
