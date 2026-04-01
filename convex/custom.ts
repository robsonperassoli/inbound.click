import {
  customAction,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions"
import { internal } from "./_generated/api"
import { action, mutation, query } from "./_generated/server"
import { getUserScope } from "./users/domain"

type UserScope = Awaited<ReturnType<typeof getUserScope>>

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const scope = await getUserScope(ctx)

    return { ctx: scope, args }
  },
})

export const userQuery = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const scope = await getUserScope(ctx)

    return { ctx: scope, args }
  },
})

export const userAction = customAction(action, {
  args: {},
  input: async (ctx, args) => {
    const scope: UserScope = await ctx.runQuery(
      internal.auth.getCurrentScopeInternal,
      {},
    )

    return { ctx: scope, args }
  },
})

const TEAM_ADMIN_ROLES = ["owner", "admin"] as const

export const teamAdminMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const scope = await getUserScope(ctx)

    if (scope.account.type !== "team") {
      throw new Error("Only team accounts can perform this action")
    }

    if (!TEAM_ADMIN_ROLES.includes(scope.role as "owner" | "admin")) {
      throw new Error("Only owners and admins can perform this action")
    }

    return { ctx: scope, args }
  },
})
