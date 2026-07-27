"use client";

import { useTransition } from "react";
import { deletePurchaseOrder } from "@/lib/actions/purchase-orders";

export function DeletePOButton({ poId }: { poId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this purchase order?")) startTransition(() => deletePurchaseOrder(poId));
      }}
      className="font-mono text-[0.6875rem] font-semibold uppercase text-rust hover:underline disabled:opacity-40"
    >
      Delete
    </button>
  );
}
