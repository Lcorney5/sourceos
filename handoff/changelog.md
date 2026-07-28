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
26. **Waitlist landing page replaced with a live signup/pricing page** — the
    homepage said "Coming Soon" / "Join Waitlist" even though signup and
    login both actually worked, which would contradict what cold-call
    outreach promises on the phone. Removed the waitlist form and badge;
    header/hero now link to `/signup` directly, and each pricing tier card
    links to `/signup?plan=starter|growth|agency`.
27. **Pricing tiers now wire straight into Stripe Checkout** — the plan
    picked on the homepage now carries through the whole signup chain
    (`/signup?plan=X` → email confirmation or Google OAuth →
    `/auth/callback?plan=X` → `/onboarding?plan=X`) and, once the user
    creates their workspace, automatically calls `createCheckoutSession`
    and redirects to Stripe instead of the dashboard. No plan selected still
    falls through to the dashboard exactly as before. New file:
    `src/lib/plans.ts` — split `PlanKey`/`PLAN_KEYS` out of `src/lib/stripe.ts`
    (which is `"server-only"`) so the client-side onboarding form can
    validate a plan key without pulling the Stripe SDK into the browser
    bundle; a first attempt importing directly from `lib/stripe.ts` failed
    the production build for exactly this reason.
28. **Fixed a `redirect()`-swallowing bug before it shipped** — the new
    onboarding flow needed to call the checkout-redirecting server action
    from a client component and still show a friendly error if it *actually*
    failed (e.g. bad Stripe config). A naive `try { await
    createCheckoutSession(plan) } catch { ... }` would silently swallow
    Next's `NEXT_REDIRECT` throw on the success path, since `redirect()`
    works by throwing. Fixed with an `isNextRedirectError` check (matches on
    `.digest.startsWith("NEXT_REDIRECT")`) that re-throws the redirect and
    only treats genuine errors as errors — see
    `src/app/onboarding/create-workspace-form.tsx`.
29. **Confirmation-email domain bug found and fixed** — Supabase Auth's own
    **Site URL** setting (Authentication → URL Configuration, separate from
    anything in the codebase) was still pointed at `sourceos.com` — the
    wrong, unrelated third-party domain from the original typo saga — so
    confirmation links sent users there instead of `souceos.com`. Fixed by
    updating Supabase's Site URL and Redirect URLs allowlist to
    `https://www.souceos.com`.
30. **Resend SMTP actually finished and verified this session** (previous
    handoffs left this "in progress"). Found along the way: a Resend account
    already existed with `souceos.com`'s exact DNS-verification records
    (MX/SPF/DKIM/DMARC) already live in DNS — but the *domain entry in
    Resend itself* had been created under the typo'd `sourceos.com`, so it
    was never actually verified. Deleted/re-added the domain correctly as
    `souceos.com` in Resend; its freshly-generated DKIM key didn't match the
    stale DKIM TXT record already in DNS (that record was generated for the
    wrong domain-entry instance), so the `resend._domainkey` TXT record
    needed updating to the new value before verification passed. Also hit
    two *separate* rate limits while testing, both fixed: (a) Supabase's
    built-in mailer's own hard limit (pre-existing known issue, motivated
    this whole effort), and (b) a **second**, independently-configurable
    "rate limit for sending emails" under Authentication → Rate Limits that
    still applies even with custom SMTP configured — was at 2/hour, raised
    to 3000. (One false lead during debugging: Resend rejects `example.com`
    as a recipient outright, "please use our testing email address instead
    of domains like example.com" — not a config bug, just an invalid test
    address; a real address confirmed the whole chain works, HTTP 200 with
    `confirmation_sent_at` populated.)
31. **Three product-preview visuals added to the homepage** — the page had
    no visual proof the product actually exists. Added static mockups
    (`src/components/landing/{product,samples,po}-preview.tsx`) reusing the
    *real* dashboard components (`Table`/`Th`/`Td`, `QuoteStatusBadge`,
    `SampleStatusBadge`, `StageSteps`, `OverdueBadge`) with fictional but
    realistic example data, so they're visually identical to the actual app
    rather than separate mockup art — a Quotes comparison in the hero, and
    Samples + Purchase Orders (with a live "PAST DUE" flag on one row) in a
    new "See It In Action" section, each one paired with the matching card
    in "The Problem" above it.
