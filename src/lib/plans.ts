// Plan keys shared between client and server code. Kept separate from
// lib/stripe.ts (which is "server-only") so client components can validate
// a plan key without pulling the Stripe SDK into the browser bundle.
export const PLAN_KEYS = ["starter", "growth", "agency"] as const;
export type PlanKey = (typeof PLAN_KEYS)[number];
