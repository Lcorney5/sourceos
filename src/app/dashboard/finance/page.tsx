import Link from "next/link";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { OverdueBadge } from "@/components/ui/stamp-badge";

type Payment = {
  poId: string;
  productName: string;
  supplierName: string;
  kind: "Deposit" | "Balance";
  amount: number;
  currency: string;
  dueDate: string;
  overdue: boolean;
};

export default async function FinancePage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: purchaseOrders } = await supabase
    .from("purchase_orders")
    .select("*, suppliers(name)")
    .eq("workspace_id", workspace.id);

  const pos = purchaseOrders ?? [];
  const today = new Date().toISOString().slice(0, 10);

  const committedSpend = pos
    .filter((po) => po.stage !== "delivered")
    .reduce((sum, po) => sum + po.total_amount, 0);

  const paidTotal = pos.reduce(
    (sum, po) =>
      sum + (po.deposit_paid ? po.deposit_amount : 0) + (po.balance_paid ? po.balance_amount : 0),
    0
  );
  const outstandingTotal = pos.reduce(
    (sum, po) =>
      sum + (!po.deposit_paid ? po.deposit_amount : 0) + (!po.balance_paid ? po.balance_amount : 0),
    0
  );

  const upcomingPayments: Payment[] = [];
  for (const po of pos) {
    if (po.stage === "delivered") continue;
    if (!po.deposit_paid && po.deposit_due_date && po.deposit_amount > 0) {
      upcomingPayments.push({
        poId: po.id,
        productName: po.product_name,
        supplierName: po.suppliers?.name ?? "—",
        kind: "Deposit",
        amount: po.deposit_amount,
        currency: po.currency,
        dueDate: po.deposit_due_date,
        overdue: po.deposit_due_date < today,
      });
    }
    if (!po.balance_paid && po.balance_due_date && po.balance_amount > 0) {
      upcomingPayments.push({
        poId: po.id,
        productName: po.product_name,
        supplierName: po.suppliers?.name ?? "—",
        kind: "Balance",
        amount: po.balance_amount,
        currency: po.currency,
        dueDate: po.balance_due_date,
        overdue: po.balance_due_date < today,
      });
    }
  }
  upcomingPayments.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div>
      <PageHeader eyebrow="Manifest" title="Finance" />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardBody>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Committed Spend
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-ink">
              ${committedSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Paid</p>
            <p className="mt-2 font-display text-3xl font-bold text-steel">
              ${paidTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </CardBody>
        </Card>
        <Card className={outstandingTotal > 0 ? "border-rust" : undefined}>
          <CardBody>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Outstanding</p>
            <p className="mt-2 font-display text-3xl font-bold text-rust">
              ${outstandingTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          {upcomingPayments.length === 0 ? (
            <div className="p-4">
              <EmptyState message="No unpaid deposits or balances due." />
            </div>
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Product</Th>
                  <Th>Supplier</Th>
                  <Th>Type</Th>
                  <Th>Amount</Th>
                  <Th>Due Date</Th>
                  <Th></Th>
                </tr>
              </Thead>
              <tbody>
                {upcomingPayments.map((p, i) => (
                  <Tr key={i}>
                    <Td className="font-semibold">
                      <Link href={`/dashboard/purchase-orders/${p.poId}`} className="hover:text-rust">
                        {p.productName}
                      </Link>
                    </Td>
                    <Td>{p.supplierName}</Td>
                    <Td>{p.kind}</Td>
                    <Td className="font-mono">
                      {p.currency} {p.amount.toFixed(2)}
                    </Td>
                    <Td className="font-mono">{p.dueDate}</Td>
                    <Td>{p.overdue && <OverdueBadge />}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
