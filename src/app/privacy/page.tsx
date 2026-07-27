import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SouceOS",
  description: "How SouceOS collects, uses, and protects your data.",
};

const LAST_UPDATED = "July 26, 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink bg-paper-card">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <Link
            href="/"
            className="font-display text-lg font-bold uppercase tracking-tight"
          >
            Souce<span className="text-rust">OS</span>
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
            <strong>[Legal Entity Name — e.g. &ldquo;SouceOS LLC&rdquo;, or your full legal
            name if operating as a sole proprietor]</strong> (&ldquo;SouceOS,&rdquo;
            &ldquo;we,&rdquo; &ldquo;us&rdquo;) collects, uses, and shares information when you
            use the SouceOS application and website (the &ldquo;Service&rdquo;). It applies to
            visitors, account holders, and the individuals whose data account holders enter into
            the Service. By using the Service, you agree to the collection and use of
            information as described here.
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
              <strong>Business data you provide.</strong> SouceOS is a workspace for managing
              your sourcing operations. In the ordinary course of using it, you and your team
              may enter supplier contacts, quotes, sample records and photos, purchase orders,
              production timelines, and related documents. This data belongs to you — see
              Section 8.
            </p>
            <p className="mb-3">
              <strong>Payment information.</strong> Subscription payments are processed by{" "}
              <strong>Stripe</strong>. We do not store your full card number on our servers —
              Stripe handles that directly and shares with us only what&apos;s needed to manage
              your subscription (e.g. plan, billing status, last 4 digits of your card).
            </p>
            <p className="mb-3">
              <strong>Usage and diagnostic data.</strong> Once you accept analytics cookies (see
              Section 3), we use <strong>PostHog</strong> to understand how the product is used
              (pages visited, features used, in-app events). We use <strong>Sentry</strong> to
              capture error reports when something breaks, so we can fix it — this runs
              regardless of your cookie choice, since it&apos;s necessary to keep the Service
              secure and working. Both may collect your IP address and browser/device
              information.
            </p>
            <p>
              <strong>Cookies.</strong> See Section 3 below.
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
              <li>Send service emails (confirmations, security and account notices) and, if you separately opt in, product updates;</li>
              <li>Monitor, debug, and improve product performance and reliability;</li>
              <li>Respond to support requests; and</li>
              <li>Comply with legal obligations.</li>
            </ul>
            <p className="mt-3">
              <strong>We do not sell or share your personal information</strong> (as those terms
              are defined under the CCPA/CPRA — including &ldquo;sharing&rdquo; for
              cross-context behavioral advertising) or your business data, and we have not done
              so in the preceding 12 months. We don&apos;t run ad-targeting pixels or share your
              data with data brokers or ad networks.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              3. Cookies &amp; Tracking Technologies
            </h2>
            <p className="mb-3">
              <strong>Strictly necessary.</strong> We use a session cookie (via Supabase
              authentication) required to keep you signed in and to operate core site
              functionality. This cookie can&apos;t be switched off, since the Service can&apos;t
              function without it.
            </p>
            <p className="mb-3">
              <strong>Analytics (optional).</strong> We use PostHog, which sets its own cookies
              and/or browser local storage to recognize your browser across visits. This only
              starts after you accept analytics cookies in the banner shown on your first visit.
              You can withdraw acceptance at any time by clearing your browser&apos;s local
              storage for this site, or by contacting us. Visitors who decline see no reduction
              in functionality.
            </p>
            <p>
              We currently don&apos;t serve advertising cookies or work with ad networks, so
              there is nothing to opt out of on that front; if that changes, we&apos;ll update
              this section and our cookie banner accordingly.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              4. Who We Share Information With
            </h2>
            <p className="mb-3">
              We share information only with the service providers (&ldquo;subprocessors&rdquo;)
              that help us run SouceOS, each bound by contract to use it only to provide their
              service to us and not for their own independent purposes:
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
                <strong>PostHog</strong> — product analytics (only if you accept analytics
                cookies)
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
              law, to protect our rights or the safety of others, or in connection with a
              merger, acquisition, or sale of assets (with notice to you where required). None
              of this is a &ldquo;sale&rdquo; or &ldquo;share&rdquo; of your data under
              applicable privacy law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              5. Data Retention
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
              6. California Privacy Rights (CCPA/CPRA)
            </h2>
            <p className="mb-3">
              If you&apos;re a California resident, in the preceding 12 months we&apos;ve
              collected the following categories of personal information, for the business
              purposes described in Section 2: identifiers (name, email, IP address); account
              credentials; commercial information (subscription plan, billing history);
              internet/network activity (product usage events, once you accept analytics
              cookies); and, in your business data, information about third parties you enter
              (e.g. supplier contacts) that you are responsible for having the right to store.
              We do not collect or infer sensitive personal information as CCPA defines it
              beyond account login credentials, and we don&apos;t use those credentials for any
              purpose beyond authenticating you.
            </p>
            <p className="mb-3">As a California resident, you have the right to:</p>
            <ul className="ml-5 list-disc">
              <li>Know/access the specific pieces and categories of personal information we hold about you;</li>
              <li>Delete personal information we&apos;ve collected from you, subject to certain exceptions;</li>
              <li>Correct inaccurate personal information;</li>
              <li>Obtain a portable copy of your data; and</li>
              <li>Not be discriminated against for exercising any of these rights.</li>
            </ul>
            <p className="mt-3">
              We don&apos;t sell or share personal information, so there is no opt-out of sale/
              sharing to exercise. To submit a request, email us at the address in Section 14 —
              we&apos;ll verify your identity using the email address on your account and respond
              within 45 days (extendable by another 45 days for complex requests, with notice).
              You may use an authorized agent to submit a request on your behalf; we may require
              proof of that authorization.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              7. European &amp; UK Privacy Rights (GDPR)
            </h2>
            <p className="mb-3">
              If you&apos;re in the EEA, UK, or Switzerland, we process your personal data under
              the following legal bases: account and business data to <strong>perform our
              contract</strong> with you; usage/diagnostic data (analytics, error monitoring)
              based on your <strong>consent</strong> (analytics) or our <strong>legitimate
              interest</strong> in keeping the Service secure and working (error monitoring);
              and billing records to comply with our <strong>legal obligations</strong>.
            </p>
            <p className="mb-3">You have the right to:</p>
            <ul className="ml-5 list-disc">
              <li>Access the personal data we hold about you;</li>
              <li>Correct inaccurate data;</li>
              <li>Request erasure of your data;</li>
              <li>Restrict or object to certain processing;</li>
              <li>Receive your data in a portable format; and</li>
              <li>Withdraw consent at any time where processing is based on consent, without affecting processing before withdrawal.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at the address in Section 14 — we aim
              to respond within 30 days. You also have the right to lodge a complaint with your
              local data protection supervisory authority. See Section 9 for how we transfer
              data internationally.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              8. Your Business Data
            </h2>
            <p>
              The supplier, product, and production data you and your team enter into SouceOS —
              including any photos, files, or messages you upload or connect — is yours. We act
              as a processor of that data on your behalf: we don&apos;t use it to train models,
              sell it, or share it beyond what&apos;s needed to operate the Service as described
              above, and none of it is ever made public or visible outside your workspace (or,
              for Agency plans, the client workspaces you&apos;ve granted your own team access
              to). You&apos;re responsible for having the rights to any content you upload. To
              request an export or deletion of your data, contact us at the address in Section
              14 and we&apos;ll act on it within a reasonable time, subject to the retention
              exceptions in Section 5.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              9. International Data Transfers
            </h2>
            <p>
              Our service providers may process data in the United States or other countries.
              Where required, we rely on appropriate safeguards (such as Standard Contractual
              Clauses) for these transfers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              10. Security
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
              11. Children&apos;s Privacy
            </h2>
            <p>
              SouceOS is a business tool not directed at children, and we do not knowingly
              collect personal information from anyone under 16.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              12. Marketing Communications
            </h2>
            <p>
              Emails required to run your account — signup confirmations, billing receipts,
              security alerts, and service notices — aren&apos;t promotional, and you&apos;ll
              receive them as long as you have an account, since they&apos;re part of the
              Service itself. If we ever send promotional or product-update email, it will be
              sent only to users who&apos;ve opted in, will clearly identify itself as
              promotional, and will include a working unsubscribe link honored within 10
              business days, consistent with the CAN-SPAM Act. We don&apos;t currently send any
              promotional email.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              13. Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. If we make material changes,
              we&apos;ll notify you by email or through the Service before they take effect.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              14. Contact Us
            </h2>
            <p>
              Questions about this policy, or a request under Section 6, 7, or 8? Contact us at{" "}
              <a href="mailto:logancorney@icloud.com" className="text-rust underline">
                logancorney@icloud.com
              </a>{" "}
              or by mail at{" "}
              <strong>[Business mailing address]</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
