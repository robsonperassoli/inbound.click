import type { AuthFunctions, GenericCtx } from "@convex-dev/better-auth"
import { createClient } from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import { betterAuth } from "better-auth/minimal"
import { v } from "convex/values"
import { components, internal } from "./_generated/api"
import type { DataModel, Doc, Id } from "./_generated/dataModel"
import {
  type ActionCtx,
  internalQuery,
  type MutationCtx,
  type QueryCtx,
  query,
} from "./_generated/server"
import authConfig from "./auth.config"
import { SITE_URL } from "./frontend"
import { getAuthUser } from "./users/domain"

const authFunctions: AuthFunctions = internal.auth

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      onCreate: async (ctx, doc) => {
        await ctx.db.insert("users", {
          authId: doc._id,
        })
      },
      onUpdate: async (ctx, newDoc, oldDoc) => {
        // Both old and new documents are available so you can compare and detect
        // changes - you can ignore oldDoc if you don't need it.
      },
      onDelete: async (ctx, doc) => {
        // The entire deleted document is available
      },
    },
  },
})

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: SITE_URL,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders: {
      google: {
        enabled: true,
        clientId: process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      },
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex({ authConfig }),
    ],
  })
}

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi()

// TODO: move this to my own internal user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx)
  },
})

export const getCurrentUserInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx)
    return user
  },
})

export const getUserByIdInternal = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get("users", userId)
  },
})

export const authenticatedUser = async (
  ctx: MutationCtx | ActionCtx | QueryCtx,
) => {
  const user: Doc<"users"> = await ctx.runQuery(
    internal.auth.getCurrentUserInternal,
  )

  return user?._id
}

export const getUserDetails = async (
  ctx: MutationCtx | ActionCtx | QueryCtx,
  userId: Id<"users">,
) => {
  const user = await ctx.runQuery(internal.auth.getUserByIdInternal, { userId })
  if (!user) {
    throw new Error("User not found")
  }

  const authUser = await authComponent.getAnyUserById(ctx, user.authId!)

  if (!authUser) {
    throw new Error("Auth User not found")
  }

  return {
    name: authUser.name,
    email: authUser.email,
  }
}
