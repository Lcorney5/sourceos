import { Card, CardBody } from "@/components/ui/card";
import { StampBadge } from "@/components/ui/stamp-badge";
import { LinkButton } from "@/components/ui/button";
import type { WorkspacePlan } from "@/lib/supabase/database.types";

export function UpgradeGate({ feature, minPlan }: { feature: string; minPlan: WorkspacePlan }) {
  const label = minPlan.charAt(0).toUpperCase() + minPlan.slice(1);
  return (
    <Card className="border-dashed">
      <CardBody className="flex flex-col items-center gap-4 py-16 text-center">
        <StampBadge tone="rust">Locked</StampBadge>
        <p className="max-w-md font-mono text-xs text-muted">
          {feature} is available on the {label} plan and above.
        </p>
        <LinkButton href="/dashboard/billing">Upgrade Plan</LinkButton>
      </CardBody>
    </Card>
  );
}
