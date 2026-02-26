import {
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions"
import { mutation, query } from "./_generated/server"
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
