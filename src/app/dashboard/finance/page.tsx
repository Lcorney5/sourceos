import Link from "next/link";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { OverdueBadge } from "@/components/ui/stamp-badge";
import { DollarIcon, WalletIcon, TrendDownIcon } from "@/components/dashboard/stat-icons";
import { poRef } from "@/lib/purchase-orders";

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
  const activePOs = pos.filter((po) => po.stage !== "delivered");

  const committedSpend = activePOs.reduce((sum, po) => sum + po.total_amount, 0);

  const depositTotal = pos.reduce((sum, po) => sum + po.deposit_amount, 0);
  const depositPaid = pos.reduce((sum, po) => sum + (po.deposit_paid ? po.deposit_amount : 0), 0);
  const depositOutstanding = depositTotal - depositPaid;

  const outstandingTotal = pos.reduce(
    (sum, po) =>
      sum + (!po.deposit_paid ? po.deposit_amount : 0) + (!po.balance_paid ? po.balance_amount : 0),
    0
  );
  const unpaidBalanceCount = pos.filter((po) => !po.balance_paid).length;

  const supplierGroups = new Map<
    string,
    { orders: number; committed: number; deposits: number; outstanding: number }
  >();
  for (const po of pos) {
    const name = po.suppliers?.name ?? "—";
    const group = supplierGroups.get(name) ?? {
      orders: 0,
      committed: 0,
      deposits: 0,
      outstanding: 0,
    };
    group.orders += 1;
    group.committed += po.total_amount;
    group.deposits += po.deposit_paid ? po.deposit_amount : 0;
    group.outstanding +=
      (!po.deposit_paid ? po.deposit_amount : 0) + (!po.balance_paid ? po.balance_amount : 0);
    supplierGroups.set(name, group);
  }
  const spendBySupplier = [...supplierGroups.entries()].sort((a, b) => b[1].committed - a[1].committed);

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
      <PageHeader
        title="Finance Report"
        subtitle={`${pos.length} purchase orders · $${committedSpend.toLocaleString(undefined, { maximumFractionDigits: 2 })} committed`}
      />

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardBody>
            <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
              <DollarIcon size={16} />
              Total Committed Spend
            </p>
            <p className="font-display text-3xl font-bold text-ink">
              ${committedSpend.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="mt-1 font-mono text-xs text-muted">Across {activePOs.length} orders</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
              <WalletIcon size={16} />
              Deposit Totals
            </p>
            <p className="font-display text-3xl font-bold text-ink">
              ${depositTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="mt-1 font-mono text-xs text-muted">
              ${depositPaid.toLocaleString(undefined, { maximumFractionDigits: 2 })} paid · $
              {depositOutstanding.toLocaleString(undefined, { maximumFractionDigits: 2 })} outstanding
            </p>
          </CardBody>
        </Card>
        <Card className={outstandingTotal > 0 ? "border-rust" : undefined}>
          <CardBody>
            <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
              <TrendDownIcon size={16} />
              Outstanding Balance
            </p>
            <p className="font-display text-3xl font-bold text-rust">
              ${outstandingTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="mt-1 font-mono text-xs text-muted">{unpaidBalanceCount} unpaid balances</p>
          </CardBody>
        </Card>
      </div>

      <p className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
        Spend by Supplier
      </p>
      {!spendBySupplier.length ? (
        <div className="mb-8">
          <EmptyState message="No purchase orders yet." />
        </div>
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Supplier</Th>
              <Th>Orders</Th>
              <Th>Total Committed</Th>
              <Th>Deposits</Th>
              <Th>Outstanding Balance</Th>
            </tr>
          </Thead>
          <tbody>
            {spendBySupplier.map(([name, group]) => (
              <Tr key={name}>
                <Td className="font-semibold">{name}</Td>
                <Td className="font-mono">{group.orders}</Td>
                <Td className="font-mono">
                  ${group.committed.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </Td>
                <Td className="font-mono">
                  ${group.deposits.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </Td>
                <Td className={`font-mono ${group.outstanding > 0 ? "text-rust" : ""}`}>
                  ${group.outstanding.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <p className="mb-3 mt-8 font-display text-xl font-bold uppercase tracking-tight">
        Order-Level Breakdown
      </p>
      {!pos.length ? (
        <div className="mb-8">
          <EmptyState message="No purchase orders yet." />
        </div>
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Ref</Th>
              <Th>Supplier</Th>
              <Th>Product</Th>
              <Th>Total</Th>
              <Th>Deposit</Th>
              <Th>Balance</Th>
              <Th>Status</Th>
            </tr>
          </Thead>
          <tbody>
            {pos.map((po) => (
              <Tr key={po.id}>
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
                <Td className="font-mono">
                  {po.deposit_amount > 0 ? po.deposit_amount.toFixed(2) : "—"}
                </Td>
                <Td className="font-mono">
                  {po.balance_amount > 0 ? po.balance_amount.toFixed(2) : "—"}
                </Td>
                <Td className="capitalize">{po.stage.replace(/_/g, " ")}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <Card className="mt-8">
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
