import { createFileRoute, redirect } from "@tanstack/react-router"
import z from "zod"
import { getSafeAuthRedirect } from "@/lib/auth-redirect"

export const Route = createFileRoute("/signin/complete")({
  ssr: false,
  validateSearch: {
    parse: z.object({ redirect: z.string().optional() }).parse,
  },
  beforeLoad: ({ search }) => {
    throw redirect({
      href: getSafeAuthRedirect(search.redirect),
      reloadDocument: true,
    })
  },
})
