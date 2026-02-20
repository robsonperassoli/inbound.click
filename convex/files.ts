import { mutation } from "./_generated/server"

export const generateUploadUrl = mutation({
  handler: async (ctx, _args) => {
    return await ctx.storage.generateUploadUrl()
  },
})