32. **Favicon and OG image added** — neither existed before. New
    `src/app/icon.tsx` and `src/app/opengraph-image.tsx`, both generated
    in-brand via `next/og`'s `ImageResponse` (no external image tooling
    needed) using the same paper/ink/rust palette as the rest of the site.
    **Found and fixed the same class of bug as the `/api/*` and
    `robots.txt`/`sitemap.xml` middleware issues from earlier sessions**:
    `src/proxy.ts`'s matcher regex excludes static file extensions but
    `/icon` and `/opengraph-image` have no extension in their URL, so both
    were silently redirecting to `/login` until explicitly excluded. Worth
    remembering as a recurring pattern: any new file-convention route under
    `src/app/` needs to be checked against this matcher.
33. **Stripe live/test mode mismatch found — NOT YET RESOLVED, see
    [known-issues.md](./known-issues.md).** After everything above shipped,
    the user reported pricing-page checkout buttons doing nothing, and a
    fresh signup getting full dashboard access (added a supplier) without
    ever paying. Root cause: Vercel Production's `STRIPE_SECRET_KEY` is a
    **live-mode** key (`sk_live_...`), but the three
    `NEXT_PUBLIC_STRIPE_PRICE_*` env vars are test-mode price IDs — a live
    key can't see test-mode prices, so `checkout.sessions.create()` fails
    every time. **This also surfaced a second, independent bug**: when
    checkout creation throws a genuine (non-redirect) error,
    `create-workspace-form.tsx` currently falls back to
    `router.push("/dashboard")` instead of blocking the user — meaning any
    Stripe misconfiguration silently grants full free access. User was mid-
    decision on live vs. test mode when this handoff was written; the
    dashboard-fallback bug is flagged to fix regardless of which mode is
    chosen. **Do not consider checkout "done" until this is resolved.**
34. **Customer acquisition: cold-call list built (no app code)** — 102
    companies compiled with real, verified phone numbers across three
    categories: physical-product businesses with their own house brand
    (sourced via Google Maps + manual brand verification, e.g. Huntington
    Beach surf shops), freight-forwarder/customs-broker trade-association
    directories (Michigan, Houston, North Texas — chosen as an adjacent-B2B
    channel since every one of their clients already imports from overseas
    manufacturers), and direct product importers found via the Specialty
    Food Association's member directory (the strongest direct-ICP match,
    e.g. Maurice Pincoffs Co., Amtrade Inc.). Deliberately excluded any
    number sourced only from data-broker/scraper sites (ZoomInfo, Apollo,
    Prospeo, Seamless.AI) rather than the company's own listing or an
    official directory. Saved as `SourceOS_Cold_Call_List.csv`/`.xlsx` on
    the Desktop (first attempt saved to the wrong, OneDrive-shadowed
    `C:\Users\17703\Desktop` instead of the real synced
    `C:\Users\17703\OneDrive\Desktop` — see
    [known-issues.md](./known-issues.md)) and as a filterable/searchable
    interactive artifact (click-to-call, per-row status tracking saved to
    the browser, plus a second tab with a full cold-call script: direct
    pitch for house-brand/importer leads vs. a no-pressure referral ask for
    brokers/forwarders, objection-handling table, voicemail script).
