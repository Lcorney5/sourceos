import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/table";
import { ActivityItem } from "@/components/activity/activity-item";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";
import { hasFeature, FEATURE_MIN_PLAN } from "@/lib/plan-limits";

export default async function ActivityLogPage() {
  const { workspace } = await requireWorkspace();

  if (!hasFeature(workspace.plan, FEATURE_MIN_PLAN.activityLog)) {
    return (
      <div>
        <PageHeader eyebrow="Manifest" title="Activity Log" />
        <UpgradeGate feature="Activity Log" minPlan={FEATURE_MIN_PLAN.activityLog} />
      </div>
    );
  }

  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("activity_log")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <PageHeader eyebrow="Manifest" title="Activity Log" />
      {!entries?.length ? (
        <EmptyState message="No activity recorded yet." />
      ) : (
        <ul className="flex flex-col gap-4 border border-ink p-4">
          {entries.map((entry) => (
            <ActivityItem key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </div>
  );
}
