# Current State

*(part of the [handoff folder](./README.md))*

## Live and working

- Production: https://sourceos-gamma.vercel.app **and** https://www.souceos.com
  (custom domain — note: **the real domain is `souceos.com`, missing the
  "r"**, not `sourceos.com`; see "The domain typo" below). Bare `souceos.com`
  (no `www`) currently 308-redirects to `www.souceos.com` but its own SSL
  certificate is still pending issuance from Vercel — see In Progress.
- Repo: https://github.com/Lcorney5/sourceos (branch `main`, auto-deploys on push)
- Supabase project `hwwfvzfhfsvdtiugqzwn` — schema migrated through 0009 (see
  [architecture.md](./architecture.md))
- Stripe: **test mode**, 3 prices ($15/$60/$130 monthly), webhook verified working
- Full signup → onboarding → workspace creation → dashboard flow verified working
- **Google OAuth sign-in** — now enabled and confirmed working (was returning
  a 400 "provider not enabled" error; fixed by creating a Google Cloud OAuth
  client and enabling the Google provider in Supabase's Auth settings — no
  code changes needed)
- **Legal pages** — Privacy Policy (`/privacy`) and Terms of Service (`/terms`)
  now exist, linked from the homepage footer and a consent line on `/signup`.
  **Two placeholders still need filling in**: legal entity name and
  governing-law state/city (both marked `[...]` in the page text) — not a
  blocker to launch, but should be done before relying on them, and an
  attorney should still review before scaling real payments.
- **robots.txt / sitemap.xml / Open Graph metadata** — all added
  (`src/app/robots.ts`, `src/app/sitemap.ts`, metadata block in
  `src/app/layout.tsx`). Found and fixed the same class of bug as the
  Stripe/Twilio webhook issue from before: the auth middleware's
  `PUBLIC_PATHS` allowlist didn't include `robots.txt`/`sitemap.xml`/`/privacy`/
  `/terms`, so all four were silently redirecting to `/login` until fixed.
- **Dashboard navigation performance** — was taking multiple seconds per
  sidebar click. Three compounding causes, all fixed: no `loading.tsx`
  anywhere (added one, instant skeleton now shows on navigation); the
  dashboard layout ran its workspace-switcher query sequentially *after*
  `requireWorkspace()` instead of inside its existing parallel query batch
  (folded in); and Vercel had no region pinned, defaulting to US East while
  Supabase runs in US West (`vercel.json` now pins `sfo1`).
