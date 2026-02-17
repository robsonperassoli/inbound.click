import { mutation, action, query, internalQuery, internalMutation, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { authenticatedUser } from "./profiles";
import { formField } from "./schema";

export const createForm = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    fields: v.array(formField),
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);

    const formId = await ctx.db.insert('forms', {
      userId,
      createdAt: new Date().getUTCDate(),
      updatedAt: new Date().getUTCDate(),
      title: args.title,
      description: args.description,
      fields: args.fields,
    });

    return formId;
  }
});

export const getForm = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);


  }
});
