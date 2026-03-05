import { v } from "convex/values"
import { userAction, userMutation } from "./custom"

export const generateUploadUrl = userMutation({
  handler: async (ctx, _args) => {
    return await ctx.storage.generateUploadUrl()
  },
})

export const getFileUrl = userAction({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId)
  },
})
