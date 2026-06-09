import { Link } from "@tanstack/react-router"

export function MarketingFooter() {
  return (
    <footer className="border-t border-[#2D2E2C]/8 bg-white/75">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p className="text-sm text-[#2D2E2C]/62">
          Inbound.click turns social traffic into qualified leads.{" "}
          <span translate="no" className="whitespace-nowrap">
            s.uper.bio
          </span>{" "}
          pages are made with Inbound.click.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
          <Link to="/real-estate-agents" className="text-[#2D2E2C]">
            For Realtors
          </Link>
          <Link to="/signin" className="text-[#2D2E2C]/72">
            Start Free
          </Link>
          <Link to="/pricing" className="text-[#2D2E2C]/72">
            Pricing
          </Link>
          <Link to="/terms" className="text-[#2D2E2C]/72">
            Terms
          </Link>
          <Link to="/privacy" className="text-[#2D2E2C]/72">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
