import { Link } from "@tanstack/react-router"
import { Authenticated, Unauthenticated } from "convex/react"
import logo from "@/assets/logo.svg"

type MarketingHeaderProps = {
  anchorLogoToTop?: boolean
}

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#use-cases", label: "Use cases" },
  { href: "#demo", label: "Live demo" },
]

export function MarketingHeader({
  anchorLogoToTop = false,
}: MarketingHeaderProps) {
  const logoContent = (
    <>
      <img src={logo} alt="Inbound.click" className="h-5 w-auto sm:h-6" />
      <span className="sr-only">Inbound.click</span>
    </>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#FAFAF8]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {anchorLogoToTop ? (
          <a href="#top" className="flex items-center">
            {logoContent}
          </a>
        ) : (
          <Link to="/" className="flex items-center">
            {logoContent}
          </Link>
        )}

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#56554E] transition-colors hover:text-[#2D2D2D]"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/pricing"
            className="text-sm font-medium text-[#56554E] transition-colors hover:text-[#2D2D2D]"
          >
            Pricing
          </Link>
        </nav>

        <Authenticated>
          <Link
            to="/bio"
            className="rounded-full bg-[#2D2D2D] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1f1f1f]"
          >
            Dashboard
          </Link>
        </Authenticated>
        <Unauthenticated>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/signin"
              className="hidden px-3 text-sm font-semibold text-[#56554E] transition-colors hover:text-[#2D2D2D] sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              to="/signin"
              className="rounded-full bg-[#EE775F] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(238,119,95,0.7)] transition-all hover:bg-[#E45F49] hover:shadow-[0_14px_28px_-8px_rgba(238,119,95,0.8)]"
            >
              Start free
            </Link>
          </div>
        </Unauthenticated>
      </div>
    </header>
  )
}
