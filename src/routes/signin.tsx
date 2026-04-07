import { createFileRoute, redirect } from "@tanstack/react-router"
import { getSignInUrl } from "@workos/authkit-tanstack-react-start"

export const Route = createFileRoute('/signin')({
  loader: async () => {
    const href = await getSignInUrl({ data: {returnPathname: '/bio'}})

    throw redirect({ href })
  },
})
