import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useConvexAuth } from "convex/react"
import { useEffect, useState } from "react"
import logo from "@/assets/logo.svg"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/signin")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const navigate = useNavigate()

  const [activeProvider, setActiveProvider] = useState<"google" | null>(null)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: "/bio" })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading || isAuthenticated) return null

  const handleSignIn = async (provider: "google") => {
    setActiveProvider(provider)
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/bio",
        newUserCallbackURL: "/onboarding",
      })
    } finally {
      setActiveProvider(null)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(145deg,_#f7fbff_0%,_#ebf3ff_45%,_#f8f9fc_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-9rem] left-[-5rem] h-72 w-72 rounded-full bg-[#7fb800]/20 blur-3xl" />
        <div className="absolute right-[-8rem] bottom-[-10rem] h-96 w-96 rounded-full bg-[#00a6ed]/20 blur-3xl" />
        <div className="absolute top-[10%] right-[14%] h-24 w-24 rounded-3xl border border-primary/10 bg-white/40 rotate-12" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <div className="max-w-md space-y-5">
            <p className="inline-flex rounded-full border border-primary/15 bg-white/70 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Turn Social Traffic Into Leads
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Capture more leads from your social audience.
            </h1>
            <p className="text-base leading-relaxed text-foreground/65">
              Build customizable bio pages and lead forms in minutes, then share
              one link everywhere your audience already is.
            </p>

            <ol className="space-y-4 pt-2">
              <Step
                number="1"
                title="Set up your bio page"
                description="Add your links and social profiles."
              />
              <Step
                number="2"
                title="Share it everywhere"
                description="Post your link on Instagram, TikTok, YouTube, and more."
              />
              <Step
                number="3"
                title="Let your agent collect leads"
                description="Inbound captures and organizes lead data for you."
              />
            </ol>
          </div>
        </section>

        <Card className="animate-in fade-in zoom-in-95 relative z-10 mx-auto w-full max-w-md border border-primary/15 bg-card/92 py-7 shadow-[0_24px_64px_-24px_rgba(13,44,84,0.35)] backdrop-blur-md duration-300">
          <CardHeader className="items-center pb-4 text-center">
            <img
              src={logo}
              alt="Inbound.click logo"
              className="mx-auto mb-3 h-auto w-[14.5rem] max-w-full"
            />
            <CardTitle className="text-3xl tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="max-w-sm text-balance text-base">
              Sign in to manage your bio links, forms, and analytics.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3.5">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 w-full justify-center gap-2 border border-black/5 bg-white/70 text-sm font-medium hover:bg-white"
              disabled={activeProvider !== null}
              onClick={() => void handleSignIn("google")}
            >
              {activeProvider === "google" ? (
                <Spinner />
              ) : (
                <GoogleIcon className="size-4" />
              )}
              Continue with Google
            </Button>

            <p className="pt-2 text-center text-xs text-muted-foreground">
              By continuing, you agree to authenticate with your selected
              provider.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {number}
      </span>
      <div className="space-y-0.5">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </li>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <path
        d="M21.6 12.227c0-.709-.064-1.391-.182-2.045H12v3.873h5.391a4.61 4.61 0 0 1-2.001 3.019v2.505h3.236c1.894-1.745 2.974-4.32 2.974-7.352Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.964-.895 6.619-2.421l-3.236-2.505c-.895.6-2.041.955-3.383.955-2.6 0-4.8-1.755-5.591-4.114H3.073v2.584A9.999 9.999 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.409 13.915A6.01 6.01 0 0 1 6.1 12c0-.664.114-1.31.309-1.915V7.5H3.073A10 10 0 0 0 2 12c0 1.614.386 3.146 1.073 4.499l3.336-2.584Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.971c1.468 0 2.791.505 3.828 1.496l2.873-2.873C16.964 2.973 14.7 2 12 2A9.999 9.999 0 0 0 3.073 7.5l3.336 2.584C7.2 7.726 9.4 5.971 12 5.971Z"
        fill="#EA4335"
      />
    </svg>
  )
}
