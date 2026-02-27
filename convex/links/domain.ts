import type { Id } from "../_generated/dataModel"
import type { MutationCtx } from "../_generated/server"

type CreateFormLinkArgs = {
  userId: Id<"users">
  profileId: Id<"profiles">
  title: string
  formId: Id<"forms">
}

export async function createFormLink(
  ctx: MutationCtx,
  { userId, profileId, title, formId }: CreateFormLinkArgs,
) {
  await ctx.db.insert("links", {
    userId,
    profileId,
    title,
    order: 0,
    active: true,
    type: "form",
    formId,
  })
}
