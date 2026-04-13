import type { ConvexQueryClient } from "@convex-dev/react-query"
import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { createServerFn } from "@tanstack/react-start"
import { getAuth } from "@workos/authkit-tanstack-react-start"
import type { ConvexReactClient } from "convex/react"
import { PostHogErrorBoundary, PostHogProvider } from "posthog-js/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import appCss from "../styles.css?url"

const fetchWorkosAuth = createServerFn({ method: "GET" }).handler(async () => {
  const auth = await getAuth()
  const { user } = auth

  return {
    userId: user?.id ?? null,
    token: user ? auth.accessToken : null,
  }
})

interface AppContext {
  convexClient: ConvexReactClient
  convexQueryClient: ConvexQueryClient
  queryClient: QueryClient
}

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2026-01-30",
} as const

export const Route = createRootRouteWithContext<AppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "Inbound",
      },
      {
        title: "Inbound.Click",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon-96x96.png",
        sizes: "96x96",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "shortcut icon",
        href: "/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
    ],
  }),
  beforeLoad: async (ctx) => {
    const { userId, token } = await fetchWorkosAuth()

    // During SSR only (the only time serverHttpClient exists),
    // set the WorkOS auth token to make HTTP queries with.
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)
    }

    return { userId, token }
  },
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <PostHogProvider
          apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
          options={options}
        >
          <PostHogErrorBoundary>
            <TooltipProvider>{children}</TooltipProvider>
          </PostHogErrorBoundary>
        </PostHogProvider>
        <TanStackDevtools
          config={{
            position: "bottom-left",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />

        <Scripts />
      </body>
    </html>
  )
}
