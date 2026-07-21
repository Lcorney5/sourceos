import Link from "next/link";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { StampBadge } from "@/components/ui/stamp-badge";

const PROBLEMS = [
  {
    title: "Unreadable Quotes",
    body: "Prices, MOQs, and lead times scattered across email threads and WhatsApp screenshots — nobody can compare suppliers at a glance.",
  },
  {
    title: "Lost Samples",
    body: "Which revision did you approve? Which supplier sent it? Sample feedback lives in your camera roll, not in a system.",
  },
  {
    title: "Slipping Timelines",
    body: "Deposit due dates and delivery windows quietly pass while you're buried in a group chat, and nobody notices until it's late.",
  },
];

const FEATURES = [
  {
    name: "Suppliers",
    body: "Every supplier's contact info, MOQ, lead time, and full communication history in one record.",
  },
  {
    name: "Quotes",
    body: "Log every quote against a product and compare suppliers side by side, sorted by price, MOQ, or lead time.",
  },
  {
    name: "Samples",
    body: "Track revisions from requested to approved, with photos and feedback attached to each round.",
  },
  {
    name: "Purchase Orders",
    body: "Deposit and balance schedules with automatic past-due flags, so nothing slips through silently.",
  },
  {
    name: "Timeline",
    body: "One row per product, from quoting to delivered — see the whole production pipeline at a glance.",
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "$29",
    blurb: "1 user, up to 3 active products",
    features: ["Supplier & quote tracking"],
    featured: false,
  },
  {
    name: "Growth",
    price: "$79",
    blurb: "Up to 3 users, unlimited products",
    features: ["Full sample & PO tracking", "Timeline view", "AI quote parsing"],
    featured: true,
  },
  {
    name: "Agency",
    price: "$199",
    blurb: "Multi-client workspaces, unlimited users",
    features: ["Everything in Growth", "AI negotiation-assist", "Supplier risk flagging"],
    featured: false,
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-ink bg-paper-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <span className="font-display text-xl font-bold uppercase tracking-tight">
              Source<span className="text-rust">OS</span>
            </span>
            <p className="font-mono text-[0.625rem] uppercase tracking-widest text-muted">
              Production &amp; Sourcing Manifest
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-ink hover:text-rust"
            >
              Log In
            </Link>
            <Link href="#waitlist" className="stamp text-rust border-rust">
              Join Waitlist
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-ink bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <StampBadge tone="amber" rotate={false} className="mb-6">
            Coming Soon
          </StampBadge>
          <h1 className="mb-6 font-display text-4xl font-bold uppercase leading-tight tracking-tight md:text-6xl">
            Your suppliers, samples, and POs stop living in five different apps
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-ink">
            SourceOS replaces the spreadsheets, WhatsApp threads, and inbox chaos of sourcing
            physical products overseas with one organized manifest — built for founders who
            source their own product.
          </p>
          <div id="waitlist" className="flex justify-center">
            <WaitlistForm />
          </div>
        </div>
      </section>

      <section className="border-b border-ink bg-paper-card">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="mb-8 text-center font-mono text-xs uppercase tracking-widest text-muted">
            The Problem
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="border border-ink bg-paper p-6">
                <h3 className="mb-3 font-display text-xl font-bold uppercase tracking-tight text-rust">
                  {p.title}
                </h3>
                <p className="text-sm text-ink">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ink bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="mb-8 text-center font-mono text-xs uppercase tracking-widest text-muted">
            Everything In One Manifest
          </p>
          <div className="flex flex-col divide-y divide-ink border border-ink">
            {FEATURES.map((f, i) => (
              <div key={f.name} className="grid grid-cols-[auto_1fr] gap-6 p-6">
                <span className="font-mono text-2xl font-bold text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="mb-1 font-display text-lg font-bold uppercase tracking-tight">
                    {f.name}
                  </h3>
                  <p className="text-sm text-ink">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ink bg-paper-card">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="mb-8 text-center font-mono text-xs uppercase tracking-widest text-muted">
            Pricing
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PRICING.map((tier) => (
              <div
                key={tier.name}
                className={`relative border bg-paper p-6 ${tier.featured ? "border-2 border-rust" : "border-ink"}`}
              >
                {tier.featured && (
                  <StampBadge tone="rust" className="absolute -top-3 right-4">
                    Most Popular
                  </StampBadge>
                )}
                <h3 className="font-display text-xl font-bold uppercase tracking-tight">
                  {tier.name}
                </h3>
                <p className="mt-2 font-mono text-3xl font-bold">
                  {tier.price}
                  <span className="text-sm text-muted">/mo</span>
                </p>
                <p className="mt-2 text-sm text-muted">{tier.blurb}</p>
                <ul className="mt-4 flex flex-col gap-1">
                  {tier.features.map((f) => (
                    <li key={f} className="font-mono text-xs text-ink">
                      · {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-ink bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <span className="font-display text-lg font-bold uppercase tracking-tight">
            Source<span className="text-rust">OS</span>
          </span>
          <p className="font-mono text-xs text-muted">
            © {new Date().getFullYear()} SourceOS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
