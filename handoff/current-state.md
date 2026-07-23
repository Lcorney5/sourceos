# Current State

*(part of the [handoff folder](./README.md))*

## Live and working

- Production: https://sourceos-gamma.vercel.app (custom domain sourceos.com
  purchased but not yet connected — see "In progress" below)
- Repo: https://github.com/Lcorney5/sourceos (branch `main`, auto-deploys on push)
- Supabase project `hwwfvzfhfsvdtiugqzwn` — schema migrated through 0008 (see
  [architecture.md](./architecture.md)), Storage bucket `documents` created
- Stripe: **test mode**, 3 prices ($15/$60/$130 monthly), webhook verified
  working end-to-end
- Full signup → onboarding → workspace creation → dashboard flow verified
  working in production
- **Full sidebar redesign** — icons per nav item, active-route highlighting,
  workspace switcher
- **Reference-parity redesign** — Suppliers→Supplier Directory, Products→
  Product Catalog (card grid with supplier count/best price/quote-sample-
  order counts), Purchase Orders (Ref/Deposit/Balance columns + status step
  indicator), Finance→Finance Report (stat tiles + spend-by-supplier + order
  breakdown), Timeline (bordered cards + step indicator), Team Management
  (workspace-ID join code + email invites + crown icon for owner)
- **Feedback & Support** — new page, new `feedback_submissions` table, type-
  tagged (feedback/bug/feature) submission form + your-submissions list
- **Subscription tier gating** — Analytics/Documents/Production require
  Growth+, Activity Log requires Agency; locked pages show an upsell state
  (`UpgradeGate` component) rather than being hidden. Billing page and public
  landing page pricing copy both fixed to list real features (previously
  advertised unbuilt "AI quote parsing" / "AI negotiation-assist" features —
  now removed everywhere)
- **Multi-client workspaces (Agency tier)** — an Agency-plan workspace owner
  can create additional "client" workspaces and switch between them from one
  login (sidebar workspace switcher), billed for free under the owner's one
  Agency subscription. New `workspace_memberships` table is now the source of
  truth for workspace access; `profiles.active_workspace_id` (vs.
  `profiles.workspace_id` = "home"/billing workspace) drives which workspace
  is currently active. See [changelog.md](./changelog.md) #12 for the full
  design.
- **Security fix**: `profiles` table RLS previously only restricted by row
  (`id = auth.uid()`), not by column — any signed-in user could have
  overwritten their own `workspace_id` directly to any known workspace UUID,
  bypassing invite/join-code checks entirely. Fixed via Postgres column-level
  GRANTs (migration 0007) restricting normal clients to only writing `name`;
  every other profile mutation now goes through security-definer RPCs.
- **Sentry** error tracking and **PostHog** product analytics — both live and
  confirmed working in production (see Environment below for where keys
  live). Wired through Next.js's native `instrumentation.ts` /
  `instrumentation-client.ts` hooks; both no-op safely if their env vars are
  ever unset.

## In progress

- **Custom domain (sourceos.com)** — purchased via Squarespace Domains, but
  the domain's actual authoritative nameservers are GoDaddy's
  (`ns65`/`ns66.domaincontrol.com` — Squarespace resells on a GoDaddy-backed
  registrar for this domain). DNS records for Vercel (A + CNAME), Resend
  (SPF/DKIM), and DMARC are all correctly entered and saved in Squarespace's
  DNS panel, **but were not syncing to the live authoritative zone** —
  confirmed via direct `nslookup` against `ns65.domaincontrol.com` showing
  stale/default values even after re-adding all records. Squarespace support
  has been contacted (see [known-issues.md](./known-issues.md)) and quoted a
  24-48 hour propagation window as of 2026-07-22.

  **Next step when resuming:** re-check DNS directly
  (`nslookup -type=A sourceos.com ns65.domaincontrol.com`, and similarly for
  `_dmarc`, `send`, `resend._domainkey`) to see if it's resolved. If still
  stale after 48h, follow up with Squarespace support again — this looks like
  a genuine backend sync bug on their end, not anything wrong with the
  records themselves.

- Once the domain resolves: update `NEXT_PUBLIC_SITE_URL` in Vercel to
  `https://sourceos.com`, update Supabase Auth URL config (already
  pre-configured to point at the new domain, just needs the domain to
  actually work), get Resend SMTP credentials into Supabase's Auth → Emails
  → SMTP settings, and test signup with a real Gmail + Yahoo address to
  confirm inbox (not spam) delivery.

## Not yet configured

- Twilio (WhatsApp Business API) — still unset. Decided in a recent session
  to likely simplify rather than build the full integration (see
  [changelog.md](./changelog.md) #4 and [next-steps.md](./next-steps.md)) —
  **this was discussed but not implemented**, worth revisiting.
- Google OAuth sign-in — provider isn't enabled in Supabase yet
- Stripe is in test mode only
- No legal docs (Terms/Privacy) exist yet

## Environment / Credentials

Real values live in `.env.local` (gitignored, never commit it) and in Vercel
project → Settings → Environment Variables (must match `.env.local`, plus
`NEXT_PUBLIC_SITE_URL` set to the Vercel domain there instead of localhost,
until the custom domain resolves). See `.env.local.example` for the full
variable list (this file is now correctly tracked in git — see
[changelog.md](./changelog.md) #14 for a `.gitignore` bug that previously
silently excluded it) and the root `README.md` for setup steps per service.

New since the previous handoff: `NEXT_PUBLIC_SENTRY_DSN` (+ optional
`SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` for source map upload —
not currently set, source maps are skipped safely), `NEXT_PUBLIC_POSTHOG_KEY`
+ `NEXT_PUBLIC_POSTHOG_HOST` (set to US cloud). All four are already set in
both `.env.local` and Vercel and confirmed working in production.
