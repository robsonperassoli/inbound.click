import { createFileRoute, Link } from "@tanstack/react-router"
import logo from "../assets/logo.svg"

export const Route = createFileRoute("/privacy")({
  head: () => {
    const title = "Privacy Policy | Inbound.click"
    const description =
      "Read the Privacy Policy to learn how HUGO CRM LLC collects, uses, and protects your information when you use Inbound.click."
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    }
  },
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#2D2E2C]">
      <header className="sticky top-0 z-50 border-b border-[#2D2E2C]/8 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Inbound.click" className="h-5 w-auto md:h-7" />
            <span className="sr-only text-sm font-semibold tracking-tight sm:text-base">
              Inbound.click
            </span>
          </Link>
          <Link
            to="/signin"
            className="rounded-full bg-[#2D2E2C] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(45,46,44,0.24)] transition-transform hover:-translate-y-0.5"
          >
            Start Free
          </Link>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-lg mx-auto max-w-3xl text-[#2D2E2C]">
          <h1 className="text-4xl font-bold tracking-tight text-[#2D2E2C]">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#2D2E2C]/60">
            Effective Date: April 14, 2026
          </p>

          <h2>1. Introduction</h2>
          <p>
            HUGO CRM LLC respects your privacy. This Privacy Policy explains how
            we collect, use, share, and protect information when you use
            Inbound.click.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            <strong>Account Information:</strong> When you register, we collect
            your name, email, and profile picture via our authentication
            provider (WorkOS AuthKit).
          </p>
          <p>
            <strong>Customer Content:</strong> Content you create, upload, or
            submit, including profile data, links, forms, uploaded images,
            themes, and chat messages.
          </p>
          <p>
            <strong>Visitor and Lead Data:</strong> When visitors interact with
            your public pages, we collect form submissions, chat messages, and
            contact details they provide.
          </p>
          <p>
            <strong>Usage and Analytics:</strong> We use cookies and similar
            technologies to track visitor activity. Our analytics providers
            include PostHog and Tinybird.
          </p>
          <p>
            <strong>Payment Information:</strong> Payments are processed by
            Stripe. We store Stripe customer IDs and subscription status, not
            full payment card details.
          </p>

          <h2>3. How We Use Information</h2>
          <p>
            We use collected information to: provide and improve the Platform;
            process transactions; generate AI-powered content using OpenAI; send
            transactional emails via Resend; analyze usage patterns; ensure
            security; and comply with legal obligations.
          </p>

          <h2>4. Cookies and Tracking Technologies</h2>
          <p>
            We set a visitor_id cookie on public pages for analytics and to
            distinguish unique visitors. You can manage cookies through your
            browser settings. Disabling cookies may limit certain features.
          </p>

          <h2>5. How We Share Information</h2>
          <p>
            We share data with service providers necessary to operate the
            Platform: WorkOS (authentication), Stripe (payments), Resend
            (email), OpenAI (AI features), Convex (hosting/database), and
            PostHog/Tinybird (analytics). We may disclose information if
            required by law or to protect our rights.
          </p>

          <h2>6. Public Content</h2>
          <p>
            Content you publish via your public profile pages is visible to
            anyone with the link. You control what information is displayed and
            collected from visitors.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            We retain your information as long as your account is active or as
            needed to provide services. You can request deletion of your account
            and associated data by contacting us. Some data may be retained for
            legal, security, or business purposes.
          </p>

          <h2>8. Security</h2>
          <p>
            We implement reasonable technical and organizational measures to
            protect your data. No method of transmission over the internet is
            100% secure.
          </p>

          <h2>9. Your Rights and Choices</h2>
          <p>
            Depending on your jurisdiction, you may have rights to access,
            correct, delete, or restrict processing of your personal data.
            Contact us to exercise these rights.
          </p>

          <h2>10. International Processing</h2>
          <p>
            Our service providers may process data in various countries. By
            using the Platform, you consent to this international transfer of
            information.
          </p>

          <h2>11. Children’s Privacy</h2>
          <p>
            The Platform is not intended for children under 18. We do not
            knowingly collect personal information from children.
          </p>

          <h2>12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy. Changes will be posted on this
            page with an updated effective date.
          </p>

          <h2>13. Contact Us</h2>
          <p>
            For privacy questions, contact:{" "}
            <a
              href="mailto:contact@inbound.click"
              className="text-[#2D2E2C] underline"
            >
              contact@inbound.click
            </a>
          </p>
        </div>
      </main>

      <footer className="border-t border-[#2D2E2C]/8 bg-white/75">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="text-sm text-[#2D2E2C]/62">
            © {new Date().getFullYear()} HUGO CRM LLC. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <Link
              to="/terms"
              className="text-[#2D2E2C]/72 hover:text-[#2D2E2C]"
            >
              Terms of Service
            </Link>
            <Link to="/" className="text-[#2D2E2C]/72 hover:text-[#2D2E2C]">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
