# Architecture / Key Files

*(part of the [handoff folder](./README.md))*

```
supabase/migrations/          0001_init.sql (core schema) through 0008 —
                               run in order against a fresh Supabase project.
                               0005 = workspace join-by-ID RPC, 0006 = feedback
                               table, 0007 = profiles column-grant security fix,
                               0008 = multi-client workspaces (workspace_memberships,
                               active_workspace_id, create_client_workspace,
                               switch_active_workspace, remove_workspace_member)

src/lib/supabase/
  database.types.ts           Hand-written types — update whenever a migration
                               changes a table shape (kept in sync through 0008)
  server.ts / client.ts       RLS-respecting clients (server components / browser)
  admin.ts                    Service-role client — webhooks only, bypasses RLS

src/lib/auth/dal.ts           requireWorkspace() — now returns isOwner and
                               isHomeWorkspace (computed from workspace_memberships,
                               role is workspace-scoped now, not a global profile field)

src/lib/plan-limits.ts        PLAN_LIMITS (supplier/member counts) + new
                               PLAN_RANK / hasFeature() / FEATURE_MIN_PLAN for
                               tier gating

src/lib/actions/workspace.ts  inviteMember/revokeInvite/removeMember (now via
                               remove_workspace_member RPC) + new
                               switchActiveWorkspace / createClientWorkspace

src/components/dashboard/
  sidebar-nav.tsx              Client component, usePathname-based active-route
                                highlighting, icons per NAV_ITEMS entry
  workspace-switcher.tsx       Dropdown listing all of the caller's workspaces +
                                "+ Add Client Workspace" (Agency-home-owner only)
  upgrade-gate.tsx              Locked-feature upsell card used by the 4 gated pages
  nav-icons.tsx / stat-icons.tsx  Hand-drawn SVG icon sets (no icon library dep)

src/instrumentation.ts        Sentry server/edge init + onRequestError hook
src/instrumentation-client.ts Sentry client init + PostHog init/pageview tracking
                               (uses Next.js 16's native onRouterTransitionStart hook)

src/proxy.ts + src/lib/supabase/proxy.ts
                               Session refresh + auth-redirect. /api/* is explicitly
                               excluded from the redirect (see changelog — this broke
                               Stripe webhooks once already)

src/app/dashboard/layout.tsx  Sidebar shell — now also fetches workspace_memberships
                               for the switcher

.claude/skills/marketing/     47 marketing skills (copywriting, social, video, SEO,
                               CRO, etc.) installed from github.com/coreyhaines31/
                               marketingskills — workspace-scoped (in `claude code/`,
                               not inside the sourceos repo, so it won't get pushed)

src/app/robots.ts              Generated robots.txt — disallows /dashboard/, /api/,
src/app/sitemap.ts             /auth/, /onboarding. Both must stay excluded from the
                               auth middleware's PUBLIC_PATHS (see src/proxy.ts) or
                               they silently redirect to /login.

src/app/privacy/page.tsx       Legal pages. Two bracketed placeholders in each
src/app/terms/page.tsx         (legal entity name, governing-law state) still need
                               real values — see next-steps.md.

src/components/auth/           Phone sign-in (SMS OTP) via Supabase's native phone
  phone-auth-form.tsx          auth. Built but NOT currently imported by /login or
                               /signup (removed pending a paid Twilio account) —
                               re-adding it is just re-adding the import + JSX.

src/app/dashboard/loading.tsx  Shared loading skeleton for every nested dashboard
                               route — added to fix multi-second navigation latency
                               that had zero visual feedback before.

vercel.json                    Pins the Vercel deployment region to sfo1 (US West)
                               to match Supabase's region — was defaulting to
                               iad1 (US East), adding real cross-country latency
                               to every database call.

src/lib/plan-limits.ts         PLAN_LIMITS now also has a `products` field (3 for
                               Starter, unlimited for Growth/Agency) — previously
                               only suppliers/members were enforced despite the
                               pricing page advertising a product limit too.

supabase/migrations/0009       Fixes handle_new_user() for phone-only signups —
                               profiles.email is NOT NULL but auth.users.email is
                               null when signing up via phone, which would have
                               silently broken the insert trigger without this.
```
