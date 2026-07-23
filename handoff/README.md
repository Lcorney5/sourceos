# SourceOS — Handoff

Last updated: 2026-07-22

Start here, then jump into whichever file matches what you need:

| File | What's in it |
|---|---|
| [current-state.md](./current-state.md) | What's live, what's in progress, what's not configured yet, and where the real credentials live |
| [architecture.md](./architecture.md) | Key files/directories and what each one is responsible for |
| [changelog.md](./changelog.md) | Chronological log of every major change, in order |
| [known-issues.md](./known-issues.md) | Things that broke, and how (or whether) they got resolved |
| [next-steps.md](./next-steps.md) | Prioritized list of what to do next |
| [resume.md](./resume.md) | Exact commands to get a dev environment running |

## Goal

SourceOS is a B2B SaaS tool for DTC/physical-product brand founders who source
manufacturing overseas. It replaces spreadsheets/WhatsApp/email chaos with one
workspace for tracking suppliers, quotes, samples, purchase orders, and
production — from first quote to delivered order.

## Stack

**Next.js 16** (App Router, Turbopack, Server Actions) + **Supabase**
(Postgres, RLS-enforced workspace isolation, auth) + **Stripe** (billing) +
**Twilio** (WhatsApp Business API) + **Sentry** (error tracking) + **PostHog**
(product analytics), deployed on **Vercel**.

## If you only read one thing

Read [current-state.md](./current-state.md) — it tells you what's actually
live right now versus what's still in progress or unconfigured, which is the
thing most likely to have changed since whatever you remember about this
project.
