import {
  customAction,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions"
import { internal } from "./_generated/api"
import { action, mutation, query } from "./_generated/server"
import { getUserScope } from "./users/domain"

type UserScope = Awaited<ReturnType<typeof getUserScope>>

const TEAM_ADMIN_ROLES = ["owner", "admin"] as const

function assertTeamAdmin(scope: UserScope) {
  if (scope.account.type !== "team") {
    throw new Error("Only team accounts can perform this action")
  }

  if (!TEAM_ADMIN_ROLES.includes(scope.role as "owner" | "admin")) {
    throw new Error("Only owners and admins can perform this action")
  }
}

function assertSuperUser(scope: UserScope) {
  if (!scope.isSuperUser) {
    throw new Error("Only super users can perform this action")
  }
}

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

export const teamAdminQuery = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const scope = await getUserScope(ctx)

    assertTeamAdmin(scope)

    return { ctx: scope, args }
  },
})

export const superUserQuery = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const scope = await getUserScope(ctx)

    assertSuperUser(scope)

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

export const superUserAction = customAction(action, {
  args: {},
  input: async (ctx, args) => {
    const scope: UserScope = await ctx.runQuery(
      internal.auth.getCurrentScopeInternal,
      {},
    )

    assertSuperUser(scope)

    return { ctx: scope, args }
  },
})

export const teamAdminMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const scope = await getUserScope(ctx)

    assertTeamAdmin(scope)

    return { ctx: scope, args }
  },
})

export const superUserMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const scope = await getUserScope(ctx)

    assertSuperUser(scope)

    return { ctx: scope, args }
  },
})
