import { Table, Thead, Th, Tr, Td } from "@/components/ui/table";
import { OverdueBadge } from "@/components/ui/stamp-badge";
import { StageSteps } from "@/components/purchase-orders/stage-steps";
import type { POStage } from "@/lib/supabase/database.types";

const ORDERS: {
  supplier: string;
  product: string;
  total: string;
  stage: POStage;
  deposit: string;
  balance: string;
  overdue: boolean;
}[] = [
  {
    supplier: "Guangzhou Canvas Co.",
    product: "12oz Canvas Tote Bag",
    total: "$1,200.00",
    stage: "in_production",
    deposit: "360.00",
    balance: "840.00",
    overdue: true,
  },
  {
    supplier: "Ningbo Textile Group",
    product: "Recycled Poly Mailers",
    total: "$850.00",
    stage: "shipping",
    deposit: "255.00",
    balance: "595.00",
    overdue: false,
  },
  {
    supplier: "Xiamen Bagworks",
    product: "Cotton Drawstring Pouch",
    total: "$2,400.00",
    stage: "quoting",
    deposit: "—",
    balance: "—",
    overdue: false,
  },
];

export function POPreview() {
  return (
    <div className="mx-auto max-w-4xl border border-ink bg-paper-card shadow-[6px_6px_0_0_var(--color-ink)]">
      <div className="flex items-center justify-between border-b border-ink px-4 py-2">
        <span className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted">
          Manifest / Purchase Orders
        </span>
        <span className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted">
          3 orders &middot; 1 overdue
        </span>
      </div>
      <div className="p-4">
        <Table>
          <Thead>
            <tr>
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
            {ORDERS.map((po) => (
              <Tr key={po.product} className={po.overdue ? "bg-rust/5" : undefined}>
                <Td className="font-semibold">{po.supplier}</Td>
                <Td>{po.product}</Td>
                <Td className="font-mono">{po.total}</Td>
                <Td className="min-w-[9rem]">
                  <StageSteps stage={po.stage} showLabels={false} />
                </Td>
                <Td className="font-mono">{po.deposit}</Td>
                <Td className="font-mono">{po.balance}</Td>
                <Td>{po.overdue ? <OverdueBadge /> : <span className="text-muted">—</span>}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