- **Starter plan product limit now enforced** — the pricing page advertises
  "up to 3 active products" for Starter, but nothing checked it (`suppliers`
  and `members` limits were enforced, `products` wasn't even in the type).
  Fixed in `src/lib/plan-limits.ts` + `src/lib/actions/products.ts`, matching
  the existing supplier/member-limit pattern, plus a usage meter on the
  Products page.
- **Directory contact list** — was showing only email *or* phone (silently
  dropping phone if a contact had both); now shows both stacked.
- **Phone sign-in (SMS OTP) built, not yet live** — Supabase phone auth
  component exists (`src/components/auth/phone-auth-form.tsx`) but isn't
  linked from `/login` or `/signup` — user tested Twilio's setup flow and
  decided not to pay for it yet (needs a card on file to buy a number, even
  within trial credit). Re-enabling later is just re-adding a few lines to
  the two auth pages once Twilio + Supabase's Phone provider are configured
  — see [next-steps.md](./next-steps.md). **Also fixed a real bug found
  along the way**: `profiles.email` is `NOT NULL` and the auto-profile
  trigger inserted `auth.users.email` directly — phone-only signups have no
  email, so this would have silently broken every phone signup at the
  database level. Fixed via migration 0009 (`coalesce(new.email, '')`).

## The domain typo (important — read this if anything about "sourceos.com" seems off)

The domain actually registered and owned is **`souceos.com`** — missing the
"r" — not `sourceos.com`. This was undiscovered for days across multiple
sessions: extensive DNS troubleshooting (see
[known-issues.md](./known-issues.md) for the full story) was checking
`sourceos.com` the entire time, which is a real, unrelated domain registered
by someone else since 2013 (confirmed via whois — locked, not for sale,
actively used, which is why it always showed foreign Barracuda/Outlook mail
records no matter what was "fixed"). There was **never a Squarespace DNS
sync bug** — that theory was wrong, an artifact of checking the wrong domain.

`souceos.com` runs on Squarespace's own native DNS
(`nse1-4.squarespacedns.com`), not GoDaddy nameservers. Once checked
directly, 5 of 6 records were already correctly configured (MX, SPF, DKIM,
DMARC, and the `www` CNAME to Vercel) — only the root A record was wrong,
since fixed to `216.198.79.1`.

**User's explicit decision (2026-07-24): keep `souceos.com` permanently.**
Chose not to pursue acquiring `sourceos.com` or buying a different domain.
As a direct consequence, **the product itself was renamed from "SourceOS" to
"SouceOS"** across every user-facing string in the app (logo, page titles,
Open Graph metadata, legal docs, in-app copy — see
[changelog.md](./changelog.md)) to match the domain, rather than shipping a
brand name that doesn't match its own URL.

## In progress

- **Apex domain SSL certificate (`souceos.com`, no `www`)** — Vercel shows
  "Valid Configuration" with a 308 redirect to `www.souceos.com`, but the
  bare domain still fails an SSL handshake (confirmed via `curl` and an
  independent fetch tool, so not a local-machine-only issue). No CAA record
  is blocking it. No manual "Refresh" action is available for redirect-type
  entries in Vercel's UI (only Production entries show one). This is very
  likely just Vercel/Let's Encrypt's own issuance queue — **`www.souceos.com`
  already works perfectly** (confirmed 200 OK on homepage, robots.txt,
  sitemap.xml, privacy, terms, login, signup), so there's no urgency; just
  recheck later, or try removing and re-adding the domain in Vercel to force
  a fresh issuance attempt if impatient.
- Once the apex domain is confirmed working: update `NEXT_PUBLIC_SITE_URL` in
  Vercel from the `.vercel.app` URL to `https://www.souceos.com`, update the
  Google Ads campaign's final URLs/sitelinks and any outreach message links
  the same way, and finish the Resend SMTP → Supabase Auth setup (get Resend
  SMTP credentials into Supabase's Auth → Emails → SMTP settings, test
  signup with real Gmail + Yahoo addresses, confirm SPF/DKIM/DMARC pass).

## Not yet configured

- Twilio (WhatsApp Business API *and* the phone-auth SMS option) — still
  unset, needs a paid Twilio account (see "Phone sign-in" above)
- Stripe is in test mode only
- Two placeholders in the legal docs (legal entity name, governing-law state)
  still need real values

## Customer acquisition (new this session — no code, but concrete state)

- **Kickstarter**: 7 real, currently-active leads researched and ranked (see
  `growth-outreach-templates.md` in the outside-repo HANDOFF folder) — top 2
  recommended to back first are Nguyen Lam (BLOCHILD/Innocence Collection)
  and Charl Le Roux (Blue Crane Jacket). Messages are drafted but **nothing
  has been backed or sent yet** — backing requires real money and is the
  user's call each time.
- **Youneek** (Charl Le Roux's brand) — submitted their website contact form
  with a drafted message. **Submission status is unconfirmed** — the form's
  success state never rendered and further JS-based debugging was blocked by
  a safety classifier, so it's unknown whether it actually went through.
- **Reddit** — found a strong, genuine thread to reply to
  (r/FulfillmentByAmazon) and drafted a reply, but the subreddit's rules
  explicitly ban AI-generated content — **not yet posted**; user was going to
  rewrite it in their own words before posting.
- **X/Twitter** — a single post and a 4-tweet thread drafted (founder-story /
  founding-member-call format, no link), plus a list of search queries for
  finding people to reply to organically (supplier-chaos and Amazon FBA/
  private-label phrasing). Not yet posted.
- **LinkedIn** — attempted cold search for founders; hit a real wall.
  Content search is dominated by sourcing agencies/consultants SEO-optimizing
  around the same keywords, and people search is restricted to 3rd-degree
  connections without Premium (account only has 2 connections). Concluded
  cold LinkedIn search isn't productive right now without a paid upgrade.
- **Public business contact numbers** — checked ~13 small apparel brands for
  a published phone/WhatsApp; only Youneek had one. Everyone else defaults to
  email or Instagram DM. This wasn't a research gap — it reflects how early-
  stage brands actually operate. (Explicitly did **not** use people-search/
  data-broker sites to find personal phone numbers — publicly-published
  business numbers only.)

## Environment / Credentials

Real values live in `.env.local` (gitignored, never commit it) and in Vercel
project → Settings → Environment Variables. See `.env.local.example` for the
full variable list. No new env vars added this session — the phone-auth
Twilio credentials for Supabase's own SMS provider config are entered
directly in Supabase's dashboard, not as app env vars.
