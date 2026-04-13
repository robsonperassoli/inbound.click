import { superUserQuery } from "./custom"

export const listUsers = superUserQuery({
  args: {},
  handler: async (ctx) => {
    const [users, memberships] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("accountMembers").collect(),
    ])

    const membershipsByUserId = new Map(
      memberships.map((membership) => [membership.userId, membership]),
    )
    const roleOrder = { owner: 0, admin: 1, member: 2 } as const

    return users
      .map((user) => {
        const membership = membershipsByUserId.get(user._id)
        if (!membership) {
          throw new Error("Users is not linked to an account")
        }

        const role = membership.role

        return {
          userId: user._id,
          accountId: membership?.accountId ?? null,
          name: user.name ?? user.email ?? "Unknown user",
          email: user.email ?? "",
          role,
          canSetupStripe: role === "owner",
        }
      })
      .sort((a, b) => {
        const byRole = roleOrder[a.role] - roleOrder[b.role]
        if (byRole !== 0) {
          return byRole
        }

        const byName = a.name.localeCompare(b.name)
        if (byName !== 0) {
          return byName
        }

        return a.email.localeCompare(b.email)
      })
  },
})
