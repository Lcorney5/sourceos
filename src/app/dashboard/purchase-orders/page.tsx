import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { POStageSelect } from "@/components/purchase-orders/po-stage-select";
import { StageSteps } from "@/components/purchase-orders/stage-steps";
import { OverdueBadge } from "@/components/ui/stamp-badge";
import { isPurchaseOrderOverdue, poRef } from "@/lib/purchase-orders";
import Link from "next/link";

export default async function PurchaseOrdersPage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: purchaseOrders } = await supabase
    .from("purchase_orders")
    .select("*, suppliers(name)")
    .eq("workspace_id", workspace.id)
    .order("order_date", { ascending: false });

  const pos = purchaseOrders ?? [];
  const overdueCount = pos.filter(isPurchaseOrderOverdue).length;

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        subtitle={`${pos.length} orders · ${overdueCount} overdue`}
        actions={<LinkButton href="/dashboard/purchase-orders/new">+ New Order</LinkButton>}
      />
      {!pos.length ? (
        <EmptyState
          message="No purchase orders yet."
          action={<LinkButton href="/dashboard/purchase-orders/new">Create your first PO</LinkButton>}
        />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Ref</Th>
              <Th>Supplier</Th>
              <Th>Product</Th>
              <Th>Total</Th>
              <Th>Stage</Th>
              <Th>Deposit</Th>
              <Th>Balance</Th>
              <Th>Status</Th>
            </tr>
          </Thead>
          <tbody>
            {pos.map((po) => (
              <Tr key={po.id} className={isPurchaseOrderOverdue(po) ? "bg-rust/5" : undefined}>
                <Td className="font-mono text-xs text-muted">{poRef(po.id)}</Td>
                <Td className="font-semibold">{po.suppliers?.name ?? "—"}</Td>
                <Td>
                  <Link href={`/dashboard/purchase-orders/${po.id}`} className="hover:text-rust">
                    {po.product_name}
                  </Link>
                </Td>
                <Td className="font-mono">
                  {po.currency} {po.total_amount.toFixed(2)}
                </Td>
                <Td>
                  <POStageSelect poId={po.id} stage={po.stage} />
                </Td>
                <Td className="font-mono">
                  {po.deposit_amount > 0 ? po.deposit_amount.toFixed(2) : "—"}
                </Td>
                <Td className="font-mono">
                  {po.balance_amount > 0 ? po.balance_amount.toFixed(2) : "—"}
                </Td>
                <Td className="min-w-[9rem]">
                  <StageSteps stage={po.stage} showLabels={false} />
                  {isPurchaseOrderOverdue(po) && (
                    <div className="mt-1">
                      <OverdueBadge />
                    </div>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