35. **Privacy Policy/Terms compliance overhaul + a real cookie-consent gate
    added.** Audited the actual codebase first (no ad pixels/data brokers
    anywhere; nothing is genuinely public UGC — samples/documents/directory
    are all workspace-scoped; no custom marketing-email code exists, only
    Supabase Auth's confirmation email over the Resend SMTP relay; a
    self-serve Stripe Customer Portal already exists for cancellation; no
    self-serve account deletion/export exists despite the old policy
    claiming "any time" self-serve). Rewrote `src/app/privacy/page.tsx`
    (14 sections) to fix that overpromise (now "contact us, we'll act on it
    within a reasonable time"), add a dedicated Cookies section, a
    California Privacy Rights (CCPA/CPRA) section with the actual categories
    collected and a 45-day response commitment, a European/UK (GDPR) section
    with legal bases and a 30-day response commitment, and a Marketing
    Communications section committing to CAN-SPAM-compliant unsubscribe
    handling for any future promotional email (none currently sent). Added a
    matching **User Content** section (with a DMCA-style takedown process)
    to `src/app/terms/page.tsx` and strengthened the Subscriptions & Billing
    section (explicit pre-purchase Stripe Checkout disclosure, portal-based
    cancellation, a 30+-day free-trial reminder commitment) — pushed
    Intellectual Property through Contact Us down one section number each
    (now 7–15) to make room. Also built and wired in a real
    `CookieConsentBanner` (`src/components/cookie-consent-banner.tsx`) since
    PostHog was previously initializing unconditionally in
    `src/instrumentation-client.ts` on every page load — a real GDPR/
    ePrivacy gap for non-essential analytics cookies. PostHog now only
    initializes after the user clicks Accept (choice persisted in
    `localStorage['cookie_consent']`); Sentry still runs unconditionally
    (treated as strictly-necessary/security, not tracking). Verified in the
    dev server: both pages render with correct section numbering, Accept
    correctly sets `cookie_consent` with no console errors, `tsc --noEmit`
    clean. **Two placeholders still remain** (legal entity name,
    governing-law state/city) plus a **new one added**: business mailing
    address (Privacy Policy §14) — needed for CAN-SPAM once any promotional
    email is ever sent, not urgent today since none is. **Not built this
    session, flagged instead of silently attempted**: actual self-serve
    account/data deletion and export — a real product feature, not just a
    text change, and more involved than this pass's scope.
36. **Removed the WhatsApp Business messaging feature entirely** (the user
    asked to drop the WhatsApp/WhatsApp Messages cards that appeared on the
    supplier detail page after creating a supplier, then to remove the rest
    once it was clear WhatsApp Connect was the *only* way a supplier ever
    became "connected," orphaning the rest of the feature). Deleted
    `src/components/suppliers/whatsapp-connect.tsx`,
    `whatsapp-thread.tsx`, `src/lib/actions/whatsapp.ts`, `src/lib/twilio.ts`,
    the `/api/twilio/whatsapp` webhook route, and the whole
    `/dashboard/messages` page; removed `setWhatsappConnection` from
    `src/lib/actions/suppliers.ts`, the "Messages" sidebar-nav entry and
    home-page quick link, and the now-empty "WhatsApp Connections" section
    on `/dashboard/settings` (replaced with a placeholder card so the
    persistent sidebar-footer link doesn't 404). Also corrected
    `/privacy` and `/terms` — both still listed Twilio/WhatsApp as an active
    subprocessor/integration, which would have been the exact "policy
    overpromises a feature that isn't real" problem fixed in #35, just in
    the other direction. `whatsapp_number`/`whatsapp_connected` columns and
    the `whatsapp_messages` table are untouched in the database — nothing
    reads or writes them anymore, but no migration was run to drop them.
    Twilio itself is unaffected as a *future* phone-auth SMS provider (that
    goes through Supabase's own Phone provider config, not this app's
    Twilio SDK usage — see changelog #19).
37. **Found and fixed a real, previously-undiagnosed reason "Save Changes"
    on the supplier page could silently do nothing** — Next.js 16's
    Server Actions are same-origin-only by default (the request's `Origin`
    header must match `Host`, a CSRF protection), and this app is reachable
    on three different hostnames (`sourceos-gamma.vercel.app`,
    `www.souceos.com`, and the still-SSL-pending bare `souceos.com`), none
    of which were in `next.config.ts`'s `serverActions.allowedOrigins`. Any
    request landing on a hostname Next didn't recognize as safe would have
    its Server Action rejected outright, with no error surfaced to the
    `updateSupplier` action's try/catch since the request never reaches
    application code at all. Added all three hostnames to
    `allowedOrigins` in `next.config.ts`. **Not fully confirmed as root
    cause** — verifying required a real login, which this assistant doesn't
    do (see known-issues.md's standing rule) — so if saving still fails
    after this, the next diagnostic step is checking the browser console/
    network tab for the actual error on submit.

Note: item 38 below happened earlier in this same session, before 35–37 —
listed out of strict order since it wasn't logged at the time.

38. **Checkout-failure fallback that silently granted free access — fixed**
    (see [known-issues.md](./known-issues.md) for the full before/after).
    `src/app/onboarding/create-workspace-form.tsx` no longer redirects to
    `/dashboard` when `createCheckoutSession` throws a genuine error; it now
    shows a "Retry Checkout" view instead, since the workspace row already
    exists by that point and re-running `create_workspace` would just error.
39. **Per-row Delete added to the Suppliers, Samples, and Purchase Orders
    list pages** — delete already existed on each entity's detail page (and
    Quotes already had a per-row delete on its list), but Suppliers/Samples/
    POs required opening a record first. Added
    `DeleteSupplierButton`/`DeleteSampleButton`/`DeletePOButton` (client
    components, `useTransition` + `confirm()`, mirroring the existing
    `DeleteQuoteButton` pattern exactly) reusing the same `deleteSupplier`/
    `deleteSample`/`deletePurchaseOrder` server actions already used by the
    detail pages — no new backend logic. `tsc`/`eslint` clean; verified the
    route still compiles and correctly redirects to `/login` when logged
    out (list pages require auth, so the populated table itself needs a
    real login to see — same standing limitation as prior sessions).
40. **Missed WhatsApp remnant on the Suppliers list, removed.** The #36
    cleanup deleted the connect/messaging feature but missed a "WhatsApp"
    column on the Suppliers list table (`supplier-directory.tsx`) showing
    `supplier.whatsapp_number` — with the connect flow gone, that field can
    never be set again, so the column would only ever show "—". User caught
    it visually and flagged it; removed the column entirely.
41. **Removed the last WhatsApp trace**: the "WhatsApp" option in the
    Communication Log's "Source" dropdown on the supplier detail page
    (`suppliers/[id]/page.tsx`). Existing log entries already tagged
    `whatsapp` still render fine (the log just displays whatever string is
    stored); only the option for logging *new* entries that way is gone.
    Remaining `whatsapp` references in the codebase are now just the
    untouched DB columns/types (`database.types.ts`) and generic marketing
    copy on the landing page describing the problem SouceOS solves — no
    UI or feature surface left.
42. **Diagnosed the "Save Changes does nothing" report by watching a screen
    recording of it** (frames extracted via the already-installed FFmpeg,
    no login needed) — found that `SupplierForm` gave zero visual feedback
    on submit either way, so a successful silent save and a fully broken
    one would look pixel-identical. Converted it to a client component
    using `useActionState` (`src/components/suppliers/supplier-form.tsx`):
    the button now shows "Saving...", then either "Saved." or the actual
    thrown error message. Used by both `/suppliers/new` (Create Supplier)
    and `/suppliers/[id]` (Save Changes); preserves the `createSupplier`
    redirect-on-success behavior via the same `isNextRedirectError` rethrow
    pattern from the onboarding fix (#38). Root cause of the original
    report is still not 100% confirmed — this makes the real outcome
    visible either way instead of fixing a specific guessed cause.
43. **Local dev/testing traffic was polluting production PostHog
    analytics** — caught by the user reading PostHog's own "User Paths"
    report and spotting a `localhost:3000/` entry node with real hits, from
    this session's `next dev` testing (local and prod share the same
    `NEXT_PUBLIC_POSTHOG_KEY`). Fixed in `src/instrumentation-client.ts`:
    `enablePostHog()` now no-ops on `localhost`, `127.0.0.1`, or a
    private-network IP (the "Network: http://192.168.x.x:3000" address
    `next dev` prints), regardless of cookie consent. Verified in the dev
    server: consent still stores correctly and the banner still hides, but
    no request ever reaches PostHog's servers. Doesn't retroactively clean
    already-recorded local sessions — those just age out of any date-range
    report on their own.
