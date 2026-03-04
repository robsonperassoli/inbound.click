import {
  customAction,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions"
import { internal } from "./_generated/api"
import type { Doc } from "./_generated/dataModel"
import { action, mutation, query } from "./_generated/server"
import { getAuthUser } from "./users/domain"

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const user = await getAuthUser(ctx)

    return { ctx: { user }, args }
  },
})

export const userQuery = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const user = await getAuthUser(ctx)

    return { ctx: { user }, args }
  },
})

export const userAction = customAction(action, {
  args: {},
  input: async (ctx, args) => {
    const user: Doc<"users"> = await ctx.runQuery(
      internal.auth.getCurrentUserInternal,
      {},
    )

    return { ctx: { user }, args }
  },
})
