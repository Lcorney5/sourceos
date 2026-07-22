"use server";

import { redirect } from "next/navigation";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { getStripe, PLAN_PRICE_IDS, type PlanKey } from "@/lib/stripe";

async function requireOwner() {
  const context = await requireWorkspace();
  if (!context.isOwner) {
    throw new Error("Only the workspace owner can manage billing");
  }
  if (!context.isHomeWorkspace) {
    throw new Error(
      "Client workspaces are billed under the home workspace's Agency plan and can't be subscribed separately."
    );
  }
  return context;
}

async function ensureStripeCustomer(workspaceId: string, email: string, existingCustomerId: string | null) {
  if (existingCustomerId) return existingCustomerId;

  const customer = await getStripe().customers.create({
    email,
    metadata: { workspace_id: workspaceId },
  });

  const supabase = await createClient();
  await supabase
    .from("workspaces")
    .update({ stripe_customer_id: customer.id })
    .eq("id", workspaceId);

  return customer.id;
}

export async function createCheckoutSession(plan: PlanKey) {
  const { workspace, profile } = await requireOwner();

  const priceId = PLAN_PRICE_IDS[plan];
  if (!priceId) throw new Error(`No Stripe price configured for the ${plan} plan`);

  const customerId = await ensureStripeCustomer(
    workspace.id,
    profile.email,
    workspace.stripe_customer_id
  );
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/dashboard/billing?checkout=success`,
    cancel_url: `${siteUrl}/dashboard/billing?checkout=canceled`,
    metadata: { workspace_id: workspace.id },
    subscription_data: { metadata: { workspace_id: workspace.id } },
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  redirect(session.url);
}

export async function createPortalSession() {
  const { workspace } = await requireOwner();

  if (!workspace.stripe_customer_id) {
    throw new Error("No billing account yet — subscribe to a plan first");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const session = await getStripe().billingPortal.sessions.create({
    customer: workspace.stripe_customer_id,
    return_url: `${siteUrl}/dashboard/billing`,
  });

  redirect(session.url);
}
