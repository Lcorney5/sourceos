import { requireWorkspace } from "@/lib/auth/dal";
import { PageHeader, Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StampBadge } from "@/components/ui/stamp-badge";
import { createCheckoutSession, createPortalSession } from "@/lib/actions/billing";
import type { PlanKey } from "@/lib/stripe";

const TIERS: { key: PlanKey; name: string; price: string; blurb: string; features: string[] }[] = [
  {
    key: "starter",
    name: "Starter",
    price: "$15/mo",
    blurb: "1 user, up to 3 active products",
    features: ["Supplier & quote tracking"],
  },
  {
    key: "growth",
    name: "Growth",
    price: "$60/mo",
    blurb: "Up to 3 users, unlimited products",
    features: ["Full sample & PO tracking", "Timeline view", "AI quote parsing"],
  },
  {
    key: "agency",
    name: "Agency",
    price: "$130/mo",
    blurb: "Multi-client workspaces, unlimited users",
    features: ["Everything in Growth", "AI negotiation-assist", "Supplier risk flagging"],
  },
];

export default async function BillingPage() {
  const { workspace, profile } = await requireWorkspace();
  const isOwner = profile.role === "owner";

  return (
    <div>
      <PageHeader eyebrow="Workspace" title="Billing" />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardBody className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StampBadge tone="steel">{workspace.plan}</StampBadge>
            <StampBadge
              tone={
                workspace.subscription_status === "active" ||
                workspace.subscription_status === "trialing"
                  ? "steel"
                  : workspace.subscription_status === "past_due"
                    ? "rust"
                    : "amber"
              }
            >
              {workspace.subscription_status}
            </StampBadge>
          </div>
          {isOwner && workspace.stripe_customer_id && (
            <form action={createPortalSession}>
              <Button type="submit" variant="secondary">
                Manage Billing
              </Button>
            </form>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TIERS.map((tier) => (
          <Card key={tier.key} className={workspace.plan === tier.key ? "border-rust" : undefined}>
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <p className="mt-1 font-mono text-2xl font-bold">{tier.price}</p>
            </CardHeader>
            <CardBody>
              <p className="mb-3 text-sm text-muted">{tier.blurb}</p>
              <ul className="mb-4 flex flex-col gap-1">
                {tier.features.map((f) => (
                  <li key={f} className="font-mono text-xs text-ink">
                    · {f}
                  </li>
                ))}
              </ul>
              {isOwner ? (
                workspace.plan === tier.key ? (
                  <StampBadge tone="ink">Current Plan</StampBadge>
                ) : (
                  <form action={createCheckoutSession.bind(null, tier.key)}>
                    <Button type="submit" className="w-full">
                      {workspace.plan === "starter" && tier.key !== "starter" ? "Upgrade" : "Switch"}
                    </Button>
                  </form>
                )
              ) : (
                <p className="font-mono text-xs text-muted">Only the workspace owner can change plans.</p>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
