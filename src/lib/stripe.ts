import "server-only";
import Stripe from "stripe";

// Lazily constructed so importing this module doesn't throw at build time
// (e.g. during static page-data collection) when STRIPE_SECRET_KEY isn't
// set yet. Only throws once a Stripe call actually happens at request time.
let _stripe: Stripe | undefined;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    });
  }
  return _stripe;
}

export const PLAN_PRICE_IDS = {
  starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
  growth: process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH,
  agency: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY,
} as const;

export type PlanKey = keyof typeof PLAN_PRICE_IDS;

export function planForPriceId(priceId: string | null | undefined): PlanKey | null {
  if (!priceId) return null;
  const entry = Object.entries(PLAN_PRICE_IDS).find(([, id]) => id === priceId);
  return (entry?.[0] as PlanKey) ?? null;
}
