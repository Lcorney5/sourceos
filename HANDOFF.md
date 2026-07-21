# SourceOS — Handoff

Last updated: 2026-07-21

## Goal

SourceOS is a B2B SaaS tool for DTC/physical-product brand founders who source
manufacturing overseas. It replaces spreadsheets/WhatsApp/email chaos with one
workspace for tracking suppliers, quotes, samples, purchase orders, and
production — from first quote to delivered order.

Stack: **Next.js 16** (App Router, Turbopack, Server Actions) + **Supabase**
(Postgres, RLS-enforced workspace isolation, auth) + **Stripe** (billing) +
**Twilio** (WhatsApp Business API), deployed on **Vercel**.

The build brief is the original source of truth for scope; a second pass
added feature parity with an earlier prototype (`sourceos.base44.app`) — see
Changelog below for what that added.

## Current State

**Live and working:**
- Production: https://sourceos-gamma.vercel.app
- Repo: https://github.com/Lcorney5/sourceos (branch `main`, auto-deploys on push)
- Supabase project `hwwfvzfhfsvdtiugqzwn` — schema fully migrated (0001–0004), Storage bucket `documents` created
- Stripe: **test mode**, 3 prices created ($15/$60/$130 monthly), webhook configured and verified working end-to-end (checkout → subscription active in DB)
- Full signup → onboarding → workspace creation → dashboard flow verified working in production with a real test account
- Auth email confirmation is **on** (Supabase's default limited-rate email provider — fine for testing, will rate-limit under real signup volume, see Next Steps)

**Not yet configured:**
- Twilio (WhatsApp Business API) — `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_WHATSAPP_NUMBER` are unset locally and in Vercel. The UI for WhatsApp connect/thread/reply is fully built and will show a clear "not connected yet" error until these are set — it won't crash.
- Google OAuth sign-in — provider isn't enabled in Supabase yet (email/password works fine)
- Stripe is in test mode only — needs a real business account + live keys before charging real customers
- No legal docs (Terms/Privacy) exist yet — template-only per original brief, needs real review

## Environment / Credentials

Real values live in `.env.local` (gitignored, never commit it) and in Vercel
project → Settings → Environment Variables (must match `.env.local`, plus
`NEXT_PUBLIC_SITE_URL` set to the Vercel domain there instead of localhost).
See `.env.local.example` for the full variable list and `README.md` for setup
steps per service. Nothing in this file references actual secret values.

## Key Files

```
supabase/migrations/          0001_init.sql (core schema), 0002_waitlist.sql,
                               0003_documents.sql, 0004_products_contacts_activity_production.sql
                               — run in order against a fresh Supabase project
src/lib/supabase/
  database.types.ts           Hand-written types matching the schema — update
                               this whenever a migration changes a table shape
  server.ts / client.ts       RLS-respecting clients (server components / browser)
  admin.ts                    Service-role client — webhooks only, bypasses RLS
src/lib/actions/              One file per entity; all Server Actions ("use server")
src/lib/activity-log.ts       logActivity() — wired into create/delete/status-change
                               actions across suppliers/quotes/samples/POs/members/documents
src/proxy.ts + src/lib/supabase/proxy.ts
                               Session refresh + auth-redirect. /api/* is explicitly
                               excluded from the redirect (see Changelog — this broke
                               Stripe webhooks once already)
src/app/dashboard/layout.tsx  Sidebar nav — order/labels mirror the base44 reference app
```

## Changelog (chronological)

1. **Initial build** — full brief scope: Next.js scaffold, design system (industrial
   ledger aesthetic), Supabase schema + RLS + auth/onboarding, Suppliers/Quotes/
   Samples/Purchase Orders/Timeline CRUD, Stripe billing, Twilio WhatsApp webhook +
   manual fallback, landing page.
2. **Deployment** — GitHub repo created, pushed, Vercel project connected, Supabase
   env vars wired, Stripe products/prices/webhook created, production verified
   working end-to-end including a real signup.
3. **Pricing changed** to $15/$60/$130 (from the brief's placeholder $29/$79/$199).
4. **Proxy bug fix** — `/api/*` routes were being redirected to `/login` by the
   auth middleware because they have no user session, which made Stripe's webhook
   (and Twilio's) always fail delivery. Fixed by excluding `/api/*` from the
   redirect check. Confirmed via Stripe's event log showing `pending_webhooks: 1`
   before the fix, `0` after.
5. **Tier usage limits, Delivery Calendar, Document Center, Performance Analytics,
   WhatsApp thread+replies** — five features added on request, matching what the
   old reference app's pricing page implied but wasn't built yet.
6. **Dashboard order-volume tile** added (dollar sum, not just a count).
7. **Full sidebar parity pass** — the old app's sidebar has 17 sections; this pass
   added the ones we didn't have: Products catalog (with autocomplete on product-
   name fields elsewhere), Directory (non-supplier contacts), Production tracking
   (per-PO log + overview page), Finance (spend rollup), unified Messages inbox,
   Home (quick links + activity feed), Activity Log (audit trail), and split Team
   out of Settings into its own page. Nav reordered to match exactly.
8. **Dashboard redesign** — reworked to match a specific reference screenshot:
   icon stat tiles with breakdown subtext and "View X" links, plus an "Orders by
   Stage" bar chart.

## Things That Failed (and resolution)

- **Proxy redirecting webhooks** — see Changelog #4. This is the one real bug
  found; everything else below was either a one-time environment setup snag or
  user error, not a code defect.
- **SQL migration paste mistake** — user once pasted the wrong clipboard content
  into Supabase's SQL Editor (the original brief text, not the migration). Not a
  bug — just a copy/paste mixup; resolved by giving the exact SQL directly in
  chat instead of pointing to a file path.
- **Migrations run out of order** — migration 0004 got run before 0003, leaving
  `documents` missing for a while. The app degrades gracefully when a table is
  missing (Document Center sections just render empty instead of erroring)
  because those queries only destructure `data`, not `error`. Worth being
  deliberate about migration order on a fresh project regardless.
- **Supabase's default auth email hit its rate limit** during testing (a few
  emails/hour cap on their built-in SMTP). Not fixable without setting up a real
  SMTP provider (see Next Steps) — worked around by confirming the one test
  account directly via the Admin API instead of waiting.
- **In-session browser automation flakiness** — the screenshot tool in this
  environment was unreliable throughout (timeouts), unrelated to the app itself.
  Verification leaned on page-text extraction, console/network inspection, and
  direct API calls (Stripe/Supabase) instead, which is why the transcript has a
  lot of curl-based verification rather than screenshots.

## Next Steps

Roughly in the order they'd naturally come up:

1. **Custom SMTP for Supabase Auth** — before any real signup volume, replace
   the default rate-limited email provider (Supabase dashboard → Authentication
   → Emails → SMTP Settings) with Resend/Postmark/SES or similar.
2. **Twilio WhatsApp Business API** — apply for access (Meta business
   verification, days–weeks lead time), then set the three `TWILIO_*` env vars
   in both `.env.local` and Vercel. The app is fully usable without it via the
   manual communication-log fallback.
3. **Google OAuth** — enable the provider in Supabase if wanted; the sign-in
   button already exists in the UI and will start working once enabled.
4. **Move Stripe to live mode** — create real Products/Prices in live mode,
   swap the four `STRIPE_*`/`NEXT_PUBLIC_STRIPE_PRICE_*` env vars, re-point the
   webhook endpoint at the live signing secret.
5. **Legal review** — Terms of Service, Privacy Policy, and specifically the
   WhatsApp-consent language need real legal review before onboarding paying
   customers, given the app stores a third party's (the supplier's) messages.
6. **Branding/domain** — "SourceOS" is still a placeholder name per the original
   brief; a custom domain hasn't been purchased.
7. **Smaller open items**: no automated test suite exists; the "Delivered" PO
   stage badge uses steel (blue) instead of green because the design system's
   palette has no green — worth a deliberate call if brand color expands;
   Products are linked to Quotes/Samples/POs only via a text autocomplete
   (`<datalist>`), not a real foreign key — fine for now, but something to
   revisit if strict product-level reporting is ever needed.

## How to Resume Work

- `npm install`, copy `.env.local.example` → `.env.local` and fill in real
  values (ask whoever has them, or pull from Vercel's env var settings).
- `npm run dev` — public pages work with no env vars; `/dashboard/*` needs
  Supabase configured.
- Before committing: `npx tsc --noEmit` then `npm run build` — both must be
  clean. This repo has no CI yet, so these are the only gate.
- Deploys are automatic on push to `main` via Vercel's GitHub integration.
