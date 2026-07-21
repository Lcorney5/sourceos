import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { POStageSelect } from "@/components/purchase-orders/po-stage-select";
import { OverdueBadge } from "@/components/ui/stamp-badge";
import { isPurchaseOrderOverdue } from "@/lib/purchase-orders";
import Link from "next/link";

export default async function PurchaseOrdersPage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: purchaseOrders } = await supabase
    .from("purchase_orders")
    .select("*, suppliers(name)")
    .eq("workspace_id", workspace.id)
    .order("order_date", { ascending: false });

  return (
    <div>
      <PageHeader
        eyebrow="Manifest"
        title="Purchase Orders"
        actions={<LinkButton href="/dashboard/purchase-orders/new">+ New PO</LinkButton>}
      />
      {!purchaseOrders?.length ? (
        <EmptyState
          message="No purchase orders yet."
          action={<LinkButton href="/dashboard/purchase-orders/new">Create your first PO</LinkButton>}
        />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Product</Th>
              <Th>Supplier</Th>
              <Th>Total</Th>
              <Th>Stage</Th>
              <Th>Target Delivery</Th>
              <Th></Th>
            </tr>
          </Thead>
          <tbody>
            {purchaseOrders.map((po) => (
              <Tr key={po.id} className={isPurchaseOrderOverdue(po) ? "bg-rust/5" : undefined}>
                <Td className="font-semibold">
                  <Link href={`/dashboard/purchase-orders/${po.id}`} className="hover:text-rust">
                    {po.product_name}
                  </Link>
                </Td>
                <Td>{po.suppliers?.name ?? "—"}</Td>
                <Td className="font-mono">
                  {po.currency} {po.total_amount.toFixed(2)}
                </Td>
                <Td>
                  <POStageSelect poId={po.id} stage={po.stage} />
                </Td>
                <Td className="font-mono">{po.target_delivery_date ?? "—"}</Td>
                <Td>{isPurchaseOrderOverdue(po) && <OverdueBadge />}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
