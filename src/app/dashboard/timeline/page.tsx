import Link from "next/link";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/table";
import { LinkButton } from "@/components/ui/button";
import { StageProgressBar } from "@/components/purchase-orders/stage-progress-bar";
import { OverdueBadge } from "@/components/ui/stamp-badge";
import { isPurchaseOrderOverdue } from "@/lib/purchase-orders";

export default async function TimelinePage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: purchaseOrders } = await supabase
    .from("purchase_orders")
    .select("*, suppliers(name)")
    .eq("workspace_id", workspace.id)
    .order("target_delivery_date", { ascending: true, nullsFirst: false });

  return (
    <div>
      <PageHeader eyebrow="Manifest" title="Timeline" />
      {!purchaseOrders?.length ? (
        <EmptyState
          message="No purchase orders to track yet."
          action={<LinkButton href="/dashboard/purchase-orders/new">Create a PO</LinkButton>}
        />
      ) : (
        <div className="flex flex-col divide-y divide-ink/20 border border-ink">
          {purchaseOrders.map((po) => {
            const overdue = isPurchaseOrderOverdue(po);
            return (
              <Link
                key={po.id}
                href={`/dashboard/purchase-orders/${po.id}`}
                className="grid grid-cols-1 gap-3 p-4 hover:bg-ink/5 md:grid-cols-[1fr_2fr] md:items-center md:gap-6"
              >
                <div>
                  <p className="font-display text-lg font-semibold leading-tight">
                    {po.product_name}
                  </p>
                  <p className="font-mono text-xs text-muted">
                    {po.suppliers?.name ?? "—"} ·{" "}
                    {po.target_delivery_date
                      ? `Target ${po.target_delivery_date}`
                      : "No target date"}
                  </p>
                  {overdue && (
                    <div className="mt-1">
                      <OverdueBadge />
                    </div>
                  )}
                </div>
                <StageProgressBar stage={po.stage} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
