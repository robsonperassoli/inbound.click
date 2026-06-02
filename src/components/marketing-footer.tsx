import { Link } from "@tanstack/react-router"
import logo from "@/assets/logo.svg"

export function MarketingFooter() {
  return (
    <footer className="border-t border-black/[0.06] bg-[#FAFAF8]">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <img src={logo} alt="Inbound.click" className="h-6 w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-[#7C7A71]">
              Turn every social profile into a conversation that captures and
              qualifies leads automatically.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterColumn title="Product">
              <FooterAnchor href="#how-it-works">How it works</FooterAnchor>
              <FooterAnchor href="#demo">Live demo</FooterAnchor>
              <FooterLink to="/pricing">Pricing</FooterLink>
            </FooterColumn>
            <FooterColumn title="Use cases">
              <FooterLink to="/real-estate-agents">For realtors</FooterLink>
              <FooterAnchor href="#use-cases">For coaches</FooterAnchor>
              <FooterAnchor href="#use-cases">For agencies</FooterAnchor>
            </FooterColumn>
            <FooterColumn title="Company">
              <FooterLink to="/signin">Start free</FooterLink>
              <FooterLink to="/terms">Terms</FooterLink>
              <FooterLink to="/privacy">Privacy</FooterLink>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3 border-t border-black/[0.06] pt-6">
          <span className="flex items-center gap-1" aria-hidden>
            <span className="h-1.5 w-6 rounded-full bg-[#EE775F]" />
            <span className="h-1.5 w-4 rounded-full bg-[#F8C751]" />
            <span className="h-1.5 w-3 rounded-full bg-[#69D0B2]" />
          </span>
          <p className="text-sm text-[#9C9A90]">
            © {new Date().getFullYear()} Inbound.click. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#9C9A90]">
        {title}
      </p>
      <ul className="mt-3 space-y-2.5">{children}</ul>
    </div>
  )
}

function FooterLink({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm font-medium text-[#56554E] transition-colors hover:text-[#2D2D2D]"
      >
        {children}
      </Link>
    </li>
  )
}

function FooterAnchor({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <li>
      <a
        href={href}
        className="text-sm font-medium text-[#56554E] transition-colors hover:text-[#2D2D2D]"
      >
        {children}
      </a>
    </li>
  )
}
