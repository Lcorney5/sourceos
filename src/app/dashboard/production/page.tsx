import Link from "next/link";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/table";

export default async function ProductionPage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: purchaseOrders } = await supabase
    .from("purchase_orders")
    .select("*, suppliers(name)")
    .eq("workspace_id", workspace.id)
    .eq("stage", "in_production")
    .order("target_delivery_date", { ascending: true, nullsFirst: false });

  const { data: recentLogs } = await supabase
    .from("production_logs")
    .select("purchase_order_id, note, created_at")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  const latestLogByPO = new Map<string, { note: string; created_at: string }>();
  for (const log of recentLogs ?? []) {
    if (!latestLogByPO.has(log.purchase_order_id)) {
      latestLogByPO.set(log.purchase_order_id, log);
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Manifest" title="Production" />
      {!purchaseOrders?.length ? (
        <EmptyState message="No purchase orders currently in production." />
      ) : (
        <div className="flex flex-col divide-y divide-ink/20 border border-ink">
          {purchaseOrders.map((po) => {
            const latest = latestLogByPO.get(po.id);
            return (
              <Link
                key={po.id}
                href={`/dashboard/purchase-orders/${po.id}`}
                className="flex items-center justify-between gap-4 p-4 hover:bg-ink/5"
              >
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold leading-tight">
                    {po.product_name}
                  </p>
                  <p className="font-mono text-xs text-muted">
                    {po.suppliers?.name ?? "—"}
                    {po.target_delivery_date && <> · Target {po.target_delivery_date}</>}
                  </p>
                  {latest && (
                    <p className="mt-1 truncate text-sm text-ink">
                      Latest: {latest.note}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
