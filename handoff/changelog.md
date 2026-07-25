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
16. **SEO fundamentals added** — `robots.txt`, `sitemap.xml`, Open Graph
    metadata (`src/app/robots.ts`, `src/app/sitemap.ts`,
    `src/app/layout.tsx`). Found the same bug class as the earlier Stripe
    webhook incident: the auth middleware's `PUBLIC_PATHS` allowlist didn't
    include these routes, so Google could never have crawled the site at all
    — fixed in `src/proxy.ts`'s matcher and `src/lib/supabase/proxy.ts`.
17. **Privacy Policy + Terms of Service pages added** (`src/app/privacy`,
    `src/app/terms`), tailored to the actual stack (Supabase, Stripe, Twilio,
    PostHog, Sentry, Resend, multi-client Agency workspaces). Linked from the
    homepage footer and a consent line on `/signup`. Two placeholders
    (legal entity name, governing-law state) still need real values before
    fully relying on them — see [next-steps.md](./next-steps.md).
18. **Google OAuth sign-in fixed** — was returning a raw Supabase 400
    ("Unsupported provider: provider is not enabled") on click. Fixed by
    creating an OAuth Client ID in Google Cloud Console and enabling the
    Google provider in Supabase's Auth settings with those credentials — no
    code changes, purely a configuration gap from before.
19. **Phone sign-in (SMS OTP) built, not wired into the UI** —
    `src/components/auth/phone-auth-form.tsx` (send-code / verify-code flow
    via Supabase's native phone auth), added to both `/login` and `/signup`,
    then **removed from both** after the user tested Twilio's signup flow and
    decided not to pay for a phone number yet (Twilio requires a card on file
    even within trial credit). The component and its migration are left in
    place — re-enabling later is just re-adding a few JSX lines to the two
    auth pages once Twilio + Supabase's Phone provider are configured. Found
    and fixed a real bug in the same pass: migration 0009 — `profiles.email`
    is `NOT NULL` and the `handle_new_user()` trigger inserted
    `auth.users.email` directly, which is `NULL` for phone-only signups; this
    would have silently failed every phone signup at the database level
    without the fix (`coalesce(new.email, '')`).
20. **Dashboard navigation latency fixed** — sidebar clicks were taking
    multiple seconds with zero visual feedback. Three compounding causes:
    (a) no `loading.tsx` anywhere in the app, so the UI sat frozen during
    every navigation — added `src/app/dashboard/loading.tsx`, a shared
    skeleton for all nested dashboard routes; (b) the dashboard layout ran
    its workspace-switcher membership query *sequentially after*
    `requireWorkspace()` instead of inside `requireWorkspace()`'s existing
    parallel `Promise.all` — folded it in (`src/lib/auth/dal.ts` now returns
    `workspaceOptions` directly, consumed by `src/app/dashboard/layout.tsx`);
    (c) no Vercel region was pinned, so it defaulted to US East (`iad1`)
    while Supabase runs in US West — added `vercel.json` pinning `sfo1`.
21. **Directory contact list bug fixed** — the Contact column showed only
    email *or* phone (`contact.email ?? contact.phone`), silently dropping
    phone whenever a contact had both. Now stacks both.
22. **Starter plan product limit enforcement added** — the pricing page
    advertises "up to 3 active products" for Starter, but nothing enforced it
    (unlike the supplier and team-member limits, which already had checks).
    `PLAN_LIMITS` in `src/lib/plan-limits.ts` gained a `products` field, and
    `createProduct` in `src/lib/actions/products.ts` now checks it before
    insert, matching the existing supplier-limit pattern exactly. Added a
    usage meter to the Products page too.
23. **The domain typo, discovered** — after multiple sessions of DNS
    troubleshooting against `sourceos.com` (see
    [known-issues.md](./known-issues.md) for the full misdiagnosis), the user
    checked their Squarespace account directly and found the actual
    registered domain is **`souceos.com`** — missing the "r". `sourceos.com`
    turned out to be a real, unrelated domain registered by someone else
    since 2013 (confirmed via whois: locked, not for sale, actively used —
    which explains the foreign Barracuda/Outlook mail records that kept
    appearing no matter what was "fixed"). There was never a Squarespace sync
    bug. Once `souceos.com` was checked directly (it runs on Squarespace's
    own native DNS, `nse1-4.squarespacedns.com`, not GoDaddy), 5 of 6 records
    were already correct; only the A record needed fixing (now
    `216.198.79.1`). **User's decision: keep `souceos.com` permanently**
    rather than acquire the correct spelling or buy an alternate domain.
24. **Brand renamed "SourceOS" → "SouceOS"** across all user-facing text (9
    files: homepage, login, signup, both legal pages, root layout metadata,
    the dashboard sidebar logo, the auth-card logo, and the WhatsApp-connect
    dialog copy) — direct consequence of the domain decision in #23, so the
    product name matches its own URL. Internal docs (this handoff, the repo
    README, migration SQL comments) were deliberately left saying "SourceOS"
    since they're not user-facing.
25. **Customer acquisition work (no code)** — researched Kickstarter's live
    Fashion/Apparel category as a source of genuinely current leads (people
    actively funding a first production run are provably mid-sourcing right
    now, unlike cold web-search results which kept surfacing either huge
    brands or manufacturer-directory SEO content). Found and ranked 7
    candidates, drafted outreach messages for each, submitted one brand's
    website contact form (Youneek — success unconfirmed), drafted a Reddit
    reply to a genuine r/FulfillmentByAmazon thread (blocked from posting by
    that subreddit's "no AI-generated content" rule — user was to rewrite it
    personally), drafted an X post + thread, and attempted LinkedIn cold
    outreach (concluded not viable right now — small account network plus
    search results dominated by sourcing agencies rather than actual brand
    founders). All templates/leads saved to `growth-outreach-templates.md` in
    the outside-repo HANDOFF folder.
