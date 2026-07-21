import type { Database } from "@/lib/supabase/database.types";

type PurchaseOrder = Database["public"]["Tables"]["purchase_orders"]["Row"];

export function poRef(id: string): string {
  return `#${id.slice(0, 6).toUpperCase()}`;
}

// Mirrors the is_overdue logic in the purchase_orders_with_status SQL view.
export function isPurchaseOrderOverdue(po: PurchaseOrder): boolean {
  if (po.stage === "delivered") return false;
  const today = new Date().toISOString().slice(0, 10);

  const depositOverdue =
    !!po.deposit_due_date && !po.deposit_paid && po.deposit_due_date < today;
  const balanceOverdue =
    !!po.balance_due_date && !po.balance_paid && po.balance_due_date < today;

  return depositOverdue || balanceOverdue;
}

export const PO_STAGES: { value: PurchaseOrder["stage"]; label: string }[] = [
  { value: "quoting", label: "Quoting" },
  { value: "sampling", label: "Sampling" },
  { value: "deposit_paid", label: "Deposit Paid" },
  { value: "in_production", label: "In Production" },
  { value: "shipping", label: "Shipping" },
  { value: "delivered", label: "Delivered" },
];
