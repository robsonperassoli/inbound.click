import { redirect } from "@tanstack/react-router"
import { getAuth, getSignInUrl } from "@workos/authkit-tanstack-react-start"

export async function ensureAuthenticated(returnPathname: string) {
  const { user } = await getAuth()

  if (!user) {
    const href = await getSignInUrl({ data: { returnPathname } })
    throw redirect({ href })
  }
}
