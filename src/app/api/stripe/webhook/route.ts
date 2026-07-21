import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, planForPriceId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

function subscriptionStatusFor(status: Stripe.Subscription.Status) {
  switch (status) {
    case "active":
    case "trialing":
      return status;
    case "past_due":
    case "unpaid":
      return "past_due" as const;
    case "canceled":
    case "incomplete_expired":
      return "canceled" as const;
    default:
      return "inactive" as const;
  }
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const workspaceId = subscription.metadata.workspace_id;
  if (!workspaceId) return;

  const priceId = subscription.items.data[0]?.price.id;
  const plan = planForPriceId(priceId);
  const supabase = createAdminClient();

  await supabase
    .from("workspaces")
    .update({
      subscription_status: subscriptionStatusFor(subscription.status),
      stripe_subscription_id: subscription.id,
      ...(plan ? { plan } : {}),
    })
    .eq("id", workspaceId);
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.mode === "subscription" && typeof session.subscription === "string") {
        const subscription = await getStripe().subscriptions.retrieve(session.subscription);
        await syncSubscription(subscription);
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await syncSubscription(event.data.object);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
