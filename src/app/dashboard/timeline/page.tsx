import Link from "next/link";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/table";
import { LinkButton } from "@/components/ui/button";
import { StageSteps } from "@/components/purchase-orders/stage-steps";
import { OverdueBadge } from "@/components/ui/stamp-badge";
import { isPurchaseOrderOverdue, poRef } from "@/lib/purchase-orders";

export default async function TimelinePage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: purchaseOrders } = await supabase
    .from("purchase_orders")
    .select("*, suppliers(name)")
    .eq("workspace_id", workspace.id)
    .order("target_delivery_date", { ascending: true, nullsFirst: false });

  const pos = purchaseOrders ?? [];
  const overdueCount = pos.filter(isPurchaseOrderOverdue).length;

  return (
    <div>
      <PageHeader
        title="Timeline"
        subtitle={`${pos.length} orders in pipeline · ${overdueCount} overdue`}
      />
      {!pos.length ? (
        <EmptyState
          message="No purchase orders to track yet."
          action={<LinkButton href="/dashboard/purchase-orders/new">Create a PO</LinkButton>}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {pos.map((po) => {
            const overdue = isPurchaseOrderOverdue(po);
            return (
              <Link
                key={po.id}
                href={`/dashboard/purchase-orders/${po.id}`}
                className="block border border-ink p-4 hover:bg-ink/5"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-muted">{poRef(po.id)}</p>
                    <p className="font-display text-lg font-bold uppercase leading-tight">
                      {po.product_name}
                    </p>
                    <p className="font-mono text-xs text-muted">
                      {po.suppliers?.name ?? "—"} · {po.currency} {po.total_amount.toFixed(2)} · Target:{" "}
                      {po.target_delivery_date ?? "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted">
                      Deposit
                    </p>
                    <p className="font-mono text-sm text-ink">
                      {po.deposit_amount > 0 ? po.deposit_amount.toFixed(2) : "—"}
                    </p>
                    {overdue && (
                      <div className="mt-1">
                        <OverdueBadge />
                      </div>
                    )}
                  </div>
                </div>
                <StageSteps stage={po.stage} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
