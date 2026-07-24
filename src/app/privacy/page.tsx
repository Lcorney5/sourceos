import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SourceOS",
  description: "How SourceOS collects, uses, and protects your data.",
};

const LAST_UPDATED = "July 23, 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink bg-paper-card">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <Link
            href="/"
            className="font-display text-lg font-bold uppercase tracking-tight"
          >
            Source<span className="text-rust">OS</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-2 font-display text-3xl font-bold uppercase tracking-tight">
          Privacy Policy
        </h1>
        <p className="mb-10 font-mono text-xs uppercase tracking-widest text-muted">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="flex flex-col gap-8 text-sm leading-relaxed">
          <p>
            This Privacy Policy explains how{" "}
            <strong>[Legal Entity Name — e.g. &ldquo;SourceOS LLC&rdquo;, or your full legal
            name if operating as a sole proprietor]</strong> (&ldquo;SourceOS,&rdquo;
            &ldquo;we,&rdquo; &ldquo;us&rdquo;) collects, uses, and shares information when you
            use the SourceOS application and website (the &ldquo;Service&rdquo;). By using the
            Service, you agree to the collection and use of information as described here.
          </p>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              1. Information We Collect
            </h2>
            <p className="mb-3">
              <strong>Account information.</strong> When you sign up, we collect your name,
              email address, and password (or, if you use &ldquo;Continue with Google,&rdquo;
              the basic profile information Google provides).
            </p>
            <p className="mb-3">
              <strong>Business data you provide.</strong> SourceOS is a workspace for managing
              your sourcing operations. In the ordinary course of using it, you and your team
              may enter supplier contacts, quotes, sample records and photos, purchase orders,
              production timelines, and related documents. This data belongs to you — see
              Section 6.
            </p>
            <p className="mb-3">
              <strong>Payment information.</strong> Subscription payments are processed by{" "}
              <strong>Stripe</strong>. We do not store your full card number on our servers —
              Stripe handles that directly and shares with us only what&apos;s needed to manage
              your subscription (e.g. plan, billing status, last 4 digits of your card).
            </p>
            <p className="mb-3">
              <strong>Messaging data.</strong> If you connect WhatsApp Business messaging, we
              process the messages and metadata needed to display that communication history
              inside SourceOS, via <strong>Twilio</strong>.
            </p>
            <p className="mb-3">
              <strong>Usage and diagnostic data.</strong> We use <strong>PostHog</strong> to
              understand how the product is used (pages visited, features used, in-app events)
              and <strong>Sentry</strong> to capture error reports when something breaks, so we
              can fix it. Both may collect your IP address and browser/device information.
            </p>
            <p>
              <strong>Cookies.</strong> We use cookies required to keep you signed in and to
              operate core site functionality (via Supabase authentication).
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              2. How We Use Information
            </h2>
            <p>We use the information described above to:</p>
            <ul className="ml-5 mt-2 list-disc">
              <li>Provide, operate, and maintain the Service;</li>
              <li>Process subscription payments and manage billing;</li>
              <li>Send transactional emails (confirmations, billing receipts, product notices);</li>
              <li>Monitor, debug, and improve product performance and reliability;</li>
              <li>Respond to support requests; and</li>
              <li>Comply with legal obligations.</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information or your business data to third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              3. Who We Share Information With
            </h2>
            <p className="mb-3">
              We share information only with the service providers (&ldquo;subprocessors&rdquo;)
              that help us run SourceOS, each bound to use it only to provide their service to
              us:
            </p>
            <ul className="ml-5 list-disc">
              <li>
                <strong>Supabase</strong> — database hosting, authentication
              </li>
              <li>
                <strong>Vercel</strong> — application hosting
              </li>
              <li>
                <strong>Stripe</strong> — payment processing
              </li>
              <li>
                <strong>Twilio</strong> — WhatsApp Business messaging
              </li>
              <li>
                <strong>PostHog</strong> — product analytics
              </li>
              <li>
                <strong>Sentry</strong> — error monitoring
              </li>
              <li>
                <strong>Resend</strong> — transactional email delivery
              </li>
            </ul>
            <p className="mt-3">
              If you use a <strong>multi-client Agency workspace</strong>, your clients&apos;
              data is visible to the team members you grant access to within that workspace —
              you control those permissions. We may also disclose information if required by
              law, or in connection with a merger, acquisition, or sale of assets (with notice
              to you where required).
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              4. Data Retention
            </h2>
            <p>
              We retain account and business data for as long as your account is active. If you
              close your account, we delete or anonymize your personal data within a reasonable
              period, except where we&apos;re required to keep it longer (e.g. billing records
              for tax purposes).
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              5. Your Rights
            </h2>
            <p className="mb-3">
              Depending on where you live (e.g. the EU/UK under GDPR, or California under
              CCPA/CPRA), you may have the right to:
            </p>
            <ul className="ml-5 list-disc">
              <li>Access the personal data we hold about you;</li>
              <li>Correct inaccurate data;</li>
              <li>Request deletion of your data;</li>
              <li>Export your data in a portable format;</li>
              <li>Object to or restrict certain processing; and</li>
              <li>Withdraw consent where processing is based on consent.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at the email below.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              6. Your Business Data Belongs to You
            </h2>
            <p>
              The supplier, product, and production data you and your team enter into SourceOS
              is yours. We act as a processor of that data on your behalf — we don&apos;t use it
              to train models, sell it, or share it beyond what&apos;s needed to operate the
              Service as described above. You can export or delete it at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              7. Security
            </h2>
            <p>
              We use industry-standard safeguards (encryption in transit, database-level access
              controls, and row-level security isolating each workspace&apos;s data) to protect
              your information. No method of transmission or storage is 100% secure, and we
              can&apos;t guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              8. International Data Transfers
            </h2>
            <p>
              Our service providers may process data in the United States or other countries.
              Where required, we rely on appropriate safeguards (such as Standard Contractual
              Clauses) for these transfers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              9. Children&apos;s Privacy
            </h2>
            <p>
              SourceOS is a business tool not directed at children, and we do not knowingly
              collect personal information from anyone under 16.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. If we make material changes,
              we&apos;ll notify you by email or through the Service before they take effect.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              11. Contact Us
            </h2>
            <p>
              Questions about this policy or your data? Contact us at{" "}
              <a href="mailto:logancorney@icloud.com" className="text-rust underline">
                logancorney@icloud.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
