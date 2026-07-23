# Changelog

*(part of the [handoff folder](./README.md)) — chronological, oldest first*

1. **Initial build** — full brief scope: Next.js scaffold, design system, Supabase
   schema + RLS + auth/onboarding, core CRUD, Stripe billing, Twilio webhook +
   manual fallback, landing page.
2. **Deployment** — GitHub repo, Vercel, Supabase env vars, Stripe products/prices/
   webhook, production verified end-to-end.
3. **Pricing changed** to $15/$60/$130.
4. **Proxy bug fix** — `/api/*` routes were being redirected to `/login`, breaking
   Stripe/Twilio webhooks. Fixed by excluding `/api/*` from the redirect check.
5. **Tier usage limits, Delivery Calendar, Document Center, Performance Analytics,
   WhatsApp thread+replies** added.
6. **Dashboard order-volume tile** added.
7. **Full sidebar parity pass** — 17-section nav matching a reference app.
8. **Dashboard redesign** — icon stat tiles + "Orders by Stage" bar chart.
9. **Sidebar icon redesign** — per-item icons (hand-drawn SVGs, no icon library),
   active-route highlighting via a new client-side `SidebarNav` component.
10. **Reference-parity redesign** (7 pages) — Supplier Directory, Product Catalog,
    Purchase Orders, Finance Report, Timeline, Team Management, and a brand-new
    Feedback & Support page, all rebuilt to match a set of reference screenshots
    the user provided. Added the workspace-ID join-code flow (migration 0005)
    alongside the existing email-invite flow — the reference showed both
    coexisting, not one replacing the other. Landing page pricing copy fixed
    in a follow-up pass after noticing it had its own separate (also-fake)
    feature list that the first billing-page fix had missed.
11. **Domain/SMTP/DNS setup started** — sourceos.com purchased via Squarespace,
    Vercel domain connection + Resend SMTP domain verification + DMARC record
    all configured. Hit a real snag: the domain's authoritative nameservers
    turned out to be GoDaddy's (Squarespace resells on their backend), and
    Squarespace's DNS panel wasn't syncing saved records to the live zone —
    confirmed via direct authoritative nameserver queries. Escalated to
    Squarespace support; still pending as of this handoff (see
    [current-state.md](./current-state.md) → In Progress for the exact resume
    point).
12. **Subscription tier gating + multi-client workspaces** — Analytics/Documents/
    Production locked to Growth+, Activity Log to Agency, via a new
    `hasFeature()`/`PLAN_RANK` helper and `UpgradeGate` component. Billing +
    landing page copy fixed to drop fake AI features. Separately, built real
    multi-tenancy support for the Agency tier: an owner can create/switch
    between multiple "client" workspaces from one login, billed under one
    subscription. Required moving the RLS backbone (`current_workspace_id()`)
    from reading `profiles.workspace_id` directly to a new
    `profiles.active_workspace_id` pointer validated by a new
    `workspace_memberships` join table, with `profiles.workspace_id`
    repurposed as "home"/billing workspace. Found and fixed a real pre-existing
    security gap in the same pass: `profiles` RLS didn't restrict by column,
    so any user could self-assign into any workspace they knew the ID of —
    fixed via Postgres column GRANTs (migration 0007, run separately/first as
    a standalone hotfix before the larger 0008 migration).
13. **Sentry + PostHog added** — error tracking and product analytics, both
    live and verified in production. Wired through Next.js 16's native
    `instrumentation.ts` (server, `onRequestError`) and
    `instrumentation-client.ts` (client, plus PostHog pageview tracking via
    the new `onRouterTransitionStart` hook) rather than older manual patterns.
    Both are fully optional/no-op if their env vars are unset.
14. **`.gitignore` bug fix** — `.env*` was silently also excluding
    `.env.local.example` (the checked-in template, not a secrets file) from
    git this whole time. Added `!.env*.example` to un-ignore it.
15. **Marketing/growth work** — drafted outreach DM templates and a "founding
    member" community pitch for early customer acquisition (see
    [next-steps.md](./next-steps.md)). Installed a 47-skill marketing skill
    pack (workspace-level, not in the sourceos repo — see
    [architecture.md](./architecture.md)) and produced two actual Instagram
    Reels videos using Hyperframes (HTML/CSS→MP4 renderer) + a locally-installed
    FFmpeg + headless Chrome — saved to
    `C:\Users\17703\Desktop\SourceOS Reels\`. No product code was touched for
    this work; noted here since it consumed significant session time and
    installed new local tooling (`ffmpeg` via winget, Chrome Headless Shell
    in `hyperframes`'s cache) that a future session should know already exist
    rather than reinstalling.
