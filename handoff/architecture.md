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
```
