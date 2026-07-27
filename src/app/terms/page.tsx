import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SouceOS",
  description: "The terms that govern your use of SouceOS.",
};

const LAST_UPDATED = "July 26, 2026";

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mb-10 font-mono text-xs uppercase tracking-widest text-muted">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="flex flex-col gap-8 text-sm leading-relaxed">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of
            SouceOS, provided by{" "}
            <strong>[Legal Entity Name — e.g. &ldquo;SouceOS LLC&rdquo;, or your full legal
            name if operating as a sole proprietor]</strong> (&ldquo;SouceOS,&rdquo;
            &ldquo;we,&rdquo; &ldquo;us&rdquo;). By creating an account or using the Service,
            you agree to these Terms. If you&apos;re using SouceOS on behalf of a company,
            you&apos;re agreeing on that company&apos;s behalf and confirming you have the
            authority to do so.
          </p>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              1. The Service
            </h2>
            <p>
              SouceOS is a workspace for managing supplier relationships, quotes, samples,
              purchase orders, and production tracking for sourcing physical products. We may
              add, change, or remove features at any time, and may modify or discontinue the
              Service (in whole or part) with reasonable notice where the change is material.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              2. Accounts
            </h2>
            <p>
              You&apos;re responsible for the accuracy of the information you provide and for
              safeguarding your account credentials. You&apos;re responsible for all activity
              that happens under your account, including actions taken by team members you
              invite. Notify us immediately if you suspect unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              3. Subscriptions & Billing
            </h2>
            <p className="mb-3">
              SouceOS is offered on paid monthly subscription plans (currently Starter,
              Growth, and Agency). Before you subscribe, Stripe Checkout displays the plan,
              price, and billing frequency for your confirmation; by completing that checkout,
              you authorize us (via Stripe) to charge your payment method on a recurring basis
              until you cancel.
            </p>
            <ul className="ml-5 list-disc">
              <li>
                <strong>Auto-renewal.</strong> Subscriptions renew automatically each billing
                period, at the then-current price, unless canceled before the renewal date.
              </li>
              <li>
                <strong>Cancellation.</strong> You may cancel at any time, self-serve, from the
                billing portal linked in your account settings (Stripe&apos;s Customer Portal);
                cancellation takes effect at the end of the current billing period and we
                won&apos;t charge you again after that.
              </li>
              <li>
                <strong>Refunds.</strong> Except where required by law, payments are
                non-refundable, including for partial billing periods.
              </li>
              <li>
                <strong>Price changes.</strong> We&apos;ll give you reasonable advance notice
                (at least 30 days) before any price increase takes effect on your account.
              </li>
              <li>
                <strong>Free trials</strong> (if offered) convert to a paid subscription
                automatically at the end of the trial unless you cancel before it ends. If we
                ever offer a free trial of 30 days or longer, we&apos;ll send a reminder email
                before it converts to a paid subscription, consistent with applicable
                auto-renewal laws.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              4. Acceptable Use
            </h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="ml-5 list-disc">
              <li>Use the Service for any unlawful purpose or in violation of any applicable law;</li>
              <li>Attempt to gain unauthorized access to other workspaces, accounts, or systems;</li>
              <li>Interfere with or disrupt the integrity or performance of the Service;</li>
              <li>Reverse-engineer, decompile, or attempt to extract the source code of the Service, except as permitted by law; or</li>
              <li>Resell or provide the Service to third parties outside of the multi-client workspace functionality we provide for Agency plans.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              5. Your Data
            </h2>
            <p>
              You retain all rights to the data you and your team enter into SouceOS
              (&ldquo;Customer Data&rdquo;). You grant us a limited license to host, process,
              and display Customer Data solely to provide the Service to you. See our{" "}
              <Link href="/privacy" className="text-rust underline">
                Privacy Policy
              </Link>{" "}
              for how we handle it. If you use a multi-client Agency workspace, you are
              responsible for having the appropriate rights and permissions to store your
              clients&apos; data within SouceOS and for managing which team members can access
              it.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              6. User Content
            </h2>
            <p className="mb-3">
              &ldquo;User Content&rdquo; means anything you or your team upload, connect, or
              enter into the Service beyond structured business records — for example sample
              photos and uploaded documents. User Content is never
              made public or shown outside your workspace (or, for Agency plans, the client
              workspaces your own team can access) — it is not a public feed, forum, or review
              system.
            </p>
            <p className="mb-3">
              You&apos;re responsible for User Content you or your team submit, including having
              the necessary rights, licenses, and consents to store and share it through the
              Service. You agree not to upload content that infringes someone else&apos;s
              intellectual property rights or violates applicable law.
            </p>
            <p>
              If you believe User Content stored by another SouceOS customer infringes your
              copyright, send a takedown notice to the email in Section 15 with: a description
              of the copyrighted work, the material you believe infringes it and its location,
              your contact information, and a statement made in good faith under penalty of
              perjury that you&apos;re the rights holder or authorized to act on their behalf.
              We may remove or disable access to reported content and, for repeat infringement,
              terminate the responsible account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              7. Intellectual Property
            </h2>
            <p>
              SouceOS and its underlying software, design, and branding are owned by us and
              protected by intellectual property laws. These Terms don&apos;t grant you any
              rights to our trademarks, logos, or brand assets. Subject to these Terms, we
              grant you a limited, non-exclusive, non-transferable license to use the Service
              for your internal business purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              8. Third-Party Services
            </h2>
            <p>
              The Service integrates with third-party providers (including Stripe and Google
              Sign-In). Your use of those integrations is also subject to
              those providers&apos; own terms, and we&apos;re not responsible for their acts,
              omissions, or availability.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              9. Disclaimer of Warranties
            </h2>
            <p className="uppercase">
              The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
              without warranties of any kind, express or implied, including merchantability,
              fitness for a particular purpose, and non-infringement. We do not warrant that
              the service will be uninterrupted, error-free, or fully secure.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              10. Limitation of Liability
            </h2>
            <p className="uppercase">
              To the maximum extent permitted by law, SouceOS will not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or any loss of
              profits, revenue, data, or business opportunity, arising from your use of the
              service. Our total liability for any claim arising out of these terms or the
              service will not exceed the amount you paid us in the 12 months before the claim
              arose.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              11. Indemnification
            </h2>
            <p>
              You agree to indemnify and hold us harmless from any claims, damages, or expenses
              arising from your misuse of the Service or your violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              12. Termination
            </h2>
            <p>
              You may stop using the Service and cancel your subscription at any time. We may
              suspend or terminate your access if you materially breach these Terms and
              don&apos;t cure the breach within a reasonable time after notice, or immediately
              in cases of fraud, illegal activity, or security risk to the Service or other
              users.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              13. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of{" "}
              <strong>[Your State/Country]</strong>, without regard to its conflict-of-laws
              rules. Any disputes will be resolved in the courts located in{" "}
              <strong>[Your City, State]</strong>, and you consent to that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              14. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. If we make material changes,
              we&apos;ll notify you by email or through the Service before they take effect.
              Continued use of the Service after changes take effect constitutes acceptance of
              the new Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
              15. Contact Us
            </h2>
            <p>
              Questions about these Terms? Contact us at{" "}
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
