import { createFileRoute, Link } from "@tanstack/react-router"
import logo from "../assets/logo.svg"

export const Route = createFileRoute("/terms")({
  head: () => {
    const title = "Terms of Service | Inbound.click"
    const description =
      "Read the Terms of Service for using Inbound.click, the AI-powered link-in-bio and lead capture platform provided by HUGO CRM LLC."

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
  component: TermsPage,
})

function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-[#2D2E2C]/60">
            Effective Date: April 14, 2026
          </p>
          <p>
            Please read these Terms of Service (“Terms”) carefully before using
            Inbound.click (the “Platform”). These Terms constitute a binding
            agreement between you and <strong>HUGO CRM LLC</strong> (“we,” “us,”
            or “our”), a company organized under the laws of the State of
            Illinois. By accessing or using the Platform, you agree to be bound
            by these Terms. If you do not agree, do not use the Platform.
          </p>

          <h2>1. Eligibility and Account Registration</h2>
          <p>
            You must be at least 18 years old and capable of entering into a
            binding contract to use the Platform. When you register, you agree
            to provide accurate, current, and complete information and to keep
            it updated. You are responsible for maintaining the confidentiality
            of your account credentials and for all activity under your account.
            Notify us immediately of any unauthorized use.
          </p>

          <h2>2. Subscription and Billing</h2>
          <p>
            Certain features require a paid subscription. Fees are billed in
            advance through our third-party payment processor (Stripe) and are
            non-refundable except where required by law or as expressly stated
            on the Platform. We may change pricing by providing advance notice.
            You are responsible for all taxes associated with your use. Failure
            to pay may result in suspension or termination.
          </p>

          <h2>3. Your Content and License to Us</h2>
          <p>
            You retain ownership of content you upload, create, or submit,
            including profile information, links, forms, images, themes, and
            chat transcripts (“Your Content”). By using the Platform, you grant
            us a worldwide, non-exclusive, royalty-free license to host,
            process, display, and transmit Your Content solely to operate and
            improve the Platform and provide services to you. We may use
            aggregated, anonymized data to improve our products and analyze
            trends.
          </p>

          <h2>4. Customer Responsibility for Leads and Outreach</h2>
          <p>
            You are solely responsible for how you collect, use, and communicate
            with leads and visitors through your profiles, forms, and messages.
            You represent and warrant that you:
          </p>
          <ul>
            <li>
              Have obtained all necessary consents to contact leads via email,
              SMS, WhatsApp, or other channels in compliance with applicable law
              (including TCPA, CAN-SPAM, GDPR, and local regulations);
            </li>
            <li>
              Will not send unsolicited spam, harassing messages, or unlawful
              content;
            </li>
            <li>
              Will comply with all applicable privacy, marketing, and data
              protection laws in your jurisdiction and your leads’
              jurisdictions;
            </li>
            <li>
              Will ensure all content you publish is accurate and does not
              infringe third-party rights.
            </li>
          </ul>
          <p>
            We are not responsible for your marketing practices or compliance
            with local laws. You agree to indemnify us for any claims arising
            from your outreach or content.
          </p>

          <h2>5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>
              Use the Platform for unlawful, fraudulent, or harmful purposes;
            </li>
            <li>
              Attempt to reverse engineer, scrape, or interfere with the
              Platform or its infrastructure;
            </li>
            <li>Upload malware, viruses, or other harmful code;</li>
            <li>
              Impersonate others or misrepresent your affiliation with any
              person or entity;
            </li>
            <li>
              Use automated systems to access the Platform in a manner that
              exceeds reasonable request volumes;
            </li>
            <li>
              Share account credentials or allow unauthorized access to your
              account.
            </li>
          </ul>

          <h2>6. AI Features Disclaimer</h2>
          <p>
            The Platform uses AI (including OpenAI) to generate themes, forms,
            and conversational interactions. AI outputs may be inaccurate,
            incomplete, or unsuitable for your use case. You are solely
            responsible for reviewing AI-generated content before relying on it.
            We make no representations or warranties regarding the accuracy,
            completeness, or reliability of AI outputs. Use AI features at your
            own risk.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            Inbound.click, our marks, logos, and the Platform’s look and feel
            are our property or licensed to us. Except for Your Content, all
            content and materials on the Platform are our intellectual property.
            You may not copy, modify, or distribute Platform materials without
            our prior written consent.
          </p>

          <h2>8. Termination and Suspension</h2>
          <p>
            We may suspend or terminate your access at any time, with or without
            notice, for violation of these Terms, nonpayment, security risks, or
            as required by law. Upon termination, your right to use the Platform
            ceases immediately. Certain provisions of these Terms (including
            intellectual property, disclaimers, indemnity, and liability)
            survive termination.
          </p>

          <h2>9. Disclaimers</h2>
          <p>
            THE PLATFORM AND ALL CONTENT ARE PROVIDED “AS IS” AND “AS AVAILABLE”
            WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY,
            OR OTHERWISE. WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            NON-INFRINGEMENT, AND ACCURACY. WE DO NOT WARRANT THAT THE PLATFORM
            WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT ANY DATA WILL
            BE ACCURATE OR RELIABLE. YOUR USE IS AT YOUR SOLE RISK.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL
            HUGO CRM LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
            PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL,
            ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR YOUR USE OF THE
            PLATFORM, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR
            TOTAL LIABILITY TO YOU FOR ANY CLAIM WILL NOT EXCEED THE AMOUNT YOU
            PAID TO US IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR USD 100 IF
            YOU HAVE NOT PAID.
          </p>

          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless HUGO CRM LLC and
            its affiliates, officers, directors, employees, and agents from and
            against any and all claims, liabilities, damages, losses, costs, and
            expenses (including reasonable attorneys’ fees) arising out of or
            relating to: (a) your use of the Platform; (b) Your Content; (c)
            your breach of these Terms; (d) your violation of any third-party
            right, including intellectual property or privacy rights; or (e)
            your marketing activities or outreach to leads.
          </p>

          <h2>12. Governing Law and Venue</h2>
          <p>
            These Terms are governed by the laws of the State of Illinois,
            without regard to conflict of laws principles. Any dispute arising
            under these Terms will be resolved exclusively in the state or
            federal courts located in Cook County, Illinois. You consent to the
            personal jurisdiction of such courts.
          </p>

          <h2>13. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will post the
            updated Terms on the Platform and update the “Effective Date” at the
            top. Your continued use after changes become effective constitutes
            acceptance. Material changes will be notified more prominently or
            via email where practical.
          </p>

          <h2>14. General Provisions</h2>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire
            agreement between you and us regarding the Platform. If any
            provision is held invalid, the remaining provisions remain in
            effect. Our failure to enforce any right does not waive that right.
            These Terms do not create any agency, partnership, or joint venture.
          </p>

          <h2>15. Contact</h2>
          <p>
            For questions about these Terms, contact us at:{" "}
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
              to="/privacy"
              className="text-[#2D2E2C]/72 hover:text-[#2D2E2C]"
            >
              Privacy Policy
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
