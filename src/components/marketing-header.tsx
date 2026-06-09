import { Link } from "@tanstack/react-router"
import { Authenticated, Unauthenticated } from "convex/react"
import logo from "@/assets/logo.svg"

type MarketingHeaderProps = {
  anchorLogoToTop?: boolean
  /** Match the warm paper background used on the landing page. */
  tone?: "white" | "paper"
}

export function MarketingHeader({
  anchorLogoToTop = false,
  tone = "white",
}: MarketingHeaderProps) {
  const logoContent = (
    <>
      <img src={logo} alt="Inbound.click" className="h-5 w-auto md:h-7" />
      <span className="sr-only text-sm font-semibold tracking-tight sm:text-base">
        Inbound.click
      </span>
    </>
  )

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[#2D2E2C]/8 backdrop-blur-xl ${
        tone === "paper" ? "bg-[#FBF8F3]/85" : "bg-white/85"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {anchorLogoToTop ? (
          <a href="#top" className="flex items-center gap-3">
            {logoContent}
          </a>
        ) : (
          <Link to="/" className="flex items-center gap-3">
            {logoContent}
          </Link>
        )}

        <Authenticated>
          <Link
            to="/bio"
            className="rounded-full bg-[#2D2E2C] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(45,46,44,0.24)] transition-transform hover:-translate-y-0.5"
          >
            Dashboard
          </Link>
        </Authenticated>
        <Unauthenticated>
          <div className="flex items-center gap-3">
            <Link
              to="/signin"
              className="w-20 text-center text-sm font-semibold text-[#2D2E2C]/72 transition-colors hover:text-[#2D2E2C]"
            >
              Sign In
            </Link>
            <Link
              to="/signin"
              className="rounded-full bg-[#2D2E2C] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(45,46,44,0.24)] transition-transform hover:-translate-y-0.5"
            >
              Start Free
            </Link>
          </div>
        </Unauthenticated>
      </div>
    </header>
  )
}
