import type { Id } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"

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

export async function getProfileLinks(
  ctx: MutationCtx | QueryCtx,
  profileId: Id<"profiles">,
) {
  const links = await ctx.db
    .query("links")
    .withIndex("by_profile", (q) => q.eq("profileId", profileId))
    .collect()

  return links.sort((a, b) => a.order - b.order)
}
